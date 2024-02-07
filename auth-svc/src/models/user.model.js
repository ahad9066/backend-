const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        countryCode: {
            type: String,
            required: true,
        },
        mobile: {
            type: Number,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        addresses: [
            {
                type: mongoose.Types.ObjectId, ref: 'Address', required: true, default: []
            }
        ],
        isMobileVerified: {
            type: Boolean,
            required: true,
            default: false
        },
        isEmailVerified: {
            type: Boolean,
            required: true,
            default: false
        }
        // roles: {
        //     type: Array,
        //     required: true,
        // },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
