const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const Feed = new Schema(
  {
    user: {
      type: String,
      ref: "user",
    },
    content: {
      type: String,
    },
    video: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

Feed.plugin(mongoosePaginate);

const Feeds = mongoose.model("feeds", Feed);

module.exports = Feeds;
