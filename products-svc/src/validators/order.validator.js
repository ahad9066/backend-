const Joi = require('joi');
const statusConstants = require('../constants/status.constants');

const itemsSchema = Joi.object({
    product: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
    }),
    subGrade: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
    }),
    size: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
    }),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
});

module.exports = {
    orderSchema: Joi.object({
        // orderId: Joi.string().required(),
        userId: Joi.string().required(),
        addressId: Joi.string().required(),
        orderItems: Joi.array().items(itemsSchema).required(),
        totalAmount: Joi.number().required(),
        status: Joi.string().valid(...Object.values(statusConstants)),
        invoiceFileKey: Joi.string(),
        isInvoiceGenerated: Joi.string(),
    }),
    paymentUpdateSchema: Joi.object({
        orderId: Joi.string().required(),
        isPaymentSuccessful: Joi.boolean().required(),
    }),
};