const JoiController = require("../shared/controllers/joi.controller");
const validators = require("../validators");
const UserService = new (require("../services/user.service"));

const serializers = require("../serializers");

const _ = require('lodash')




exports.getUsers = async (req, res, next) => {
    try {
        const usersList = await UserService.get();
        res.status(200).json({
            users: usersList.map(serializers.user.signedUpUser),
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        user = await UserService.getById(req.params['id']);
        res.json(serializers.user.userDetails(user))
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};



exports.updateUser = async (req, res, next) => {
    try {
        if (_.size(req.body) === 0) {
            throw ({ statusCode: 422, message: 'Cannot update empty details!' })
        }
        const payload = await JoiController.validateSchema(
            validators.user.updateUser,
            req.body
        );
        const updated_user = await UserService.update(req.params['id'], payload);
        res.json(serializers.user(updated_user))
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}



