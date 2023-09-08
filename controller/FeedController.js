const Response = require("../utilities/response");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utilities/cloudinary");
const Feeds = require("../models/feed");

const createFeed = async (req, res) => {
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
    req.body.content = req?.body?.content;
    req.body.user = userId;
    const newFeed = new Feeds(req.body);

    newFeed
      .save()
      .then((result) => {
        response.data = result;
        response.message = result._id + " added successfully";
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
