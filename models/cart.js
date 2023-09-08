const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CardSchema = new Schema(
  {
    productID: {
      type: Array,
      ref: "products",
    },
    title: {
      type: String,
    },
    descp: {
      type: String,
    },
    sendTo: {
      type: String,
      ref: "user",
    },
  },
  { _id: false, timestamps: false }
);

const ProductSchema = new Schema(
  {
    productID: {
      type: String,
      ref: "products",
      required: true,
    },
    cartQty: {
      type: Number,
      required: true,
    },
    cardItem: {
      type: [CardSchema],
    },
  },
  { _id: false }
);

const CartSchema = new Schema(
  {
    products: {
      type: [ProductSchema],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const UserCart = new Schema({
  user: {
    type: String,
    required: true,
    ref: "user",
  },
  cart: {
    required: true,
    type: CartSchema,
  },
});

const UsersCarts = mongoose.model("cart", UserCart);

module.exports = UsersCarts;
