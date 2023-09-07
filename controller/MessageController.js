const Response = require("../utilities/response");
const Message = require("../models/message");
const ChatRoomController = require("../controller/ChatRoomController");
const fs = require("fs");
const { capitalizeSentence } = require("../utilities/Capitalize");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utilities/cloudinary");

const checkExsist = (chatRoomID) =>
  new Promise((resolve, reject) => {
    let checkID = null;

    if (chatRoomID) {
      checkID = {
        chatRoomID: { $in: chatRoomID },
      };
    }

    Message.findOne({ ...checkID })
      .then((res) => {
        if (!res) {
          resolve("");
        } else {
          reject("Chat Room is not created");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

const createMessage = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let userType = null;
  let userId = null;

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      userType = user?.type;
      userId = user?.id;
    });
  } catch (error) {
    console.log(error, "error");
  }

  const response = new Response();
  try {
    req.body.chatRoomID = req?.body?.chatRoomID;
    req.body.replayTo = req?.body?.replayTo || null;
    req.body.content = req?.body?.content;
    req.body.senderID = req?.body?.senderID;
    req.body.receiverID = req?.body?.receiverID;
    console.log(
      "🚀 ~ file: MessageController.js:52 ~ createMessage ~ req?.body?.senderID:",
      req?.body?.senderID
    );
    const newComment = new Message(req.body);

    newComment
      .save()
      .then((result) => {
        response.data = result;
        response.message = result._id + " added successfully";
        res.send(response);
        ChatRoomController.updateContent(req.body.chatRoomID, result._id);
      })
      .catch((err) => {
        response.data = err;
        response.message = "Error";
        response.error = true;
        res.send(response);
        console.log(err);
      });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const getMessages = (req, res) => {
  const response = new Response();
  const search = req?.params?.chatRoomID;
  console.log(
    "🚀 ~ file: MessageController.js:79 ~ getMessages ~ search:",
    req?.params
  );
  try {
    Message.find(search != null ? { chatRoomID: { $in: search } } : {})
      .populate({ path: "senderID", select: "name avatar _id" })
      .populate({ path: "receiverID", select: "name avatar _id" }) // Specify fields to populate
      .exec((err, result) => {
        if (err) {
          console.error("Error fetching chat rooms:", err);
          response.data = err;
          response.message = err;
          response.error = true;
          res.send(response);
        } else {
          response.data = result;
          console.log(
            "🚀 ~ file: MessageController.js:93 ~ .exec ~ result:",
            result
          );
          response.message = "Success";
          res.send(response);
        }
      });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

module.exports = {
  createMessage,
  getMessages,
};
