const AuthService = new (require('../shared/services/auth.service'))
const EmployeeService = new (require("../services/employee.service"));
const Joi = require('joi')
const validators = require("../validators");
const JoiController = require("../shared/controllers/joi.controller");
const serializers = require('../serializers')


exports.registerEmployee = async (req, res, next) => {
    try {
        const payload = await JoiController.validateSchema(
            validators.employee.create,
            req.body
        );
        const user = await EmployeeService.create(payload);
        res.status(201).json(serializers.employee.employeeDetails(user));
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};
exports.getEmployees = async (req, res, next) => {
    try {
        const employeesList = await EmployeeService.get();
        res.status(200).json({
            employees: employeesList.map(serializers.employee.employeeDetails),
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getEmployeeById = async (req, res, next) => {
    try {
        user = await EmployeeService.getById(req.params['id']);
        res.json(serializers.employee.employeeDetails(user))
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};