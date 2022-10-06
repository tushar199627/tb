const UserModel = require("../Model/UserModel");
const jwt = require("jsonwebtoken");
const { Otp } = require("../Model/otpModel");
const otpGenerator = require("otp-generator");
const short = require('shortid');
require('dotenv').config();
const client = require('twilio')('AC23815dc1ab54aa8d76831b0e74680e44', '43367b95a79dc769b916d3ce0c66c542')

const { uploadFile } = require("../aws/uploadfile");


exports.generateOtp = async function (req, res) {
  const user = await UserModel.findOne({ phone: req.body.phone });

  if (user) return res.status(400).send("User already Registered");
  const OTP = otpGenerator.generate(4, {
    digits: true,
    alphabets: false,
    uppercase: false,
    specialChars: false,
  });

  const phone = req.body.phone;
  console.log(phone)
  console.log(OTP);

  const otp = new Otp({ phone: phone, otp: OTP });

  client.messages
.create({body: `Hi there ${OTP}`, from: '+16182437377', to: `${phone}`})
.then(message => console.log(message.sid));


  const result = await otp.save();
  console.log(result)
  
  res.status(200).send({msg: "Otp send successfully"});
};

const createUser = async function (req, res) {
  try {
    let data = req.body; 

    let { profileImage, userId,name, emailId, phone, otp, password } = data;

    //=================================================Validation starts===================================================================
    if (!name) {
      return res
        .status(400)
        .send({ status: false, message: "name is required" });
    }

    if (!emailId) {
      return res
        .status(400)
        .send({ status: false, message: "user email is required" });
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailId)) {
      return res.status(400).send({
        status: false,
        message: `Email should be a valid email address`,
      });
    }

    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "user password is required" });
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      return res.status(400).send({
        status: false,
        message: `password should contain atleastone number or one alphabet and should be 9 character long`,
      });
    }

    let emailAllready = await UserModel.findOne({ emailId });
    if (emailAllready) {
      return res
        .status(400)
        .send({ status: false, message: `${emailId} already exist` });
    }
    if (!phone) {
      return res.status(400).send({
        status: false,
        message: "Please provide a Phone Number or a Valid Phone Number",
      });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).send({
        status: false,
        message: `this phone number-${phone} is not valid, try an Indian Number`,
      });
    }
    if (!otp) {
      return res.status(400).send({
        status: false,
        message: `Please Provide Otp for verification`,
      });
    }

    let verify = await Otp.findOne({ phone });
    if (!verify) {
      return res
        .status(400)
        .send({ msg: "Please Enter a registered phone number" });
    }
    console.log(verify.phone);
    if (verify.otp != otp) {
      return res
        .status(400)
        .send({ status: false, msg: "Otp not Valid, Please enter valid otp" });
    }
    //checking is there same phone number present inside database or not
    let isAllreadyExistPhone = await UserModel.findOne({ phone: phone });
    if (isAllreadyExistPhone) {
      return res.status(400).send({
        status: false,
        message: ` this phone number- ${phone} already exist`,
      });
    }

    let files = req.files;

    if (files && files.length > 0) {
      profileImage = await uploadFile(files[0]); //select first image
    }

    // Add profileImage
    userId=short()
    data.userId=userId

    data.profileImage = profileImage;



    
    let user = await UserModel.create(data);
    res
      .status(201)
      .send({ status: true, date: user, msg: "User Successfully Created" });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.stack });
  }
};
exports.forgotPassword = async function (req, res) {
  const user = await UserModel.findOne({ phone: req.body.phone });

  if (!user) return res.status(400).send("Phone No does not exist");
  const OTP = otpGenerator.generate(4, {
    digits: true,
    alphabets: false,
    uppercase: false,
    specialChars: false,
  });

  const phone = req.body.phone;
  console.log(OTP);

  const otp = new Otp({ phone: phone, otp: OTP });

  const result = await otp.save();

  res.status(200).send("Otp send successfully");
};

exports.UpdatePassword = async function (req, res) {
  try {
    let data = req.body;

    let { phone, otp, password } = data;
    if (!phone) {
      return res.status(400).send({
        status: false,
        message: "Please provide a Phone Number or a Valid Phone Number",
      });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).send({
        status: false,
        message: `this phone number-${phone} is not valid, try an Indian Number`,
      });
    }
    if (!otp) {
      return res.status(400).send({
        status: false,
        message: `Please Provide Otp for verification`,
      });
    }

    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter new password" });
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      return res.status(400).send({
        status: false,
        message: `password should contain atleastone number or one alphabet and should be 9 character long`,
      });
    }

    let verify = await Otp.findOne({ phone });
    if (!verify) {
      return res
        .status(400)
        .send({ msg: "Please Enter a registered phone number" });
    }
    console.log(verify.phone);
    if (verify.otp != otp) {
      return res
        .status(400)
        .send({ status: false, msg: "Otp not Valid, Please enter valid otp" });
    }
    let updatepass = await UserModel.findOneAndUpdate(
      { phone: phone },
      {
        $set: { password: password },
      },
      { new: true }
    );

    if (updatepass == null) {
      res.status(404).send({ status: false, msg: "Phone no not found" });
    } else {
      res
        .status(200)
        .send({ status: true, msg: "Password Updated Successfully" });
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.stack });
  }
};

const loginUser = async function (req, res) {
  try {
    let emailId = req.body.emailId;
    let password = req.body.password;

    if (!emailId) {
      return res.status(400).send({ status: false, msg: "Email is required" });
    }
    if (!password) {
      return res
        .status(400)
        .send({ status: false, msg: "password is required" });
    }

    let user = await UserModel.findOne({
      emailId: emailId,
      password: password,
    });
    if (!user)
      return res.status(400).send({
        status: false,
        msg: "Invalid Email or Password",
      });

    let token = jwt.sign(
      {
        userId: user._id.toString(),
        organisation: "IG",
      },
      "IG-secretKey"
    );
    res.setHeader("x-api-key", token);

    return res
      .status(200)
      .send({ status: true, token: token, msg: "User logged in successfully" });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};



const getuser = async function (req, res) {
  try {
    const users = await UserModel.find();
    res.status(200).send({ status: true, message: "User list", data: users });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
module.exports.getuser = getuser;
