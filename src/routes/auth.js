const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const authRouter = express.Router();

// SignUp route
authRouter.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password, mobile, rollNo } = req.body;
    if (!name || !email || !password || !mobile || !rollNo) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    // check if email already exists
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
    // check if mobile already exists
    const checkMobile = await User.findOne({ mobile });
    if (checkMobile) {
      return res.status(400).json({
        message: "Mobile already exists",
      });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 11);

    let user = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      rollNo,
    });
    
    // save user
    user = await user.save();
    // send response
    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: `Internal server error : ${err.message}`,
    });
  }
});


// SignIn route
authRouter.post("/auth/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    // check if User exists
    const checkuser = await User.findOne({ email });
    if (!checkuser) {
      return res.status(400).json({
        message: "Invalid email please try again with correct email",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, checkuser.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials Password does not match",
      });
    }

    // generate token
    const token = jwt.sign({ id: checkuser._id }, process.env.JWT_SECRET);
    res.header("x-auth-token", token);

    // send response
    res.status(200).json({
      message: "User signin successfully",
      user: {...checkuser._doc, token},
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: `Internal server error : ${err.message}`,
    });
  }
});


// Validate Token
authRouter.post("/auth/tokenIsValid", async (req, res) => {
    try {
      const token = req.header("x-auth-token");
      if (!token) {
        return res.json({ res: false });
      }
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified) {
        return res.json({ res: false });
      }
      const user = await User.findById(verified.id);
      if (!user) {
        return res.json({ res: false });
      }
      return res.json({ res: true , user: {...user._doc, token}});
    } catch (err) {
      console.error(err.message); // Log the error for debugging
      res.status(500).send("Server Error");
    }
  });
  
  // Get User
  authRouter.get("/auth", auth, async (req, res) => {
    try {
      const user = await User.findById(req.user); // Add await here
      res.json({ ...user._doc, token: req.token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  });

module.exports = authRouter;
