const { Schema, model } = require("mongoose");

const articleSchema = Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Author is required"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("Article", articleSchema);