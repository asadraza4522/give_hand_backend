const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const CardSchema = new Schema(
  {
    productID: {
      type: Array,
      ref: "products",
    },
    price: {
      type: Number,
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

const CartSchema = new Schema(
  {
    productID: {
      required: true,
      type: String,
      ref: "products",
    },
    price: {
      required: true,
      type: Number,
    },
    cartQty: {
      required: true,
      type: Number,
    },
    cardItem: {
      type: [CardSchema],
    },
  },
  { _id: false, timestamps: false }
);

const SellerSchema = new Schema(
  {
    seller_id: {
      type: String,
      required: true,
      ref: "user",
    },
    products: {
      type: [CartSchema],
      required: true,
    },
    status: {
      type: String,
    },
    total: {
      required: true,
      type: Number,
      default: 0,
    },
  },
  { _id: false, timestamps: false }
);

const OrderSchema = new Schema(
  {
    userID: {
      required: true,
      type: String,
      ref: "user",
    },
    amount: {
      required: true,
      type: Number,
    },
    total_items: {
      required: true,
      type: Number,
    },
    address: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    sellers: {
      type: [SellerSchema],
      required: true,
    },
    location: {
      type: Object,
    },
    payment: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

OrderSchema.plugin(mongoosePaginate);

const Orders = mongoose.model("orders", OrderSchema);

module.exports = Orders;
