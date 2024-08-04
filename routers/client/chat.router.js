const express = require("express");
const router = express.Router();

const controller = require("../../controller/client/chat.controller");
const middleware = require("../../middlewares/client/chat.middleware")
router.get("/:roomChatId", middleware.isAccess,controller.index)

module.exports = router;