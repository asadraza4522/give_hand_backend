const express = require("express");
const router = express.Router();
const LikeProductController = require("../controller/LikeProductController");
const { ValidateToken } = require("../controller/AuthController");

router.post(
  "/api/likeProduct/likeProduct",
  ValidateToken,
  LikeProductController.likeProduct
);

router.get(
  "/api/likeProduct/:user",
  ValidateToken,
  LikeProductController.viewProductLikes
);

router.post(
  "/api/likeProduct/unLikeProduct",
  ValidateToken,
  LikeProductController.unLikeProduct
);

module.exports = router;
