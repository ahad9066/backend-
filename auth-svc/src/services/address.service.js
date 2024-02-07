const AddressModel = require('../models/address.model')
const UserModel = require('../models/user.model')

class AddressService {
    constructor() {
        this.model = AddressModel;
    }
    async getUserAllAddress(userId) {
        try {
            const addresses = await this.model.find({ userId }).sort({ createdAt: -1 });
            return addresses;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async addAddress(payload) {
        try {
            const newAddress = await this.model.create(payload);
            const user = await UserModel.findById({ _id: payload.userId });
            user.addresses.push(newAddress._id);
            return user.save();
        } catch (err) {
            throw (err)
        }
    }

    async updateAddress(addressId, payload) {
        try {
            const address = await this.model.findOneAndUpdate({ _id: addressId }, { $set: payload }, {
                new: true
            });
            return address;
        } catch (err) {
            throw (err)
        }
    }



}


module.exports = AddressService 
