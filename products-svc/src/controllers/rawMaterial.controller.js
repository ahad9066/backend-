const JoiController = require("../shared/controllers/joi.controller");
const validators = require("../validators");
const RawMaterialService = new (require("../services/rawMaterial.service"));

const serializers = require("../serializers");

const _ = require('lodash')


exports.getRawMaterials = async (req, res, next) => {
    try {
        const rawMaterialsList = await RawMaterialService.get();
        res.status(200).json({
            rawMaterials: rawMaterialsList.map(serializers.rawMaterial.rawMaterialsDetails),
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


exports.updateawMaterials = async (req, res, next) => {
    try {
        rawMaterials = req.body;
        const { productQuantities, remainingRawMaterials } = await RawMaterialService.updateRawMaterials(rawMaterials);

        res.json({
            productQuantities,
            remainingRawMaterials
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    }
}
exports.initRawMaterials = async (req, res, next) => {
    try {
        const payload = await JoiController.validateSchema(
            validators.rawMaterials.addRawMaterial,
            req.body
        );
        const addedRawMaterials = await RawMaterialService.addRawMaterialsToDb(payload);
        res.json(addedRawMaterials)
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err)
    }
}







