const UserModel = require("../Model/UserModel");
const jwt = require("jsonwebtoken");




const createUser = async function (req, res) {
  try {
    let data = req.body; 

    let { name, emailId, phone, password } = data;

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
   
    //checking is there same phone number present inside database or not
    let isAllreadyExistPhone = await UserModel.findOne({ phone: phone });
    if (isAllreadyExistPhone) {
      return res.status(400).send({
        status: false,
        message: ` this phone number- ${phone} already exist`,
      });
    }

    
    let user = await UserModel.create(data);
    res
      .status(201)
      .send({ status: true, data: user._id, msg: "User Successfully Created" });
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
      console.log("publicAddress:"+user.publicAddress)
      console.log("privateKey:"+user.privateKey)
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
      .send({ status: true, token: token, data:user.publicAddress, msg: "User logged in successfully" });
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


const updateuser = async function (req, res) {
  try {
    let userId = req.params.userId; 

    if (!userId) {
      return res
        .status(400)
        .send({ status: false, message: "User Id is Required" });
    }

   
    // if (!isValidObjectId(userId)) {
    //   return res
    //     .status(400)
    //     .send({ status: false, message: "Please provide a valid User Id" });
    // }
    let finduser = await UserModel.findById({ _id: userId });
    if (!finduser) {
      return res
        .status(403)
        .send({ status: false, message: "User Id is not Valid" });
    }

    
    
    if (finduser.length == 0) {
      return res.status(404).send({ status: false, message: "User not Found" });
    }

    //checking wheather the book is deleted or what, if deleted it should return the below response
    

   
    if (!finduser) {
      return res
        .status(403)
        .send({ status: false, message: "User Id is not Valid" });
    }

    let requestBody = req.body; //getting data in request body
    let { publicAddress, privateKey} = requestBody; //Destructuring data coming from request body

    //validation starts
    if (publicAddress && privateKey) {
      if (!publicAddress) {
        return res
          .status(400)
          .send({ status: false, message: "Provide a Valid public address" });
      }
      //checking wheather the title of the book is present in the database ot what
      let isAllreadyExistTitle = await UserModel.findOne({ publicAddress: publicAddress });
      if (isAllreadyExistTitle) {
        return res.status(400).send({
          status: false,
          message: `${publicAddress} - address is allready exist`,
        });
      }
    }



    //find the book from the bookmodel and updating it
    let userUpdated = await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          publicAddress: requestBody.publicAddress,
         privateKey: requestBody.publicAddress,
        },
      },
      { new: true }
    );

    return res.status(200).send({
      status: true,
      message: "User Data Updated Successfully",
      data: userUpdated,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;
module.exports.getuser = getuser;
module.exports.updateuser = updateuser;;
