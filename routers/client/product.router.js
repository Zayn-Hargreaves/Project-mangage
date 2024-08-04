const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/product.controller")
router.get("/",controller.index);
router.get("/:slugProductCategory", controller.category)
router.get("/detail/:slugProduct", controller.detail)
module.exports = router;