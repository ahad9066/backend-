const orderModel = require('../models/orders.model')
const ShortUniqueId = require('short-unique-id');
const STATUS = require('../constants/status.constants');
const FeTiService = new (require("../services/feTi.service"));
const { Email } = require('../shared/libraries');
const axios = require("axios");

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
                headers: { Authorization: token },
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
            console.log("newOrder", newOrder);
            this.sendEmail('make_payment', { email: userDetails.data.email },
                {
                    firstName: userDetails.data.firstName,
                    totalAmount: newOrder.totalAmount,
                    orderId: orderId
                });
            return newOrder;
        } catch (err) {
            throw ({ statusCode: 500, message: { err: err } })
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
                console.log('err', e)
                throw { statusCode: 500, message: `Error while sending '${template}' email` };
            });
    }
}


module.exports = OrderService 
