const Response = require("../utilities/response");
const LikeProduct = require("../models/likeProduct");
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

    LikeProduct.findOne({ name: name, ...checkID })
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

const likeProduct = async (req, res) => {
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
    req.body.productID = req?.body?.productID;
    req.body.user = userId;
    const likeProduct = new LikeProduct(req.body);

    likeProduct
      .save()
      .then((result) => {
        response.data = result;
        response.message = result.productID + " liked successfully";
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

const viewProductLikes = (req, res) => {
  const response = new Response();
  console.log("viewProductLikes", req);
  const search = req?.params?.user;

  try {
    LikeProduct.find(
      search != null ? { user: { $regex: search, $options: "i" } } : {}
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

const unLikeProduct = (req, res) => {
  const response = new Response();

  let likeProductID = req?.body?.productID;

  try {
    LikeProduct.findByIdAndDelete(likeProductID)
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
  likeProduct,
  viewProductLikes,
  unLikeProduct,
};
