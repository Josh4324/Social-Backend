const mongoose = require("mongoose");

const friendsSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  friendID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
  },
});

const Friends = mongoose.model("Friends", friendsSchema);

module.exports = Friends;
