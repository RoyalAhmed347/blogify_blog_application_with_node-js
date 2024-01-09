const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const blogSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
    coverImageURL: {
      type: String,
      require: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
  },
  { timestamps: true }
);

const BLOG = new mongoose.model("blog", blogSchema);

module.exports = { BLOG };
