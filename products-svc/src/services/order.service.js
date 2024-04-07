const orderModel = require('../models/orders.model')
const ShortUniqueId = require('short-unique-id');
const STATUS = require('../constants/status.constants');
const FeTiService = new (require("../services/feTi.service"));
const RawMaterialsService = new (require("../services/rawMaterial.service"));
const invoiceService = new (require('../services/invoice.service'));
const { Email } = require('../shared/libraries');
const axios = require("axios");
const generateInvoicePDF = require('../shared/libraries/puppeteer')
const mime = require('mime');


const ProductRatio = {
    MET_101_68_STD_10_50: [1, 0.5, 0.3, 0.37],
    MET_101_68_MED_10_30: [1, 0.5, 0.3, 0.37],
    MET_101_68_SML_4_10: [1, 0.5, 0.3, 0.37],
    MET_101_68_FIN_0_2: [1, 0.5, 0.3, 0.37],
    MET_101_72_STD_10_50: [1, 0.5, 0.3, 0.37],
    MET_101_72_MED_10_30: [1, 0.5, 0.3, 0.37],
    MET_101_72_SML_4_10: [1, 0.5, 0.3, 0.37],
    MET_101_72_FIN_0_2: [1, 0.5, 0.3, 0.37],
    MET_121_68_STD_10_50: [0.7, 1, 0.3, 0.37],
    MET_121_68_MED_10_30: [0.7, 1, 0.3, 0.37],
    MET_121_68_SML_4_10: [0.7, 1, 0.3, 0.37],
    MET_121_68_FIN_0_2: [0.7, 1, 0.3, 0.37],
    MET_121_72_STD_10_50: [0.7, 1, 0.3, 0.37],
    MET_121_72_MED_10_30: [0.7, 1, 0.3, 0.37],
    MET_121_72_SML_4_10: [0.7, 1, 0.3, 0.37],
    MET_121_72_FIN_0_2: [0.7, 1, 0.3, 0.37],
    MET_131_68_STD_10_50: [0.8, 0.2, 0.3, 0.7],
    MET_131_68_MED_10_30: [0.8, 0.2, 0.3, 0.7],
    MET_131_68_SML_4_10: [0.8, 0.2, 0.3, 0.7],
    MET_131_68_FIN_0_2: [0.8, 0.2, 0.3, 0.7],
    MET_131_72_STD_10_50: [0.8, 0.2, 0.3, 0.7],
    MET_131_72_MED_10_30: [0.8, 0.2, 0.3, 0.7],
    MET_131_72_SML_4_10: [0.8, 0.2, 0.3, 0.7],
    MET_131_72_FIN_0_2: [0.8, 0.2, 0.3, 0.7],
    MET_171_68_STD_10_50: [0.7, 0.3, 0.3, 0.6],
    MET_171_68_MED_10_30: [0.7, 0.3, 0.3, 0.6],
    MET_171_68_SML_4_10: [0.7, 0.3, 0.3, 0.6],
    MET_171_68_FIN_0_2: [0.7, 0.3, 0.3, 0.6],
    MET_171_72_STD_10_50: [0.7, 0.3, 0.3, 0.6],
    MET_171_72_MED_10_30: [0.7, 0.3, 0.3, 0.6],
    MET_171_72_SML_4_10: [0.7, 0.3, 0.3, 0.6],
    MET_171_72_FIN_0_2: [0.7, 0.3, 0.3, 0.6],
}

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
            const rawMat = await RawMaterialsService.get();
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
                const ratio = ProductRatio[subGrade.id + '_' + size.id];
                console.log("ratio", ratio, subGrade.id + '_' + size.id)
                for (let i = 0; i < rawMat.length; i++) {
                    console.log("quantitt", item.quantity)
                    rawMat[i].stockCount -= ratio[i] * item.quantity;
                    rawMat[i].holdCount += ratio[i] * item.quantity;
                    await rawMat[i].save();
                }

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
            const requestRawMat = [];
            for (let i = 0; i < rawMat.length; i++) {
                if (rawMat[i].stockCount < 1000 || rawMat[i].stockCount < 2000) {
                    requestRawMat.push({
                        rawMaterialName: rawMat[i].name,
                        quantity: 1000
                    })
                }
            }
            // console.log("newOrder", newOrder);
            this.sendEmail('make_payment', { email: userDetails.data.email },
                {
                    firstName: userDetails.data.firstName,
                    totalAmount: newOrder.totalAmount,
                    orderId: orderId
                });
            if (requestRawMat.length > 0) {
                this.sendEmail('supplier_stock', { email: 'shamsafrinayesha02@gmail.com' },
                    {
                        firstName: userDetails.data.firstName,
                        orders: requestRawMat
                    });
            }

            return newOrder;
        } catch (err) {
            // console.log("place order err handler", err.response)
            throw ({
                statusCode: err.response ? err.response.status :

                    err.statusCode ? err.statusCode : 500, message: { err: err }
            })
        }
    }

    async cancelOrder(orderId, user, token) {
        try {
            const userDetails = await client.request({
                url: `/users/${user._id}`,
                method: 'get',
                headers: { Authorization: token, type: 'isCustomer' },
            });
            const rawMat = await RawMaterialsService.get();
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
                const ratio = ProductRatio[subGrade.id + '_' + size.id];
                console.log("ratio", ratio, subGrade.id + '_' + size.id)
                for (let i = 0; i < rawMat.length; i++) {
                    console.log("quantitt", item.quantity)
                    rawMat[i].stockCount += ratio[i] * item.quantity;
                    rawMat[i].holdCount -= ratio[i] * item.quantity;
                    await rawMat[i].save();
                }
            }
            this.sendEmail('cancel_order', { email: userDetails.data.email },
                {
                    firstName: userDetails.data.firstName,
                    totalAmount: updatedOrder.totalAmount,
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
            const rawMat = await RawMaterialsService.get();
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
                // templatePath: templatePath,
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
                const ratio = ProductRatio[subGrade.id + '_' + size.id];
                console.log("ratio", ratio, subGrade.id + '_' + size.id)
                for (let i = 0; i < rawMat.length; i++) {
                    console.log("quantitt", item.quantity)
                    rawMat[i].holdCount -= ratio[i] * item.quantity;
                    await rawMat[i].save();
                }
            }

            this.sendEmailWithAttachment('order_placed',
                { email: userDetails.data.email },
                {
                    firstName: userDetails.data.firstName,
                    totalAmount: `$${parseFloat(updatedOrder[0].totalAmount).toFixed(2)}`,
                    orderId: updatedOrder[0].orderId,
                }, attachment);

            return updatedPaymentOrder;
            // return updatedOrder
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
