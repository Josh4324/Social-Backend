const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {Token} = require('../helpers');
const userController = require("../controllers/user");
const validation = require("../middlewares/validation");
const auth = require("../middlewares/authorization");

const token = new Token();


router.post(
    '/signup', 
    validation.signUpValidationRules(), 
    validation.validate, 
    userController.signUp
);

router.post(
    '/login', 
    validation.loginValidationRules(), 
    validation.validate,  
    userController.logIn
);

router.patch(
    '/resetpassword', 
    token.verifyToken, 
    auth.authorization("user", "admin","super-admin"), 
    validation.resetPasswordValidationRules(), 
    validation.validate,  
    userController.resetPassword
);

router.get(
    '/verify/:userId/:token', 
    userController.verifyEmail
);



module.exports = router;
