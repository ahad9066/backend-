const EmployeeModel = require("../models/employee.model");
const bcrypt = require("bcrypt");
const helpers = require("../shared/helpers/index");
const _ = require('lodash')
const serializers = require('../serializers')
const { Email } = require('../shared/libraries');

class EmployeeService {
    constructor() {
        this.model = EmployeeModel;
    }
    async get() {
        return this.model.find().sort(`-created_at`);
    }
    async getById(id) {
        if (!helpers.db.isObjectIdValid(id)) {
            return Promise.reject({
                statusCode: 404,
                message: `User with ID ${id} does not exist!`,
            });
        }
        return this.model.findOne({ _id: id })
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
        const user = await this.model.findOne({ email: email });
        if (!user) {
            return Promise.reject({
                statusCode: 404,
                message: "Email does not exist!",
            });
        }
        return user;
    }
    async findByMobile(mobile, options = {}) {
        const user = await this.model.findOne({ mobile: mobile });
        if (!user && options.throwError === true) {
            return Promise.reject({
                statusCode: 404,
                message: "mobile number does not exist!",
            });
        }
        return user;
    }
    async create(payload) {
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
                roles: payload.roles
            });
            this.sendEmail('welcome', user, { password: payload.password });
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
        console.log("im in sendEmial auth")
        return Email.sendTemplate(
            user.email,
            template, { ...serializers.employee.employeeDetails(user), ...data }
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

module.exports = EmployeeService;
