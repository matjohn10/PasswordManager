const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();
const User = require("../models/User");
import { Request, Response } from "express";
const authenticateToken = require("../middleware/JwtMiddleware");

router.post("/register", async (req: Request, res: Response) => {
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
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ message: "Error registering user.", err });
  }
});

router.post("/login", async (req: Request, res: Response) => {
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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Error login user." });
  }
});

router.get("/test", authenticateToken, async (req: Request, res: Response) => {
  res.send("Connected!!!");
});

module.exports = router;
