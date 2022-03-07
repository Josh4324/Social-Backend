const User = require("../models/user");

module.exports = class UserService {
  async findUserWithEmail(email) {
    return await User.findOne({ email });
  }

  async findUserWithId(id) {
    return await User.findOne({ _id: id });
  }

  async createUser(user) {
    return await User.create(user);
  }

  async getAllUsers(id) {
    return await User.find({ _id: { $ne: id } });
  }

  async findUserWithEmailAndGetPassword(email) {
    return await User.findOne({ email }).select("+password");
  }

  async findUserWithIdAndGetPassword(id) {
    return await User.findOne({ _id: id }).select("+password");
  }

  async updateUser(id, payload) {
    return await User.findByIdAndUpdate(id, payload, {
      new: true,
    });
  }
};
