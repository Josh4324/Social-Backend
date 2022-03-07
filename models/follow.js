const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  friendID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Follow = mongoose.model("Follow", followSchema);

module.exports = Follow;
