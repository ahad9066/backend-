
const Joi = require('joi');
const ROLES = require('../constants/roles.constants');

module.exports = {
    create: Joi.object({
        email: Joi.string().email().required(),
        countryCode: Joi.string().required(),
        mobile: Joi.number().required().custom((value, helpers) => {
            const stringValue = value.toString();
            if (stringValue.length !== 10) {
                return helpers.error('any.invalid', { message: 'mobile number must be a 10-digit number' });
            }
            return value;
        }),
        password: Joi.string().min(5).required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        roles: Joi.array().items(Joi.string().valid(...Object.keys(ROLES))).required(),
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