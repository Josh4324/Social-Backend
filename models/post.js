const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  text: {
    type: string,
    required: true,
  },
  photo: {
    type: string,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      text: string,
      created: { type: Date, default: Date.now },
      postedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
    },
  ],
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
