const express = require("express");
const router = express.Router();
const ChatRoomController = require("../controller/ChatRoomController");
const { ValidateToken } = require("../controller/AuthController");

router.post(
  "/api/chatRoom/createChatRoom",
  ValidateToken,
  ChatRoomController.createChatRoom
);

router.get(
  "/api/chatRoom/:userID",
  ValidateToken,
  ChatRoomController.getChatRooms
);

module.exports = router;
