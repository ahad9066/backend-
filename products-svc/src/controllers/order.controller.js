const JoiController = require("../shared/controllers/joi.controller");
const validators = require("../validators");
const OrderService = new (require("../services/order.service"));
const invoiceService = new (require('../services/invoice.service'))

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
exports.cancelOrder = async (req, res, next) => {
    try {
        const cancelledOrder = await OrderService.cancelOrder(req.params['orderId'], req.user);
        console.log("orderrr", cancelledOrder)
        res.json(serializers.order.orderDetails(cancelledOrder))
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
exports.downloadInvoice = async (req, res, next) => {
    try {
        if (!req.body.fileKey) {
            throw ({ statusCode: 422, message: 'Cannot donwload empty file!' })
        }
        const payload = req.body.fileKey;
        const readStream = await invoiceService.downloadFile(payload)
        readStream.pipe(res);

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

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

exports.updatePaymentConfirmation = async (req, res, next) => {
    try {
        if (_.size(req.body) === 0) {
            throw ({ statusCode: 422, message: 'Cannot update empty details!' })
        }
        const payload = await JoiController.validateSchema(
            validators.order.paymentUpdateSchema,
            req.body
        );
        let token = req.headers['authorization'];
        if (token) {
            token = token.replace('Bearer ', '');
        }
        const userOrdersList = await OrderService.updatePaymentConfirmation(payload.orderId, payload.isPaymentSuccessful, token);
        console.log("userOrdersList", userOrdersList)
        res.json(serializers.order.orderDetails(userOrdersList))

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}