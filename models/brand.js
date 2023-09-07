const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const BrandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

BrandSchema.plugin(mongoosePaginate);

const Brands = mongoose.model("brand", BrandSchema);

module.exports = Brands;
