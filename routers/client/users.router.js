const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/users.controller")
router.get("/not-friend",controller.notfriend);
router.get("/request", controller.request)
router.get("/accept", controller.accept)
router.get("/friends",controller.friend)
module.exports = router;