import User from "../models/user.model.js";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { client } from "../config/google.js";
import axios from "axios";

const createToken = (user) => {
  const data = {
    _id: user._id,
    email: user.email,
    totalCredits: user.totalCredits,
    userName: user.userName,
    currentResumeId: user.currentResumeId,
    currentLinkedInId: user.currentLinkedInId,
  };
  return jwt.sign(data, "secret", { expiresIn: "7d" });
};

const createCookie = (token, res) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // use https in prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // works for localhost
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const isUserExits = await User.findOne({ email });

    if (isUserExits) {
      return res
        .status(400)
        .json({ message: "User already exits", success: false });
    }

    const hashedPassWord = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      email,
      password: hashedPassWord,
    });

    const token = createToken(user);
    createCookie(token, res);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const isUserExits = await User.findOne({ email });

    if (!isUserExits) {
      return res
        .status(400)
        .json({ message: "User Not Found", success: false });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      isUserExits.password
    );

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: "Password is incorrect", success: false });
    }

    const token = createToken(isUserExits);
    createCookie(token, res);

    return res.status(200).json({
      success: true,
      message: "Login successfully",
      token,
      user: isUserExits,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res
        .status(400)
        .json({ message: "Code is required", success: false });
    }
    const googleRes = await client.getToken({
      code,
      redirect_uri: "postmessage",
    });
    client.setCredentials(googleRes.tokens);
    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${googleRes.tokens.access_token}`,
        },
      }
    );
    const { email, name } = userRes.data;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        userName: name,
        avatar: userRes.data.picture,
      });
    }
    const token = createToken(user);
    createCookie(token, res);
    return res.status(200).json({
      success: true,
      message: "Login successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};
