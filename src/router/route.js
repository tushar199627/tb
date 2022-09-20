const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");

router.post("/otp", userController.generateOtp);

router.post("/register", userController.createUser);

router.post("/forgetPassword", userController.forgotPassword);

router.post("/updatePassword", userController.UpdatePassword);

router.post("/login", userController.loginUser);

router.get("/getuser", userController.getuser);

module.exports = router;



