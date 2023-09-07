const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // brand: {
    //     type: String,
    //     required: true,
    //     ref: 'brand'
    // },
    categories: {
      type: Array,
      required: true,
      ref: "categories",
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
    },
    tags: {
      type: String,
    },
    image: {
      type: String,
    },
    user: {
      type: String,
      ref: "user",
    },
    productType: {
      type: String,
      default: "product",
    },
  },
  { timestamps: true }
);

ProductSchema.plugin(mongoosePaginate);

const Products = mongoose.model("products", ProductSchema);

module.exports = Products;
