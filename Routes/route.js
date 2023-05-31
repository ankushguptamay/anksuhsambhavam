const express = require('express');
const { registerUser, userLogin, verifyLoginOtp, resendOTPForRegistration, verifyRegisterOtp, userProfile, updateUserProfile } = require('../Controller/userProfile');
const { addUserForm, userForm } = require('../Controller/userForm');
const { addUserProfileImage, userProfileImage } = require('../Controller/userProfileImage');
const user = express.Router();

// middleware
const jwt = require('../Middleware/verifyJWTToken');
const { isUserPreasent } = require('../Middleware/isPresent');
const uploadSingleImage = require('../Middleware/uploadProfile');

user.post("/registerUser", registerUser);
user.post("/loginUser", userLogin);
user.post("/verifyOtp", verifyLoginOtp);
user.post("/verifyRegisterOtp", verifyRegisterOtp);
user.post("/resendOTPForRegistration", resendOTPForRegistration);
user.get("/profile", jwt.verifyJWT, userProfile);
user.put("/updateProfile", jwt.verifyJWT, updateUserProfile);

user.post("/addForm", jwt.verifyJWT, isUserPreasent, addUserForm);
user.get("/form", jwt.verifyJWT, isUserPreasent, userForm);

user.post("/addProfileImage", jwt.verifyJWT, isUserPreasent, uploadSingleImage.single("profileImage"), addUserProfileImage);
user.get("/profileImage", jwt.verifyJWT, isUserPreasent, userProfileImage);

module.exports = user;