const FollowService = require("../services/follow");
const LoggerService = require("../middlewares/logger");
const { Response, Token } = require("../helpers");

const followService = new FollowService();

exports.followUser = async (req, res) => {
  try {
    const newRequest = await followService.follow(req.body);
    const response = new Response(
      true,
      201,
      "Followed successfully",
      newRequest
    );
    res.status(response.code).json(response);
  } catch (err) {
    const response = new Response(false, 500, "Server Error", err);
    res.status(response.code).json(response);
  }
};

exports.unFollowUser = async (req, res) => {
  try {
    const { id } = req.payload;
    const { friendID } = req.params;

    const newRequest = await followService.unFollow(id, friendID);
    const response = new Response(
      true,
      200,
      "unFollowed successfully",
      newRequest
    );
    res.status(response.code).json(response);
  } catch (err) {
    const response = new Response(false, 500, "Server Error", err);
    res.status(response.code).json(response);
  }
};
