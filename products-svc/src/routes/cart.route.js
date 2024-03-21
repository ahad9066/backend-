
const express = require("express");
const CartController = require("../controllers/cart.controller");
const auth = require("../shared/middlewares/auth.middleware");
const router = express.Router();


router.post("/", auth({ routeName: 'products:addToCart' }), CartController.addToCart);
router.get("/", auth({ routeName: 'products:getAllUserCartItems' }), CartController.getAllUserCartItems);
router.get("/:id", auth({ routeName: 'products:getUserCartItems' }), CartController.getUserCartItems);
router.delete("/:id", auth({ routeName: 'products:deleteUserCartItems' }), CartController.deleteUserCartItems);
// router.post("/:addressId",  AddressController.updateUserAddress);

module.exports = router;
