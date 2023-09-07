const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const ChatRoom = new Schema(
  {
    senderID: {
      type: String,
      ref: "user",
    },
    receiverID: {
      type: String,
      ref: "user",
    },
    content: {
      type: String,
      ref: "message",
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

ChatRoom.plugin(mongoosePaginate);

const ChatRooms = mongoose.model("chatRoom", ChatRoom);

module.exports = ChatRooms;
