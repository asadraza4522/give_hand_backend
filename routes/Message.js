const express = require("express");
const router = express.Router();
const MessageController = require("../controller/MessageController");
const { ValidateToken } = require("../controller/AuthController");

router.post(
  "/api/message/createMessge",
  ValidateToken,
  MessageController.createMessage
);

router.get(
  "/api/message/getMessages/:chatRoomID",
  ValidateToken,
  MessageController.getMessages
);

module.exports = router;
