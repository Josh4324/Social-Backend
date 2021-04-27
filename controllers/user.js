const UserService = require("../services/user");
const RoleService = require("../services/role");
const cloudinary = require("cloudinary").v2;
const MailService = require("../services/mail");
const argon2 = require("argon2");
const {Response, Token } = require('../helpers');
const {JWT_SECRET} = process.env;
const jwt = require("jsonwebtoken");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

const userService = new UserService();
const roleService = new RoleService();
const mailService = new MailService();
const token = new Token();


exports.signUp = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await userService.findUserWithEmail(email);
        if (user) {
            const response = new Response(
                true,
                409,
                "This user already exists",
              );
              res.status(response.code).json(response);
        }
       
        const newUser = await userService.createUser(req.body);

        // get user role
        const userRole = await roleService.findRoleWithName("user");
        
        const payload = {
            id: newUser._id,
            role: userRole.role,
            email: newUser.email
        };
        const newToken = await token.generateToken(payload)
        // verification token expires in 10 minutes(600 seconds)
        const verificationToken = await token.generateToken(payload, 600)
        const verificationLink = `http://${req.headers.host}/api/v1/user/verify/${newUser._id}/${verificationToken}`;
        // send verification mail
        const mail = await mailService.sendSignupEmail(newUser.email, verificationLink, newUser.firstName)

        
        const data = {
            id: newUser._id,
            token: newToken,
            role: userRole.role
        }
        const response = new Response(
            true,
            201,
            "User created successfully",
            data
          );
          res.status(response.code).json(response);
    } catch (err) {
        console.log(err);
        const response = new Response(
            false,
            500,
            "Server Error",
            err
          );
          res.status(response.code).json(response);
    }
}

exports.logIn = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body

        const user = await userService.findUserWithEmailAndGetPassword(email);
        const checkPassword = await user.correctPassword(user.password, password);

        if (!user || !(checkPassword)) {
            const response = new Response(
                false,
                401,
                "Incorrect email or password",
              );
            res.status(response.code).json(response);
        }

        const userRole = await roleService.findRoleWithName("user");

        const payload = {
            id: user._id,
            role: userRole.role
        };
        const newToken = await token.generateToken(payload);

        const data = {
            id: user._id,
            token: newToken,
            role: userRole.role
        }
        const response = new Response(
            true,
            200,
            "User logged in Successfully",
            data
          );
        res.status(response.code).json(response);

    } catch (err) {
        const response = new Response(
            false,
            500,
            "Server Error",
            err
          );
        res.status(response.code).json(response);
    }
}

exports.resetPassword = async (req, res) => {
    try {
       
        const {
            oldPassword,
            newPassword,
        } = req.body

        const {id} = req.payload;
       
        const realUser = await userService.findUserWithIdAndGetPassword(id);
        const checkPassword = await realUser.correctPassword(realUser.password, oldPassword);

        if (!realUser || !(checkPassword)) {
            const response = new Response(
                false,
                401,
                "Incorrect email or password",
              );
            res.status(response.code).json(response);
        }

        const password = await argon2.hash(newPassword); 

        const user = await userService.updateUser(id, {password})

        const response = new Response(
            true,
            200,
            "Password reset successful",
            user
          );
        res.status(response.code).json(response);

    } catch (err) {
        const response = new Response(
            false,
            500,
            "Server Error",
            err
          );
        res.status(response.code).json(response);
    }
}

exports.getProfileData = async (req, res) => {
    try {
        const {id} = req.payload;

        const user = await userService.findUserWithId(id);

       const response = new Response(
            true,
            200,
            "Success",
            user
          );
        res.status(response.code).json(response);
        
    }catch(err){
        const response = new Response(
            false,
            500,
            "Server Error",
            err
          );
        res.status(response.code).json(response);
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const {id} = req.payload;
        
        const user = await userService.updateUser(id, req.body)

        const response = new Response(
            true,
            200,
            "User profile updated successfully",
            user
          );
        res.status(response.code).json(response);

    }catch (err){
        const response = new Response(
            false,
            500,
            "Server Error",
            err
          );
        res.status(response.code).json(response);
    }
}

exports.imageUpload = async (req, res) => {
    try {
        const {id} = req.payload;

        cloudinary.uploader.upload(req.file.path, async (error, result) => {
            if (result) {
                let image = result.secure_url;
                const user = await userService.updateUser(id, {image})
                
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
        const response = new Response(
            false,
            500,
            "Server Error",
            err
          );
        res.status(response.code).json(response);
    }
}

exports.verifyEmail = async (req, res) => {
    try {
       
        const { token, userId } = req.params;

        const payload = jwt.verify(token, JWT_SECRET);

        const {id, email} = payload;
        const userDetail = await userService.findUserWithId(id);
        console.log(email);
        console.log(userDetail);


        if (!id || userDetail.email !== email){
            // redirect user to token invalid or expired page
            const response = new Response(
                true,
                400,
                "Your token is invalid or expired",
                null
              );
            res.status(response.code).json(response);
        }

        const user = await userService.updateUser(id, {verified: true})  
        if (user){
            // redirect user to verified success page
        }     

        const response = new Response(
            true,
            200,
            "User has been verified",
            null
          );
        res.status(response.code).json(response);

    }catch (err){
        // redirect user to token invalid or expired page
        const response = new Response(
            false,
            500,
            "Server Error",
            err
          );
        res.status(response.code).json(response);
    }
}





