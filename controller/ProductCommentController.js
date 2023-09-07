const Response = require("../utilities/response");
const ProductComment = require("../models/productComment");
const fs = require("fs");
const { capitalizeSentence } = require("../utilities/Capitalize");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utilities/cloudinary");

const uniqueName = (name, id) =>
  new Promise((resolve, reject) => {
    name = capitalizeSentence(name);
    let checkID = null;

    if (id) {
      checkID = { _id: { $ne: id } };
    }

    ProductComment.findOne({ name: name, ...checkID })
      .then((res) => {
        if (!res) {
          resolve("");
        } else {
          reject("Name is already taken");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

const createProductComment = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let userType = null;
  let user = null;

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      userType = user?.type;
      // user = { name: user.name, avatar: user.avatar, userID: user._id };
    });
  } catch (error) {
    console.log(error, "error");
  }

  const response = new Response();

  try {
    req.body.productID = req?.body?.productID;
    req.body.replayTo = req?.body?.replayTo || null;
    req.body.descp = req?.body?.descp;
    req.body.userID = req?.body?.userID;
    req.body.userEmail = req?.body?.userEmail;
    const newComment = new ProductComment(req.body);

    newComment
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
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const viewProductComments = (req, res) => {
  const response = new Response();
  const search = req?.params?.productID;

  try {
    ProductComment.find(
      search != null ? { productID: { $regex: search, $options: "i" } } : {}
    )
      .then((result) => {
        response.data = result;
        response.message = "Success";
        res.send(response);
      })
      .catch((error) => {
        response.data = error;
        response.message = "Error";
        response.error = true;
        res.send(response);
      });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

module.exports = {
  createProductComment,
  viewProductComments,
};
