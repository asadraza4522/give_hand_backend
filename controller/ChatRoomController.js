const Response = require("../utilities/response");
const ChatRoom = require("../models/chatRoom");
const User = require("../models/user");
const fs = require("fs");
const { capitalizeSentence } = require("../utilities/Capitalize");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utilities/cloudinary");

const checkExsist = (senderID, receiverID) =>
  new Promise((resolve, reject) => {
    let checkID = null;

    if ((senderID, receiverID)) {
      checkID = {
        $and: [
          { senderID: { $in: senderID } },
          { receiverID: { $in: receiverID } },
        ],
      };
    }

    ChatRoom.findOne({ ...checkID })
      .then((res) => {
        if (!res) {
          resolve("");
        } else {
          reject("Chat Room is already created");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

const createChatRoom = async (req, res) => {
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
    const receiverID = await User.findById(req?.body?.receiverID);
    if (!receiverID) {
      response.data = "Invalid receiver.";
      response.message = "Error";
      response.error = true;
      res.send(response);
      console.log(err);
      return;
    }

    req.body.content = req?.body?.content;
    req.body.senderID = userId;
    req.body.receiverID = req?.body?.receiverID;

    const newChatRoom = new ChatRoom(req.body);
    checkExsist(userId, req.body.receiverID)
      .then(() => {
        newChatRoom
          .save()
          .then((result) => {
            response.data = result;
            response.message = result + " added successfully";
            res.send(response);
          })
          .catch((err) => {
            response.data = err;
            response.message = "Error";
            response.error = true;
            res.send(response);
            console.log(err);
          });
      })
      .catch((err) => {
        response.data = err;
        response.message = err;
        response.error = true;
        res.send(response);
        console.log(err);
      });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const getChatRooms = (req, res) => {
  const response = new Response();
  const search = req?.params?.userID;

  try {
    ChatRoom.find(
      search != null
        ? {
            $or: [
              { senderID: { $in: search } },
              { receiverID: { $in: search } },
            ],
          }
        : {}
    )
      .populate({ path: "content", select: "content" })
      .populate({ path: "senderID", select: "name avatar _id" })
      .populate({ path: "receiverID", select: "name avatar _id" }) // Specify fields to populate
      .exec((err, result) => {
        if (err) {
          console.error("Error fetching chat rooms:", err);
          response.data = err;
          response.message = "Error";
          response.error = true;
          res.send(response);
        } else {
          console.log(
            "🚀 ~ file: ChatRoomController.js:102 ~ .then ~ result:",
            result
          );
          response.data = result;
          response.message = "Success";
          res.send(response);
        }
      });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

function updateContent(chatRoomId, messageId) {
  ChatRoom.findByIdAndUpdate(
    chatRoomId,
    {
      content: messageId,
    },
    (err, result) => {
      if (err) {
        console.error("Error updating CollectionB:", err);
      } else {
        console.log("ChatRoom updated successfully:", result);
      }
    }
  );
}

module.exports = {
  createChatRoom,
  getChatRooms,
  updateContent,
};
