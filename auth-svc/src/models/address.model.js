const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const addressSchema = new Schema(
    {
        unitNumber: {
            type: String,
            required: false,
            default: null
        },
        buildingNumber: {
            type: String,
            required: true,
        },
        streetName: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        province: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Types.ObjectId, ref: 'User', required: true,
        },
        isDefault: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
