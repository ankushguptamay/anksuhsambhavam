const express = require('express');
const { registerUser, userLogin, verifyOtp, userProfile } = require('../Controller/userProfile');
const user = express.Router();

// middleware
const jwt = require('../Middleware/verifyJWTToken');
const { isUserPreasent } = require('../Middleware/isPresent');

user.post("/registerUser", registerUser);
user.post("/loginUser", userLogin);
user.post("/verifyOtp", verifyOtp);
user.get("/profile", jwt.verifyJWT, userProfile);


module.exports = user;