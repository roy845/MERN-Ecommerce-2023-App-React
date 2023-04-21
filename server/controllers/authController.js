import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import UserModel from "../models/UserModel.js";
import OrderModel from "../models/OrderModel.js";

import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail, sendEmailResetPassword } from "../middlewares/SendEmail.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    //validations
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ error: "Email is Required" });
    }
    if (!password) {
      return res.send({ error: "Password is Required" });
    }
    if (!phone) {
      return res.send({ error: "Phone is Required" });
    }
    if (!address) {
      return res.send({ error: "Address is Required" });
    }

    //check user
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "User already exists please login",
      });
    }

    //regiser user
    const hashedPassword = await hashPassword(password);

    //save new user to db
    const user = await new UserModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: `User ${user.name} Register Successfully`,
      user,
    });

    await sendEmail(
      email,
      "Welcome to ecommerce site",
      `
      <p>You recently registered to our site</p>
      <p>Save your details in order to connect</p>
      <p>Have a great day!</p>
    `
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validations
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    //create token
    const token = jwt.sign(
      { _id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },

      token,
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  // retrieve user email from request body
  const { email } = req.body;

  // check if user exists in database
  const user = await UserModel.findOne({ email }).exec();

  if (!user) {
    res.status(400).json({ message: "User not found" });
  } else {
    // generate unique token for reset password request
    const token = crypto.randomBytes(20).toString("hex");

    // create password reset token document and save to database
    const passwordResetTokenDetails = {
      email,
      token,
      expiresAt: new Date(Date.now() + 900000), // token is valid only for 15 min from generation
    };

    user.resetTokenDetails = passwordResetTokenDetails;

    await user.save();

    try {
      await sendEmailResetPassword(email, token);
      res.json({ message: "Email sent" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error sending email" });
    }
  }
};

export const resetPasswordController = async (req, res) => {
  const { token, password } = req.body;
  console.log(req.body);

  // find user by token and check expiration time
  const user = await UserModel.findOne({
    "resetTokenDetails.token": token,
    "resetTokenDetails.expiresAt": { $gt: new Date() },
  });

  if (!user) {
    res.status(400).json({ message: "Invalid or expired token" });
  } else {
    // encrypt new password using bcrypt
    const hashedPassword = await hashPassword(password);

    // update user password in database
    await UserModel.updateOne({
      email: user.email,
      password: hashedPassword,
    });

    user.resetTokenDetails = {};
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  }
};

//test controller
export const testController = (req, res) => {
  res.send("Protected Routes");
};

//get user dashboard
export const getUserDashboardController = (req, res) => {
  res.status(200).send({ ok: true });
};

//get admin dashboard
export const getAdminDashboardController = (req, res) => {
  res.status(200).send({ ok: true });
};

//update profile
export const updatProfileController = async (req, res) => {
  try {
    const { name, password, address, phone } = req.body;
    const user = await UserModel.findById(req.user._id);
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While update profile",
      error,
    });
  }
};

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await OrderModel.find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};

//all orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await OrderModel.find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating Order",
      error,
    });
  }
};
