const FriendsService = require("../services/friends");
const LoggerService = require("../middlewares/logger");
const { Response, Token } = require("../helpers");

const friendsService = new FriendsService();

exports.sendFriendRequest = async (req, res) => {
  try {
    const newRequest = await friendsService.addFriend(req.body);
    const response = new Response(
      true,
      201,
      "Friend request sent successfully",
      newRequest
    );
    res.status(response.code).json(response);
  } catch (err) {
    const response = new Response(false, 500, "Server Error", err);
    res.status(response.code).json(response);
  }
};

exports.acceptFriendRequest = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body);
    const newRequest = await friendsService.updateFriendRequest(id, req.body);
    const response = new Response(
      true,
      200,
      "Request updated successfully",
      newRequest
    );
    res.status(response.code).json(response);
  } catch (err) {
    const response = new Response(false, 500, "Server Error", err);
    res.status(response.code).json(response);
  }
};
