const express = require("express");
const router = express.Router();
const CartController = require("../controller/CartController");
const { ValidateToken } = require("../controller/AuthController");

router.get("/api/cart/:user", ValidateToken, CartController.viewCart);

router.post("/api/cart/addProduct", ValidateToken, CartController.addCartItem);

router.post("/api/cart/updateQty", ValidateToken, CartController.UpdateQty);

router.post("/api/cart/delete", ValidateToken, CartController.deleteCart);

router.post(
  "/api/cart/updateDonation",
  ValidateToken,
  CartController.UpdateDonation
);

module.exports = router;
