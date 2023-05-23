const express = require('express');
const { registerUser, userLogin, verifyOtp, userProfile, updateUserProfile } = require('../Controller/userProfile');
const { addUserForm, userForm } = require('../Controller/userForm');
const user = express.Router();

// middleware
const jwt = require('../Middleware/verifyJWTToken');
const { isUserPreasent } = require('../Middleware/isPresent');

user.post("/registerUser", registerUser);
user.post("/loginUser", userLogin);
user.post("/verifyOtp", verifyOtp);
user.get("/profile", jwt.verifyJWT, userProfile);
user.put("/updateProfile", jwt.verifyJWT, updateUserProfile);

user.post("/addForm", jwt.verifyJWT, isUserPreasent, addUserForm);
user.get("/form", jwt.verifyJWT, isUserPreasent, userForm);

module.exports = user;