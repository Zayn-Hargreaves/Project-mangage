const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/auth.controller")
const validate = require("../../validates/admin/auth.validate")
router.get("/login",controller.login);
router.post("/login",
    validate.LoginPost, 
    controller.loginPost)
router.post("/logout",controller.logout)
module.exports = router;