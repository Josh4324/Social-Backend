const express = require("express");
const router = express.Router();
const { Token } = require("../helpers");
const followerController = require("../controllers/follow");
const userController = require("../controllers/user");
const auth = require("../middlewares/authorization");

const token = new Token();

router.get(
  "/",
  token.verifyToken,
  auth.authorization("user", "admin", "super-admin"),
  userController.getFriends
);

router.post(
  "/follow",
  token.verifyToken,
  auth.authorization("user", "admin", "super-admin"),
  followerController.followUser
);

router.delete(
  "/unfollow/:friendID",
  token.verifyToken,
  auth.authorization("user", "admin", "super-admin"),
  followerController.unFollowUser
);

module.exports = router;
