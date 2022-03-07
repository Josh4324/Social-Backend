const Follow = require("../models/follow");

module.exports = class FollowService {
  async follow(detail) {
    return await Follow.create(detail);
  }

  async unFollow(userID, friendID) {
    return await Follow.deleteOne({
      userID,
      friendID,
    });
  }

  async getAllFollowers(id) {
    return await Follow.find({ friendID: id });
  }

  async getAllFollowing(id) {
    return await Follow.find({ userID: id });
  }

  async checkFollow(userID, friendID) {
    return await Follow.find({ userID, friendID });
  }
};
