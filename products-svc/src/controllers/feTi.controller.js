const JoiController = require("../shared/controllers/joi.controller");
const validators = require("../validators");
const FeTiService = new (require("../services/feTi.service"));

const serializers = require("../serializers");

const _ = require('lodash')


exports.health = async (req, res, next) => {
    return res.status(200).json({ message: 'Products svc is running' })
}

exports.addFeTiGrade = async (req, res, next) => {
    try {
        if (_.size(req.body) === 0) {
            throw ({ statusCode: 422, message: 'Cannot update empty details!' })
        }
        const payload = await JoiController.validateSchema(
            validators.feTi.addFeTiGrade,
            req.body
        );
        const added_feTiGrade = await FeTiService.addFeTiGrade(payload);
        res.json(serializers.feTi.feTiProductDetails(added_feTiGrade))
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getFeTiProducts = async (req, res, next) => {
    try {
        const productsList = await FeTiService.get();
        res.status(200).json({
            FeTi: productsList.map(serializers.feTi.feTiProductDetails),
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};







