
const express = require("express");
const CartController = require("../controllers/cart.controller");

const router = express.Router();


router.post("/", CartController.addToCart);
router.get("/:id", CartController.getUserCartItems);
router.delete("/:id", CartController.deleteUserCartItems);
// router.post("/:addressId",  AddressController.updateUserAddress);

module.exports = router;
