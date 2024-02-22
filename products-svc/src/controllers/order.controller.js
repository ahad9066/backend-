const JoiController = require("../shared/controllers/joi.controller");
const validators = require("../validators");
const OrderService = new (require("../services/order.service"));

const serializers = require("../serializers");

const _ = require('lodash')



exports.placeOrders = async (req, res, next) => {
    try {
        if (_.size(req.body) === 0) {
            throw ({ statusCode: 422, message: 'Cannot update empty details!' })
        }
        const payload = await JoiController.validateSchema(
            validators.order.orderSchema,
            req.body
        );
        let token = req.headers['authorization'];
        if (token) {
            token = token.replace('Bearer ', '');
        }
        const order = await OrderService.placeOrder(payload, token);
        console.log("orderrr", order)
        res.json(serializers.order.orderDetails(order))
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
exports.getOrdersByUserId = async (req, res, next) => {
    try {
        const userOrdersList = await OrderService.getOrdersByUserId(req.params['userId']);
        res.status(200).json({
            orders: userOrdersList.map(serializers.order.orderDetails),
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
exports.getAllOrders = async (req, res, next) => {
    try {
        const userOrdersList = await OrderService.getAllOrders();
        res.status(200).json({
            orders: userOrdersList.map(serializers.order.orderDetails),
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}