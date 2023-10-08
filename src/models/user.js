const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email is already exists"],
      trim: true,
      validate: {
        validator: (value) => {
          const re =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
          return value.match(re);
        },
        message: "Please enter a valid email address.",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile is required"],
      unique: [true, "Mobile is already exists"],
      trim: true,
      validate: {
        validator: (value) => {
          const re = /^[0-9]{10}$/;
          return value.match(re);
        },
        message: "Please enter a valid mobile number.",
      },
    },
    rollNo: {
      type: String,
      required: [true, "Roll Number is required"],
      unique: [true, "Roll Number already exists"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
