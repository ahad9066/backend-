const express = require("express");
const AuthController = require("../controllers/auth.controller");
const auth = require('../shared/middlewares/auth.middleware')
const route = require('../shared/middlewares/route.middleware')
const permission = require('../shared/middlewares/permission.middleware')
const router = express.Router();

router.get("/health", route({ routeName: 'auth:health' }), AuthController.health);
router.post("/signup", route({ routeName: 'auth:signup' }), AuthController.signUp);
router.post('/login', route({ routeName: 'auth:login' }), AuthController.login);
router.post('/employeeLogin', route({ routeName: 'auth:employeeLogin' }), AuthController.employeeLogin);
router.post('/changePassword', route({ routeName: 'auth:changePassword' }), auth(), AuthController.changePassword);
router.post('/resetPassword', route({ routeName: 'auth:resetPassword' }), auth(), AuthController.resetPassword);
// router.get('/permission/:routeName', auth(), AuthController.permission)
router.get('/logout', auth(), AuthController.logout)
router.get('/employeeLogout', auth('isEmployee'), AuthController.employeeLogout)

module.exports = router;
