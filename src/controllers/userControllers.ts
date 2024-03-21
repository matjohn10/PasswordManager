const jwt = require("jsonwebtoken");
const User = require("../models/User");
import { Request, Response } from "express";
const { encode, verify } = require("../controllers/encryptionController");
require("dotenv").config();

const handleRegister = async (req: Request, res: Response) => {
  try {
    const encryptedPWD = encode(req.body.password, {
      algo: process.env.ENCRYPTION_ALGO,
      salt: process.env.ENCRYPTION_SALTS,
      iterations: parseInt(process.env.ENCRYPTION_ITER || "", 10),
    });

    // Checks duplicate username, custom error handling
    const dupUsername = await User.findOne({ username: req.body.username });
    if (dupUsername)
      return res.status(400).json({ message: "Username already in use." });

    const newUser = new User({
      username: req.body.username,
      password: encryptedPWD,
    });

    const savedUser = await newUser.save();

    // MAYBE DO NOT SEND USER HERE
    res
      .status(201)
      .json({ username: savedUser.username, userId: savedUser._id });
  } catch (err) {
    res.status(500).json({ message: "Error registering user.", err });
  }
};

const handleLogin = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const validPassword = verify(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Valid user, create tokens, save refresh token in DB and send to browser
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
      expiresIn: "15m",
    });
    const refresh = jwt.sign({ userId: user._id }, process.env.REFRESH_KEY, {
      expiresIn: "7d",
    });
    await User.updateOne(
      { username: req.body.username },
      { refreshToken: refresh }
    );
    // res.cookie("jwt", refresh, {
    //   httpOnly: false,
    //   maxAge: 24 * 60 * 60 * 1000,
    // });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Error login user.", err });
  }
};

const handleLogout = async (req: Request, res: Response) => {
  // Logout backend: clear the JWT in the DB and the cookies.
  // req.body = { userId }
  try {
    // find user and check if we have found one
    const user = await User.findOne({ _id: req.body.userId });
    if (!user) return res.sendStatus(401);

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { refreshToken: "" },
      { returnDocument: "after" }
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ message: "Error logout user.", err });
  }
};

module.exports = { handleLogin, handleRegister, handleLogout };
