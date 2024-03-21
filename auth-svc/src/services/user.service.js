const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const helpers = require("../shared/helpers/index");
const _ = require('lodash')
const serializers = require('../serializers')
const { Email } = require('../shared/libraries');
const AddressService = new (require('./address.service'))

class UserService {
    constructor() {
        this.model = UserModel;
        this.SALT = 12;
    }
    async get() {
        return this.model.find().sort(`-created_at`).populate('addresses');
    }
    async getSelectedUsers(userIds) {
        const users = await this.model.find({ _id: { $in: userIds } }).populate('addresses');
        return users;
    }
    async getById(id) {
        console.log("id", id)
        if (!helpers.db.isObjectIdValid(id)) {
            return Promise.reject({
                statusCode: 404,
                message: `User with ID ${id} does not exist!`,
            });
        }
        return this.model.findOne({ _id: id })
            .populate('addresses')
            .then((user) => {
                if (!user) {
                    return Promise.reject({
                        statusCode: 404,
                        message: `User with ID ${id} does not exist!`,
                    });
                }
                return user;
            });
    }
    async findByEmail(email) {
        const user = await this.model.findOne({ email: email }).populate('addresses');
        if (!user) {
            return Promise.reject({
                statusCode: 404,
                message: "Email does not exist!",
            });
        }
        return user;
    }
    async findByMobile(mobile, options = {}) {
        const user = await this.model.findOne({ mobile: mobile }).populate('addresses');
        console.log('service user', user)
        if (!user && options.throwError === true) {
            return Promise.reject({
                statusCode: 404,
                message: "mobile number does not exist!",
            });
        }
        return user;
    }
    async create(payload, userId) {
        try {
            const user = await this.model.create({
                email: payload.email,
                countryCode: payload.countryCode,
                mobile: payload.mobile,
                password: payload.password ? await this.hashPassword(payload.password) : null,
                firstName: payload.firstName,
                lastName: payload.lastName,
                isMobileVerified: payload.isMobileVerified,
                isEmailVerified: payload.isEmailVerified,
                addresses: []
            });

            const addressDetails = {
                ...payload.address,
                userId: user._id
            };
            const addressId = await AddressService.addAddress(addressDetails);
            user.addresses.push(addressId);
            await user.save();
            // this.sendEmail('welcome', user, { password: payload.password });
            // EmailService.sendEmail('signup', user)
            return user;
        } catch (err) {
            console.log('create user error:', err)
            if (err.keyPattern) {
                throw ({ statusCode: 422, message: err.keyPattern.email ? `Email already registered` : 'Mobile number already registered' })
            }
            throw ({ statusCode: 500, message: { err: err } })
        }
    }
    async sendEmail(template, user, data = {}) {
        return Email.sendTemplate(
            user.email,
            template, { ...serializers.user(user), ...data }
        )
            .catch(e => {
                console.log('err', e)
                throw { statusCode: 500, message: `Error while sending '${template}' email` };
            });
    }

    async update(id, payload) {
        try {
            const user = await this.model.findOneAndUpdate({ _id: id }, { $set: payload }, { new: true })
            return user;
        } catch (err) {
            console.log('err', err)
            throw ({ statusCode: 500, message: 'Error in updating user name', err })
        }

    }

    async updatePassword(user, password) {
        password = await this.hashPassword(password);
        return this.model.updateOne({ _id: user._id }, { password: password });
    }

    async hashPassword(password) {
        if (password) {
            const salt = await bcrypt.genSalt(this.SALT);
            return bcrypt.hash(password, salt);
        }
    }
    verifyPassword(user, password) {
        if (!password || !user.password) {
            return false;
        }

        return bcrypt.compare(password, user.password);
    }
}

module.exports = UserService;
