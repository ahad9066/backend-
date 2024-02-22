const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const statusConstants = require('../constants/status.constants');

const orderSchema = new Schema({
    orderId: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    address: {
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
        }
    },
    orderItems: [{
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
    }],
    totalAmount: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return [...Object.values(statusConstants)].includes(value);
            },
            message: props => `${props.value} is not a valid status.`
        }
    },
    invoiceFileKey: {
        type: String,
        required: false,
        default: null
    },
    isInvoiceGenerated: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true });



module.exports = mongoose.model("Order", orderSchema);