
const express = require("express");
const FeTiController = require("../controllers/feTi.controller");
const auth = require("../shared/middlewares/auth.middleware");
const router = express.Router();


router.get("/health", route({ routeName: 'products:health' }), FeTiController.health);
router.post("/", auth({ routeName: 'products:addFeTiGrade' }), FeTiController.addFeTiGrade);
router.get("/", auth({ routeName: 'products:getFeTiProducts' }), FeTiController.getFeTiProducts);
// router.post("/:addressId",  AddressController.updateUserAddress);

module.exports = router;
