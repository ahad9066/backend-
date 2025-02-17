const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const rawMaterialsSchema = new Schema(
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
        stockCount: {
            type: Number,
            required: true,
        },
        holdCount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("rawMaterials", rawMaterialsSchema);
