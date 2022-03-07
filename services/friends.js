const Friends = require("../models/friends");

module.exports = class FriendsService {
  async addFriend(detail) {
    return await Friends.create(detail);
  }

  async updateFriendRequest(id, payload) {
    return await Friends.findOneAndUpdate(id, payload, {
      new: true,
    });
  }

  async getAllFriendsRequest(id) {
    return await Friends.find({ friendID: id, status: "pending" });
  }

  async getAllFriends(id) {
    return await Friends.find({
      status: "accepted",
      $or: [{ userID: id }, { friendID: id }],
    });
  }

  async getAllPotentialFriends(id) {
    return await Friends.find({
      $or: [{ status: "rejected" }, { status: "pending" }],
      $or: [{ userID: id }, { friendID: id }],
    });
  }
};
