const mongoose = require('mongoose');

exports.isObjectIdValid = (id) => {
    return mongoose.isValidObjectId(id);
};