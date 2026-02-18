import User from "../models/user.model.js";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { client } from "../config/google.js";
import axios from "axios";
import { pubClient } from "../config/redis.js";
import { decrypt, encrypt } from "../utils/encryption.js";
import LinkedInProfile from "../models/linkedin.model.js";

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

    await pubClient.publish(
      "mail:events",
      JSON.stringify({
        event: "WELCOME_EMAIL",
        email: user.email,
        name: user.userName,
      }),
    );
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
    let isPasswordCorrect = false;
    if (isUserExits.password) {
      isPasswordCorrect = await bcrypt.compare(password, isUserExits.password);
    }

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ message: "This combination is not valid", success: false });
    }

    const token = createToken(isUserExits);
    createCookie(token, res);

    return res.status(200).json({
      success: true,
      message: "Login successfully",
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
      },
    );
    const { email, name } = userRes.data;
    let isUserExits = true;

    let user = await User.findOne({ email });
    if (!user) {
      isUserExits = false;
      user = await User.create({
        email,
        userName: name,
        avatar: userRes.data.picture,
      });
    }
    const token = createToken(user);
    createCookie(token, res);

    if (!isUserExits) {
      await pubClient.publish(
        "mail:events",
        JSON.stringify({
          event: "WELCOME_EMAIL",
          email: user.email,
          name: user.userName,
        }),
      );
    }
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

export const isAuth = async (req, res) => {
  try {
    const user = req.user;
    if (!user?._id) {
      return res
        .status(401)
        .json({ message: "Not Authorized", success: false });
    }

    let newUser = await User.findById(user._id).select("-password");

    if (!newUser) {
      return res
        .status(401)
        .json({ message: "Not Authorized", success: false });
    }
    return res.status(200).json({
      message: "User Authenticated",
      user: newUser,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

export const linkedInCodeExchange = async (req, res) => {
  try {
    const { code, _id } = req.body;


    console.log(code , _id);
    

    // 1️⃣ Validate code
    if (!code || !_id) {
      return res.status(400).json({
        success: false,
        message: "Authorization code is required",
      });
    }

    // 2️⃣ Validate user
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 3️⃣ Exchange code for access token
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", process.env.LINKEDIN_REDIRECT_URI);
    params.append("client_id", process.env.LINKEDIN_CLIENT_ID);
    params.append("client_secret", process.env.LINKEDIN_CLIENT_SECRET);

    const tokenRes = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    if (tokenRes.status !== 200) {
      return res.status(500).json({
        success: false,
        message: "Failed to exchange code for access token",
        error: tokenRes?.data || "Unknown error",
      });
    }

    const access_token = tokenRes?.data?.access_token;
    const expires_in = tokenRes?.data?.expires_in;

    if (!access_token) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve access token from LinkedIn",
      });
    }

    // 4️⃣ Encrypt token
    const encryptedToken = encrypt(access_token);

    if (!encryptedToken) {
      return res.status(500).json({
        success: false,
        message: "Encryption failed",
      });
    }

    // 5️⃣ Calculate expiry date
    const expiryDate = expires_in
      ? new Date(Date.now() + expires_in * 1000)
      : null;

    // 6️⃣ Save to database
    const updatedProfile = await LinkedInProfile.findByIdAndUpdate(
      { _id },
      {
        $set: {
          linkedInToken: {
            ...encryptedToken,
            expiry: expiryDate,
          },
          isLinkedInConnected: true,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    console.log(updatedProfile);

    if (!updatedProfile) {
      return res.status(500).json({
        success: false,
        message: "Failed to update LinkedIn profile",
      });
    }

    // 7️⃣ Optional integrity check (decrypt once to verify)
    try {
      decrypt(JSON.stringify(updatedProfile.linkedInToken));
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Token saved but decryption validation failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "LinkedIn connected successfully",
      tokenExpiry: expiryDate,
    });
  } catch (error) {
    console.error(
      "LinkedIn Token Exchange Error:",
      error.response?.data || error.message,
    );

    return res.status(500).json({
      success: false,
      message: "Token exchange failed",
    });
  }
};
