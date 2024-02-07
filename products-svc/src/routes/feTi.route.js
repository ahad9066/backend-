
const express = require("express");
const FeTiController = require("../controllers/feTi.controller");

const router = express.Router();


router.post("/", FeTiController.addFeTiGrade);
router.get("/", FeTiController.getFeTiProducts);
// router.post("/:addressId",  AddressController.updateUserAddress);

module.exports = router;
