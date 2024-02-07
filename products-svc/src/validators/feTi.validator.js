const Joi = require('joi');

const compositionSchema = Joi.object({
    metalID: Joi.string().required(),
    metalName: Joi.string().required(),
    percentage: Joi.string().required(),
});

const sizeSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    stockCount: Joi.number().required(),
});

const subGradeSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    composition: Joi.array().items(compositionSchema).required(),
    sizes: Joi.array().items(sizeSchema).required(),
});

module.exports = {
    addFeTiGrade: Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        subGrades: Joi.array().items(subGradeSchema).required(),
    }),
};
