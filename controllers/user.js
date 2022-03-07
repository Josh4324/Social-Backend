const UserService = require("../services/user");
const FriendService = require("../services/friends");
const FollowService = require("../services/follow");
const cloudinary = require("cloudinary").v2;
const MailService = require("../services/mail");
const LoggerService = require("../middlewares/logger");
const argon2 = require("argon2");
const { Response, Token } = require("../helpers");
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const requestIp = require("request-ip");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const userService = new UserService();
const friendService = new FriendService();
const followService = new FollowService();
const mailService = new MailService();
const logger = new LoggerService("auth");
const token = new Token();

exports.signUp = async (req, res) => {
  const clientIP = await requestIp.getClientIp(req);
  const { email } = req.body;
  try {
    const user = await userService.findUserWithEmail(email);
    if (user) {
      const response = new Response(true, 409, "This user already exists");
      logger.error(
        `Request recieved at /api/v1/user/signup | Request Object - ${JSON.stringify(
          { email, ip: clientIP }
        )} | Response - ${JSON.stringify({
          err: "This user already exists",
          code: 409,
        })}`
      );
      return res.status(response.code).json(response);
    }

    req.body.role = "user";
    const newUser = await userService.createUser(req.body);

    const payload = {
      id: newUser._id,
      name: newUser.firstName,
      email: newUser.email,
      role: newUser.role,
    };

    const newToken = await token.generateToken(payload);

    // verification token expires in 10 minutes(600 seconds)
    const verificationToken = await token.generateToken(payload, 600);
    const verificationLink = `http://${req.headers.host}/api/v1/user/verify/${newUser._id}/${verificationToken}`;

    // send verification mail
    const mail = await mailService.sendSignupEmail(
      newUser.email,
      verificationLink,
      newUser.firstName
    );

    const data = {
      id: newUser._id,
      token: newToken,
      role: newUser.role,
    };

    const response = new Response(true, 201, "User created successfully", data);
    logger.info(
      `Request recieved at /api/v1/user/signup | Request Object - ${JSON.stringify(
        { email, ip: clientIP }
      )} | Response - ${JSON.stringify({
        id: newUser._id,
        role: newUser.role,
      })}`
    );
    res.status(response.code).json(response);
  } catch (err) {
    console.log(err);
    logger.error(
      `Request recieved at /api/v1/user/signup | Request Object - ${JSON.stringify(
        { email, ip: clientIP }
      )} | Response - ${JSON.stringify({ err })}`
    );
    const response = new Response(false, 500, "Server Error", err);
    res.status(response.code).json(response);
  }
};

exports.logIn = async (req, res) => {
  const clientIP = await requestIp.getClientIp(req);
  const { email, password } = req.body;
  try {
    const user = await userService.findUserWithEmailAndGetPassword(email);

    if (!user) {
      const response = new Response(false, 401, "Incorrect email or password");
      logger.error(
        `Request recieved at /api/v1/user/login | Request Object - ${JSON.stringify(
          { email, ip: clientIP }
        )} | Response - ${JSON.stringify({
          err: "This email does not exist in the database",
          code: 401,
        })}`
      );
      return res.status(response.code).json(response);
    }

    const checkPassword = await user.correctPassword(user.password, password);

    if (!checkPassword) {
      const response = new Response(false, 401, "Incorrect email or password");
      logger.error(
        `Request recieved at /api/v1/user/login | Request Object - ${JSON.stringify(
          { email, ip: clientIP }
        )} | Response - ${JSON.stringify({
          err: "Incorrect email or Password",
          code: 401,
        })}`
      );
      return res.status(response.code).json(response);
    }

    const payload = {
      id: user._id,
      role: user.role,
    };

    const newToken = await token.generateToken(payload);

    const data = {
      id: user._id,
      name: user.firstName,
      token: newToken,
      role: user.role,
    };

    const response = new Response(
      true,
      200,
      "User logged in Successfully",
      data
    );
    logger.info(
      `Request recieved at /api/v1/user/login | Request Object - ${JSON.stringify(
        { email, ip: clientIP }
      )} | Response - ${JSON.stringify({
        id: user._id,
        role: user.role,
      })}`
    );
    res.status(response.code).json(response);
  } catch (err) {
    console.log(err);
    const response = new Response(false, 500, "Server Error", err);
    logger.error(
      `Request recieved at /api/v1/user/login | Request Object - ${JSON.stringify(
        { email, ip: clientIP }
      )} | Response - ${JSON.stringify({
        err,
        code: 500,
      })}`
    );
    return res.status(response.code).json(response);
  }
};

exports.getPotentialFriends = async (req, res) => {
  try {
    const { id } = req.payload;
    const users = await userService.getAllUsers(id);
    const friends = await friendService.getAllPotentialFriends(id);
    const friendsIdList = [];

    friends.map((a) => {
      friendsIdList.push(String(a.userID));
      friendsIdList.push(String(a.friendID));
    });

    const notFriends = [];
    users.map((item) => {
      if (friendsIdList.indexOf(String(item._id)) === -1) {
        notFriends.push(item);
      }
    });
    const response = new Response(true, 200, "Success", notFriends);
    res.status(response.code).json(response);
  } catch (err) {
    console.log(err);
    const response = new Response(false, 500, "Server Error", err);
    res.status(response.code).json(response);
  }
};

exports.getFriendsRequest = async (req, res) => {
  try {
    const { id } = req.payload;
    const users = await userService.getAllUsers(id);
    const friends = await friendService.getAllFriendsRequest(id);
    const friendsIdList = Array.from(friends.map((a) => String(a.userID)));
    const notFriends = [];
    users.map((item) => {
      if (friendsIdList.indexOf(String(item._id)) !== -1) {
        notFriends.push(item);
      }
    });
    const response = new Response(true, 200, "Success", notFriends);
    res.status(response.code).json(response);
  } catch (err) {
    const response = new Response(false, 500, "Server Error", err);
    res.status(response.code).json(response);
  }
};

exports.getFriends = async (req, res) => {
  try {
    const { id } = req.payload;
    const users = await userService.getAllUsers(id);
    const friends = await friendService.getAllFriends(id);
    const friendsIdList = [];

    friends.map((a) => {
      friendsIdList.push(String(a.userID));
      friendsIdList.push(String(a.friendID));
    });
    const Friends = [];
    users.map((item) => {
      if (friendsIdList.indexOf(String(item._id)) !== -1) {
        Friends.push(item);
      }
    });
    const response = new Response(true, 200, "Success", Friends);
    res.status(response.code).json(response);
  } catch (err) {
    console.log(err);
    const response = new Response(false, 500, "Server Error", err);
    res.status(response.code).json(response);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { id } = req.payload;
    const users = await userService.getAllUsers(id);
    const response = new Response(true, 200, "Success", users);
    res.status(response.code).json(response);
  } catch (err) {
    const response = new Response(false, 500, "Server Error", err);
    res.status(response.code).json(response);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const { id } = req.payload;

    const realUser = await userService.findUserWithIdAndGetPassword(id);
    const checkPassword = await realUser.correctPassword(
      realUser.password,
      oldPassword
    );

    if (!realUser || !checkPassword) {
      const response = new Response(false, 401, "Incorrect old password");
      return res.status(response.code).json(response);
    }

    const password = await argon2.hash(newPassword);

    const user = await userService.updateUser(id, { password });

    const response = new Response(true, 200, "Password reset successful", user);
    res.status(response.code).json(response);
  } catch (err) {
    const response = new Response(false, 500, "Server Error", err);
    return res.status(response.code).json(response);
  }
};

exports.getProfileData = async (req, res) => {
  try {
    const { id: userId } = req.payload;
    const { id } = req.params;
    console.log(id);

    const user = await userService.findUserWithId(id);
    const follow = await followService.checkFollow(userId, id);
    const followStatus = follow.length > 0 ? true : false;
    const data = {
      data: user,
      followStatus,
    };

    const response = new Response(true, 200, "Success", data);
    res.status(response.code).json(response);
  } catch (err) {
    const response = new Response(false, 500, "Server Error", err);
    res.status(response.code).json(response);
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.payload;

    const user = await userService.updateUser(id, req.body);

    const response = new Response(
      true,
      200,
      "User profile updated successfully",
      user
    );
    res.status(response.code).json(response);
  } catch (err) {
    const response = new Response(false, 500, "Server Error", err);
    res.status(response.code).json(response);
  }
};

exports.imageUpload = async (req, res) => {
  try {
    const { id } = req.payload;

    cloudinary.uploader.upload(req.file.path, async (error, result) => {
      if (result) {
        let image = result.secure_url;
        const user = await userService.updateUser(id, { image });

        const response = new Response(
          true,
          200,
          "Image uploaded successfully",
          user
        );
        res.status(response.code).json(response);
      }
    });
  } catch (err) {
    const response = new Response(false, 500, "Server Error", err);
    res.status(response.code).json(response);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token, userId } = req.params;

    const payload = jwt.verify(token, JWT_SECRET);

    const { id, email } = payload;
    const userDetail = await userService.findUserWithId(id);

    if (!id || userDetail.email !== email) {
      // redirect user to token invalid or expired page
      const response = new Response(
        true,
        400,
        "Your token is invalid or expired",
        null
      );
      res.status(response.code).json(response);
    }

    const user = await userService.updateUser(id, { verified: true });
    if (user) {
      // redirect user to verified success page
    }

    const response = new Response(true, 200, "User has been verified", null);
    res.status(response.code).json(response);
  } catch (err) {
    // redirect user to token invalid or expired page
    const response = new Response(false, 500, "Server Error", err);
    res.status(response.code).json(response);
  }
};
