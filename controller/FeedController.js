const Response = require("../utilities/response");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utilities/cloudinary");
const Feeds = require("../models/feed");

const createFeed = async (req, res) => {
  console.log(
    "🚀 ~ file: FeedController.js:7 ~ createFeed ~ req:",
    JSON.stringify(req)
  );
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
    req.body.content = req?.body?.descp;
    req.body.user = userId;
    req.body.video = req.file.path;
    const newFeed = new Feeds(req.body);
    console.log(
      "🚀 ~ file: FeedController.js:26 ~ createFeed ~ newFeed:",
      newFeed
    );

    newFeed
      .save()
      .then((result) => {
        response.data = result;
        console.log(
          "🚀 ~ file: FeedController.js:30 ~ .then ~ result:",
          JSON.stringify(result)
        );
        response.message = result._id + " added successfully";
        res.send(response);
      })
      .catch((err) => {
        console.log(
          "🚀 ~ file: FeedController.js:30 ~ .then ~ err:",
          JSON.stringify(err)
        );
        response.data = err;
        response.message = "Error";
        response.error = true;
        res.send(response);
        console.log(err);
      });
  } catch (error) {
    console.log(
      "🚀 ~ file: FeedController.js:30 ~ .then ~ err:",
      JSON.stringify(error)
    );
    console.log(error);
    res.send(error);
  }
};

const getFeeds = (req, res) => {
  const response = new Response();
  const search = req.query.search || null;
  try {
    Feeds.paginate(
      search != null ? { name: { $regex: search, $options: "i" } } : {},
      { page: req.query.page || 1, limit: req.query.limit || 10 }
    )
      .populate({ path: "user", select: "name avatar _id" })
      .exec((err, result) => {
        if (err) {
          console.error("Error fetching feeds:", err);
          response.data = err;
          response.message = err;
          response.error = true;
          res.send(response);
        } else {
          response.data = result;
          console.log(
            "🚀 ~ file: FeedController.js:67 ~ .exec ~ result:",
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
  createFeed,
  getFeeds,
};
