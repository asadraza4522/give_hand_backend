const express = require("express");
const router = express.Router();
const ProductCommentController = require("../controller/ProductCommentController");
const { ValidateToken } = require("../controller/AuthController");

router.post(
  "/api/productComment/createProductComment",
  ValidateToken,
  ProductCommentController.createProductComment
);

router.get(
  "/api/productComment/:productID",
  ValidateToken,
  ProductCommentController.viewProductComments
);

module.exports = router;
