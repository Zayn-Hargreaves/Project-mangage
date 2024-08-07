const express = require("express")
const router = express.Router();
const controller = require("../../controller/admin/roles.controller")

router.get("/", controller.index)
router.get("/create", controller.create)
router.post("/create",controller.createPost)
router.delete("/delete/:id", controller.deleteItem);
router.get("/edit/:id", controller.edit)
router.patch("/edit/:id", controller.editPatch)
// router.get("/detail/:id", controller.detail)
router.get("/permissions", controller.permissions)
router.patch("/permissions", controller.permissionsPatch)
module.exports = router;