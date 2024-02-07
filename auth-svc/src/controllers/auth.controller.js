const AuthService = new (require('../shared/services/auth.service'))
const UserService = new (require("../services/user.service"));
const Joi = require('joi')
const validators = require("../validators");
const JoiController = require("../shared/controllers/joi.controller");
const serializers = require('../serializers')
const permission = require('../shared/middlewares/permission.middleware')


exports.health = async (req, res, next) => {
    return res.status(200).json({ message: 'Auth svc is running' })
}


exports.signUp = async (req, res, next) => {
    try {
        const payload = await JoiController.validateSchema(
            validators.user.create,
            req.body
        );
        const user = await UserService.create(payload);
        res.status(201).json(serializers.user.signedUpUser(user));
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const schema = Joi.object({
            username: Joi.alternatives().try(
                Joi.string().email(),
                Joi.number().integer().min(1000000000).max(9999999999) // Validate as a 10-digit number
            ).required(),
            password: Joi.string().required()
        });
        const payload = await JoiController.validateSchema(schema, req.body);
        const { error: emailError } = Joi.string().email().validate(payload.username);
        const isUsernameEmail = emailError === undefined;
        const token = await AuthService.login(isUsernameEmail, payload.username, payload.password);
        res.json(token)
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.changePassword = async (req, res, next) => {
    try {
        const schema = Joi.object({
            user_id: Joi.string().required(),
            old_password: Joi.string().required(),
            new_password: Joi.string().required(),
            confirm_password: Joi.string().required().valid(Joi.ref('new_password')).messages({
                'any.only': 'Confirm password does not match'
            }).required(),
        });

        const payload = await JoiController.validateSchema(schema, req.body);
        await AuthService.changePassword(payload['user_id'], payload['old_password'], payload['new_password']);
        res.json({ message: 'Password has been changed successfully!' })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
exports.resetPassword = async (req, res, next) => {
    try {
        const schema = Joi.object({
            user_id: Joi.string().required(),
            new_password: Joi.string().required(),
            confirm_password: Joi.string().required().valid(Joi.ref('new_password')).messages({
                'any.only': 'Confirm password does not match'
            }).required(),
        });
        const payload = await JoiController.validateSchema(schema, req.body);
        await AuthService.resetPassword(payload['user_id'], payload['new_password']);

        res.json({ message: 'Password has been updated successfully!' })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.logout = async (req, res, next) => {
    try {
        await AuthService.logout(req);
        res.json({ message: 'Logged out successfully!' })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}
exports.permission = async (req, res, next) => {
    try {
        res.json({ user: req.user, iat: req.iat, is_authenticated: res.is_authenticated })
    } catch (err) {
        console.log('errr', err)
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}