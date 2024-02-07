
const express = require("express");
const AddressController = require("../controllers/address.controller");
const route = require('../shared/middlewares/route.middleware')
const auth = require('../shared/middlewares/auth.middleware')

const router = express.Router();


router.get("/:userId", route({ routeName: 'auth:users-list' }), auth(), AddressController.getUserAddresses);
router.post("/", auth(), AddressController.addUserAddress);
router.post("/:addressId", auth(), AddressController.updateUserAddress);

module.exports = router;
