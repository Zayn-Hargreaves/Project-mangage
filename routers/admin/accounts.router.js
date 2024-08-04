const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer()
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")
const controller = require("../../controller/admin/accounts.controller")
const validate = require("../../validates/admin/accounts.validate")
router.get("/",controller.index);
router.get("/create",controller.create)
router.post(
    "/create",
    upload.single("avatar"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost)
router.get("/edit/:id", controller.edit)
router.patch(
    "/edit/:id",
    upload.single("avatar"),
    controller.editPatch)
module.exports = router;