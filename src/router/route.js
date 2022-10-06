const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");




router.post("/register", userController.createUser);


router.post("/login", userController.loginUser);

router.get("/getuser", userController.getuser);
router.post("/updateuser/:userId", userController.updateuser);


module.exports = router;



