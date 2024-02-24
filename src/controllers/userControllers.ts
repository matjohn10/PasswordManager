const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
import { Request, Response } from "express";
require("dotenv").config();

const handleRegister = async (req: Request, res: Response) => {
  try {
    const salts = 10;
    const hashedPWD = await bcrypt.hash(req.body.password, salts);

    // Checks duplicate username, custom error handling
    const dupUsername = await User.findOne({ username: req.body.username });
    if (dupUsername)
      return res.status(400).json({ message: "Username already in use." });

    const newUser = new User({
      username: req.body.username,
      password: hashedPWD,
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
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Valid user, create tokens, save refresh token in DB and send to browser
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
      expiresIn: "15m",
    });
    const refresh = jwt.sign({ userId: user._id }, process.env.REFRESH_KEY, {
      expiresIn: "1d",
    });
    await User.updateOne(
      { username: req.body.username },
      { refreshToken: refresh }
    );
    res.cookie("jwt", refresh, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Error logout user.", err });
  }
};

const handleLogout = async (req: Request, res: Response) => {
  // Logout backend: clear the JWT in the DB and the cookies.
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    // find user and check if we have found one
    const user = await User.findOne({ refreshToken: cookies.jwt });
    if (!user) return res.sendStatus(401);

    const updatedUser = await User.findOneAndUpdate(
      { refreshToken: cookies.jwt },
      { refreshToken: "" },
      { returnDocument: "after" }
    );
    res.clearCookie("jwt");
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ message: "Error logout user.", err });
  }
};

module.exports = { handleLogin, handleRegister, handleLogout };
