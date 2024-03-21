const orderModel = require('../models/orders.model')
const ShortUniqueId = require('short-unique-id');
const STATUS = require('../constants/status.constants');
const FeTiService = new (require("../services/feTi.service"));
const invoiceService = new (require('../services/invoice.service'));
const { Email } = require('../shared/libraries');
const axios = require("axios");
const generateInvoicePDF = require('../shared/libraries/puppeteer')
const mime = require('mime');




const client = axios.create({
    baseURL: process.env.AUTH_API_BASE_URL,
});
class OrderService {
    constructor() {
        this.model = orderModel;
    }

    async getAllOrders() {
        return this.model.find()
            .sort(`-created_at`);
    }

    async getOrdersByUserId(userId) {
        const userOrders = await this.model.find({ userId: userId });
        return userOrders;
    }

    async findByOrderId(orderId) {
        const userOrder = await this.model.find({ orderId: orderId });
        if (!userOrder) {
            return {
                orderId: orderId,
                orderItems: []
            };
        }
        return { userOrder };
    }

    async placeOrder(payload, token) {
        try {
            const userDetails = await client.request({
                url: `/users/${payload.userId}`,
                method: 'get',
                headers: { Authorization: token, type: 'isCustomer' },
            });
            console.log("userDetails", userDetails.data)
            const uid = new ShortUniqueId();
            const orderId = 'MET_' + uid.rnd();
            console.log("orderID", orderId)
            // TODO: move items to hold count, send email
            for (const item of payload.orderItems) {
                const product = await FeTiService.getById(item.product.id)
                if (!product) {
                    throw new Error(`Product with ID ${item.product.id} not found`);
                }

                // Find the subgrade within the product
                const subGrade = product.subGrades.find(sub => sub.id === item.subGrade.id);
                if (!subGrade) {
                    throw new Error(`Subgrade with ID ${item.subGrade.id} not found in product`);
                }

                // Find the size within the subGrade
                const size = subGrade.sizes.find(siz => siz.id === item.size.id);
                if (!size) {
                    throw new Error(`Subgrade with ID ${item.size.id} not found in product`);
                }
                // Check if there is sufficient stock
                if (size.stockCount < item.quantity) {
                    throw new Error(`Insufficient stock for subGrade with ID ${item.subGrade.id}`);
                }
                // Reduce stockCount and increase holdCount
                size.stockCount -= item.quantity;
                size.holdCount += item.quantity;
                await product.save();
            }
            const newOrder = await this.model.create({
                ...payload,
                orderId: orderId,
                status: STATUS.PAYMENT_INITIATED,
                userId: userDetails.data._id,
                firstName: userDetails.data.firstName,
                lastName: userDetails.data.lastName,
                address: userDetails.data.addresses.find(address => address._id == payload.addressId)
            });
            // console.log("newOrder", newOrder);
            this.sendEmail('make_payment', { email: userDetails.data.email },
                {
                    firstName: userDetails.data.firstName,
                    totalAmount: newOrder.totalAmount,
                    orderId: orderId
                });
            return newOrder;
        } catch (err) {
            // console.log("place order err handler", err.response)
            throw ({
                statusCode: err.response ? err.response.status :

                    err.statusCode ? err.statusCode : 500, message: { err: err }
            })
        }
    }

    async cancelOrder(orderId, user) {
        try {
            const userDetails = await client.request({
                url: `/users/${user._id}`,
                method: 'get',
                headers: { Authorization: token, type: 'isCustomer' },
            });
            const updatedOrder = await this.model.findOneAndUpdate(
                { orderId: orderId }, // Filter criteria to find the order
                { status: STATUS.ORDER_CANCELLED }, // Update to the status field
                { new: true } // To return the updated document
            );
            // TODO: move items to hold count, send email
            for (const item of updatedOrder.orderItems) {
                const product = await FeTiService.getById(item.product.id)
                if (!product) {
                    throw new Error(`Product with ID ${item.product.id} not found`);
                }

                // Find the subgrade within the product
                const subGrade = product.subGrades.find(sub => sub.id === item.subGrade.id);
                if (!subGrade) {
                    throw new Error(`Subgrade with ID ${item.subGrade.id} not found in product`);
                }

                // Find the size within the subGrade
                const size = subGrade.sizes.find(siz => siz.id === item.size.id);
                if (!size) {
                    throw new Error(`Subgrade with ID ${item.size.id} not found in product`);
                }
                // Increase stockCount and decrease holdCount
                size.stockCount += item.quantity;
                size.holdCount -= item.quantity;
                await product.save();
            }
            this.sendEmail('order_cancelled', { email: userDetails.data.email },
                {
                    firstName: userDetails.data.firstName,
                    totalAmount: newOrder.totalAmount,
                    orderId: orderId
                });
            return updatedOrder;
        } catch (err) {
            // console.log("place order err handler", err.response)
            throw ({
                statusCode: err.response ? err.response.status :

                    err.statusCode ? err.statusCode : 500, message: { err: err }
            })
        }
    }

    async updatePaymentConfirmation(orderId, isPaymentSuccessful, token) {
        try {

            const updatedOrder = await this.model.find({ orderId: orderId }).lean();
            const userId = updatedOrder[0].userId.toString();
            console.log("userId", userId)
            const userDetails = await client.request({
                url: `/users/${userId}`,
                method: 'get',
                headers: { Authorization: token, type: 'isCustomer', from: 'employee' },
            });
            console.log("userDetails", userDetails.data)
            const invoiceData = {
                ...updatedOrder[0],
                img_src: null,
                itemsTotal: [],
            };
            // Calculate itemsTotal
            invoiceData.itemsTotal = invoiceData.orderItems.map(item => {
                console.log("total", item.quantity * item.price)
                return item.quantity * item.price
            });
            invoiceData.orderId = updatedOrder[0].orderId;
            console.log("Generating invoice PDF...");
            const { pdfBuffer, templatePath, fileName } = await generateInvoicePDF(invoiceData);
            console.log('Invoice PDF saved successfully.');
            const awsResponse = await invoiceService.uploadFile({
                fileBuffer: pdfBuffer,
                folderName: 'invoices',
                templatePath: templatePath,
                fileName: fileName
            })
            console.log("awsResponse", awsResponse.key)
            const invoiceFileKey = awsResponse.key;
            const attachment = {
                filename: invoiceFileKey.split('/')[1],
                type: mime.getType(invoiceFileKey.split('.')[1]),
                content: pdfBuffer.toString('base64'),
                disposition: 'attachment'
            };

            // return updatedOrder;
            const updatedPaymentOrder = await this.model.findOneAndUpdate(
                { orderId: orderId },
                {
                    status: STATUS.PAYMENT_DONE,
                    invoiceFileKey: invoiceFileKey,
                    isInvoiceGenerated: true
                },
                { new: true }
            );
            for (const item of updatedPaymentOrder.orderItems) {
                const product = await FeTiService.getById(item.product.id)
                if (!product) {
                    throw new Error(`Product with ID ${item.product.id} not found`);
                }

                // Find the subgrade within the product
                const subGrade = product.subGrades.find(sub => sub.id === item.subGrade.id);
                if (!subGrade) {
                    throw new Error(`Subgrade with ID ${item.subGrade.id} not found in product`);
                }

                // Find the size within the subGrade
                const size = subGrade.sizes.find(siz => siz.id === item.size.id);
                if (!size) {
                    throw new Error(`Subgrade with ID ${item.size.id} not found in product`);
                }
                // decrease holdCount
                size.holdCount -= item.quantity;
                await product.save();
            }
            this.sendEmailWithAttachment('order_confirmed',
                { email: userDetails.data.email },
                {
                    firstName: userDetails.data.firstName,
                    totalAmount: `$${parseFloat(updatedOrder[0].totalAmount).toFixed(2)}`,
                    orderId: updatedOrder[0].orderId,
                }, attachment);
            return updatedPaymentOrder;
        } catch (err) {
            console.log("servie err", err)
        }
    }

    async deleteByUserId(userId) {
        try {
            const result = await this.model.deleteOne({ userId: userId });
            return result;
        } catch (err) {
            throw { statusCode: 500, message: { err: err } };
        }
    }

    async sendEmail(template, user, data = {}) {
        console.log("im in sendEmial auth", template)
        return Email.sendTemplate(
            user.email,
            template, { ...data }
        )
            .catch(e => {
                console.log('sendEmail err', e)
                throw { statusCode: 500, message: `Error while sending '${template}' email` };
            });
    }
    async sendEmailWithAttachment(template, user, data = {}, attachment) {
        console.log("im in sendEmailWithAttachment", template)
        return Email.sendTemplate(
            user.email,
            template, { ...data },
            { attachments: [attachment] }
        )
            .catch(e => {
                console.log('err', e)
                throw { statusCode: 500, message: `Error while sending '${template}' email` };
            });
    }
}


module.exports = OrderService 
