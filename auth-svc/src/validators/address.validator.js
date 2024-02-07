const Joi = require('joi');
const PROVINCE = require('../constants/province.constants');
const COUNTRY = require('../constants/country.constant');

module.exports = {
    addAddress: Joi.object({
        unitNumber: Joi.string(),
        buildingNumber: Joi.number().required(),
        streetName: Joi.string().required(),
        city: Joi.string().required(),
        province: Joi.string().required().valid(...Object.keys(PROVINCE)),
        postalCode: Joi.string().required().regex(/^([ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ])\ {0,1}(\d[ABCEGHJKLMNPRSTVWXYZ]\d)$/i)
            .message('Invalid Canadian postal code format'),
        country: Joi.string().required().valid(...Object.keys(COUNTRY)),
        isDefault: Joi.boolean().default(false),
    }),
    updateAddress: Joi.object({
        // _id: Joi.string().required(),
        unitNumber: Joi.string(),
        buildingNumber: Joi.number(),
        streetName: Joi.string(),
        city: Joi.string(),
        province: Joi.string().valid(...Object.keys(PROVINCE)),
        postalCode: Joi.string().regex(/^([ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ])\ {0,1}(\d[ABCEGHJKLMNPRSTVWXYZ]\d)$/i)
            .message('Invalid Canadian postal code format'),
        country: Joi.string().valid(...Object.keys(COUNTRY)),
        isDefault: Joi.boolean().default(false),
    })
}