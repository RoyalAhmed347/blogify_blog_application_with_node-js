const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  content: {
    type: String,
    require: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  bolgId: {
    type: Schema.Types.ObjectId,
    ref: "blog",
  },
});

const COMMENT = new model("comment", commentSchema);

module.exports = COMMENT;
