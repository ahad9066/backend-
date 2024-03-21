
const express = require("express");
const OrderController = require("../controllers/order.controller");
const auth = require("../shared/middlewares/auth.middleware");
const router = express.Router();


router.post("/", auth({ routeName: 'products:placeOrders' }), OrderController.placeOrders);
router.get("/all", auth({ routeName: 'products:getAllOrders' }), OrderController.getAllOrders);
router.get("/:userId", auth({ routeName: 'products:getOrdersByUserId' }), OrderController.getOrdersByUserId);
router.get("/cancel/:orderId", auth({ routeName: 'products:cancelOrder' }), OrderController.cancelOrder);
router.put("/updatePayment", auth({ routeName: 'products:updatePayemnt' }), OrderController.updatePaymentConfirmation)
router.post("/invoice", auth({ routeName: 'products:downloadInvoice' }), OrderController.downloadInvoice)
// router.post("/:addressId",  AddressController.updateUserAddress);

module.exports = router;
