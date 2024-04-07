
const express = require("express");
const rawMaterialController = require("../controllers/rawMaterial.controller");
const auth = require("../shared/middlewares/auth.middleware");
const router = express.Router();

router.get("/", rawMaterialController.getRawMaterials);
router.post("/updateRawMaterials", rawMaterialController.updateawMaterials);
router.post("/init/addRawMaterials", rawMaterialController.initRawMaterials);
// router.post("/:addressId",  AddressController.updateUserAddress);

module.exports = router;
