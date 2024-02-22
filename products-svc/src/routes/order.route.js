
const express = require("express");
const OrderController = require("../controllers/order.controller");

const router = express.Router();


router.post("/", OrderController.placeOrders);
router.get("/all", OrderController.getAllOrders);
router.get("/:userId", OrderController.getOrdersByUserId);

// router.post("/:addressId",  AddressController.updateUserAddress);

module.exports = router;
