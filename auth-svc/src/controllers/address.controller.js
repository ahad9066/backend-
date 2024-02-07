const JoiController = require("../shared/controllers/joi.controller");
const validators = require("../validators");
const AddressService = new (require("../services/address.service"));

const serializers = require("../serializers");

const _ = require('lodash')



exports.getUserAddresses = async (req, res, next) => {
    try {
        const addressList = await AddressService.getUserAllAddress(req.params['userId']);
        res.status(200).json({
            users: addressList.map(serializers.address.addressDetails),
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.addUserAddress = async (req, res, next) => {
    try {
        if (_.size(req.body) === 0) {
            throw ({ statusCode: 422, message: 'Cannot update empty details!' })
        }
        const payload = await JoiController.validateSchema(
            validators.address.addAddress,
            req.body
        );
        const added_address = await AddressService.addAddress({ ...payload, userId: req.user._id });
        res.json(serializers.address.addressDetails(added_address))
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.updateUserAddress = async (req, res, next) => {
    try {
        if (_.size(req.body) === 0) {
            throw ({ statusCode: 422, message: 'Cannot update empty details!' })
        }
        const payload = await JoiController.validateSchema(
            validators.address.updateAddress,
            req.body
        );
        const updated_address = await AddressService.updateAddress(req.params['addressId'], payload);
        res.json(serializers.address.addressDetails(updated_address))
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}



