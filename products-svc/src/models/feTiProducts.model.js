const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const compositionSchema = new Schema({
    metalID: {
        type: String,
        required: true,
    },
    metalName: {
        type: String,
        required: true,
    },
    percentage: {
        type: String,
        required: true,
    },
});

const sizeSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    stockCount: {
        type: Number,
        required: true,
    },
});

const subGradeSchema = new Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    composition: [compositionSchema],
    sizes: [sizeSchema],
});

const feTiProductsSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true,
        },
        subGrades: [subGradeSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model("feTiProducts", feTiProductsSchema);
