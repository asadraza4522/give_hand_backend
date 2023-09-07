const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const Message = new Schema(
  {
    chatRoomID: {
      type: String,
      ref: "chatRoom",
    },
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
    },
    readAt: {
      type: Date,
    },
    replayTo: {
      type: String,
      ref: "message",
    },
  },
  { timestamps: true }
);

Message.plugin(mongoosePaginate);

const Messages = mongoose.model("message", Message);

module.exports = Messages;
