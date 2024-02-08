const Joi = require('joi');

const cartItemsSchema = Joi.object({
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
    cartSchema: Joi.object({
        userId: Joi.string().required(),
        cartItems: Joi.array().items(cartItemsSchema).required(),
    })
};