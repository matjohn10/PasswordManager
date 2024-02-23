import { Request, Response } from "express";
const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req: Request, res: Response) => {
  // check if we have cookies and refresh token
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  // find user and check if we have found one
  const user = await User.findOne({ refreshToken: cookies.jwt });
  if (!user) return res.sendStatus(401);

  // check refresh token's validity, if good create new token
  jwt.verify(cookies.jwt, process.env.REFRESH_KEY, (err: any, decoded: any) => {
    if (err || decoded.userId !== user._id.toString()) {
      return res.status(403).json({ message: "Invalid token", err });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
      expiresIn: "15m",
    });
    res.json({ token });
  });
});

module.exports = router;
