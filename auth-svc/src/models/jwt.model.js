const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const jwtSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    expiration: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model("JWT", jwtSchema);
