const express = require("express");
const EmployeeController = require("../controllers/employee.controller");
const auth = require('../shared/middlewares/auth.middleware')
const route = require('../shared/middlewares/route.middleware')
const permission = require('../shared/middlewares/permission.middleware')
const router = express.Router();

router.post("/addEmployee", route({ routeName: 'employee:addEmployee' }), EmployeeController.registerEmployee);
router.get("/", route({ routeName: 'employee:getEmployees' }), EmployeeController.getEmployees);
router.get("/:id", route({ routeName: 'employee:getEmployees' }), EmployeeController.getEmployeeById);


module.exports = router;
