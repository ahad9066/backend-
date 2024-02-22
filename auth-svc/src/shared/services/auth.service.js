const JWT = require("jsonwebtoken");
const Token = require('../../models/jwt.model');
const UserModel = require('../../models/user.model')
const UserService = new (require('../../services/user.service'))
const EmployeeService = new (require('../../services/employee.service'))
const serializers = require('../../serializers')
const { Email } = require('../../shared/libraries');
const ROLES = require('../../constants/roles.constants')



// const value = await client.get('key');
// await client.disconnect();
class AuthService {
    constructor() {
        this.model = UserModel;
    }
    async login(isUsernameEmail, username, password) {
        console.log('username', username)
        console.log('isUsernameEmail', isUsernameEmail)
        let user;
        if (isUsernameEmail) {
            user = await UserService.findByEmail(username);
        } else {
            user = await UserService.findByMobile(username);
        }
        if (!user) {
            throw ({ statusCode: 404, message: 'User not found' })
        }
        console.log('user', user)
        if (!(await UserService.verifyPassword(user, password))) {
            throw { statusCode: 400, message: "Invalid password" };
        }
        return this.generateAuthToken(user, isUsernameEmail, true);
    }

    async logout(req) {
        return this.removeTokenFromDB(req);
    }

    async changePassword(user_id, old_password, new_password) {
        const user = await UserService.getById(user_id);
        const is_password_set = !!user.password;

        if (user.password) {
            if (!await UserService.verifyPassword(user, old_password)) {
                throw { statusCode: 403, message: 'Old password does not match!' }
            }
        }
        await UserService.updatePassword(user, new_password);

        if (is_password_set) {
            // this.sendEmail('password_changed', user, { old_password, new_password });
        }

        return user;
    }
    async resetPassword(user_id, new_password) {
        const user = await UserService.getById(user_id);
        await UserService.updatePassword(user, new_password);
        // this.sendEmail('reset_password', user, { new_password });
        return user;
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
    async generateAuthToken(user, isUsernameEmail, isCustomer) {

        const data = {
            user: {
                _id: user._id.toString(),
                username: user.username,
                isUsernameEmail: isUsernameEmail,
                roles: isCustomer ? [ROLES.CUSTOMER] : user.roles
            },
        };
        const token = JWT.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: '2h' });
        const expirationTime = new Date(); // Set the expiration time for the token
        expirationTime.setHours(expirationTime.getHours() + 2);
        const tokenData = {
            userId: user._id,
            token: token,
            expiration: expirationTime,
            roles: isCustomer ? [ROLES.CUSTOMER] : user.roles
        };
        const savedToken = await Token.create(tokenData);
        if (isCustomer) {
            return {
                token, userDetails: serializers.user.userDetails(user)
            };
        } else {
            return {
                token, employeeDetails: serializers.employee.employeeDetails(user)
            };
        }

    }

    async verifyAuthToken(token, type) {
        try {
            const t = JWT.verify(token, process.env.JWT_SECRET_KEY);
            let user;
            if (type == 'isEmployee') {
                user = await EmployeeService.getById(t.user._id);
            } else {
                user = await UserService.getById(t.user._id);
            }

            const value = await Token.findOne({ userId: user._id });
            if (!value) {
                throw { statusCode: 422, message: "Invalid token / expired token" };
            }
            return { token: t };
        } catch (err) {
            if (err.name == "TokenExpiredError") {
                throw { statusCode: 401, message: err.message };
            } else if (err.name === "JsonWebTokenError") {
                throw { statusCode: 401, message: err.message };
            } else if (err.name === "NotBeforeError") {
                throw { statusCode: 401, message: err.message };
            } else if (err.statusCode === 404) {
                throw { statusCode: 404, message: 'Invalid authentication token', errors: err.message }
            }
            else {
                if (err.statusCode) {
                    throw err;
                }
                throw { statusCode: 401, message: "Token invalid" };
            }
        }
    }

    canUserAccessRoute(user, routeName) {
        if (ROLES[routeName]) {
            if (typeof user.roles === 'undefined') {
                return false;
            }

            for (const role of user.roles) {
                if (ROLES[routeName].only.includes(role)) {
                    return true;
                }
            }


            return false;
        }

        return true;
    }

    async removeTokenFromDB(req) {
        try {
            const result = await Token.deleteMany({ userId: req.user._id }).exec();
            if (result.deletedCount > 0) {
                return true;
            } else {
                throw { statusCode: 500, message: "User already logged out!" };
            }
        } catch (err) {
            console.error(err);
            // Handle the error
        }
    }

    // Employee login 

    async employeeLogin(isUsernameEmail, username, password) {
        console.log('username', username)
        console.log('isUsernameEmail', isUsernameEmail)
        let employee;
        if (isUsernameEmail) {
            employee = await EmployeeService.findByEmail(username);
        } else {
            employee = await EmployeeService.findByMobile(username);
        }
        if (!employee) {
            throw ({ statusCode: 404, message: 'Employee not found' })
        }
        console.log('employee', employee)
        if (!(await UserService.verifyPassword(employee, password))) {
            throw { statusCode: 400, message: "Invalid password" };
        }
        return this.generateAuthToken(employee, isUsernameEmail, false);
    }

}

module.exports = AuthService;
