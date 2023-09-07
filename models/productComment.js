const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

// const UserSchema = new Schema({
//   name: {
//     type: String,
//   },
//   avatar: {
//     type: String,
//   },
//   userID: {
//     type: String,
//   },
// });

const ProductCommentSchema = new Schema(
  {
    productID: {
      type: String,
      required: true,
      ref: "product",
    },
    userID: {
      type: String,
      ref: "user",
    },
    userEmail: {
      type: String,
      ref: "user",
    },
    descp: {
      type: String,
      required: true,
    },
    replayTo: {
      type: String,
      ref: "productComent",
    },
  },
  { timestamps: true }
);

ProductCommentSchema.plugin(mongoosePaginate);

const ProductComments = mongoose.model("productComments", ProductCommentSchema);

module.exports = ProductComments;
