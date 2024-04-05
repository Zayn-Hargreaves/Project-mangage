const express = require("express");
const multer = require("multer");
const storageMulter = require("../../helper/storageMulter")
const upload = multer({storage: storageMulter()})
const router = express.Router();
const validate = require("../../validates/admin/products.validate")
const controller = require("../../controller/admin/products.controller");
router.get("/",controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti)
router.delete("/delete/:id", controller.deleteItem);
router.get("/create", controller.create)
router.post(
    "/create",
    upload.single("thumbnail"),
    validate.createPost,
    controller.createPost)
router.get("/edit/:id", controller.edit)
router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    validate.createPost,
    controller.editPatch)
router.get("/detail/:id", controller.detail)
module.exports = router;