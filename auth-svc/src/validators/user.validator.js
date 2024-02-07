
const Joi = require('joi');
const PROVINCE = require('../constants/province.constants');
const COUNTRY = require('../constants/country.constant');

module.exports = {
    create: Joi.object({
        email: Joi.string().email().required(),
        countryCode: Joi.string().required(),
        mobile: Joi.number().required().custom((value, helpers) => {
            const stringValue = value.toString();
            console.log('mobiele', stringValue, stringValue.length)
            if (stringValue.length !== 10) {
                return helpers.error('any.invalid', { message: 'mobile number must be a 10-digit number' });
            }
            return value;
        }),
        password: Joi.string().min(5).required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        address: {
            unitNumber: Joi.string().required(),
            buildingNumber: Joi.string().required(),
            streetName: Joi.string().required(),
            city: Joi.string().required(),
            province: Joi.string().required().valid(...Object.keys(PROVINCE)),
            postalCode: Joi.string().required().regex(/^([ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ])\ {0,1}(\d[ABCEGHJKLMNPRSTVWXYZ]\d)$/i)
                .message('Invalid Canadian postal code format'),
            country: Joi.string().required().valid(...Object.keys(COUNTRY)),
            isDefault: Joi.boolean().required().default(false),
        },
        isMobileVerified: Joi.boolean().required().default(false),
        isEmailVerified: Joi.boolean().required().default(false),
    }),
    updateUser: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email(),
        countryCode: Joi.string(),
        mobile: Joi.number().custom((value, helpers) => {
            const stringValue = value.toString();
            if (stringValue.length !== 10) {
                return helpers.error('any.invalid', { message: 'mobile number must be a 10-digit number' });
            }
            return value;
        }),
    })
}