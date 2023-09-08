const express = require("express");
const router = express.Router();
const FeedsController = require("../controller/FeedController");
const { ValidateToken } = require("../controller/AuthController");
const uploadVideo = require("../middleware/uploadVideo");

router.post(
  "/api/feed/addFeed/UploadVideo",
  ValidateToken,
  uploadVideo.single("video"),
  FeedsController.createFeed
);

router.get("/api/feed/viewFeed", ValidateToken, FeedsController.getFeeds);

module.exports = router;
