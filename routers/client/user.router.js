const express = require("express");
const multer = require("multer")
const upload = multer()
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware")
const router = express.Router();
const controller = require("../../controller/client/user.controller")
const validate = require("../../validates/client/user.validate")
const middleware = require("../../middlewares/client/auth.middleware")
router.get("/register",controller.register);
router.post("/register", validate.registerPost,controller.registerPost)
router.get("/login", controller.login)
router.post("/login", validate.LoginPost,controller.loginPost)
router.get("/logout", controller.logout)
router.get("/password/forgot", controller.forgotPassword)
router.post("/password/forgot",validate.forgotPasswordPost, controller.forgotPasswordPost)
router.get("/password/otp", controller.otpPassword)
router.post("/password/otp", controller.otpPasswordPost)
router.get("/password/reset-password", controller.resetPassword)
router.post("/password/reset-password",validate.resetPasswordPost ,controller.resetPasswordPost)
router.get("/info", middleware.requireAuth,controller.info)
router.get("/edit", controller.edit)
router.patch("/edit", upload.single("avatar"), uploadCloud.upload, controller.editPatch)
module.exports = router;