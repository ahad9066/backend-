const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
    product: {
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
    },
    subGrade: {
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    size: {
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

const userCartSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true
        },
        cartItems: [
            cartItemSchema
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("userCart", userCartSchema);