const Joi = require('joi');

module.exports = {
    addRawMaterial: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        stockCount: Joi.number().required(),
        holdCount: Joi.number().required(),
    }),
};
