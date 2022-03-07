const express = require("express");
const router = express.Router();
const { Token } = require("../helpers");
const friendsController = require("../controllers/friends");
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
  "/send-request",
  token.verifyToken,
  auth.authorization("user", "admin", "super-admin"),
  friendsController.sendFriendRequest
);

router.patch(
  "/accept-request/:id",
  token.verifyToken,
  auth.authorization("user", "admin", "super-admin"),
  friendsController.acceptFriendRequest
);

module.exports = router;
