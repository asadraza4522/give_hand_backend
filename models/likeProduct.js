const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const LikeProductSchema = new Schema(
  {
    productID: {
      type: String,
      required: true,
      ref: "products",
    },
    user: {
      type: String,
      ref: "user",
    },
  },
  { timestamps: true }
);

LikeProductSchema.plugin(mongoosePaginate);

const LikeProducts = mongoose.model("likeProducts", LikeProductSchema);

module.exports = LikeProducts;
