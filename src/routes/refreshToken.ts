import { Request, Response } from "express";
const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();
const User = require("../models/User");

router.post("/", async (req: Request, res: Response) => {
  // req.body = { userId }

  // find user and check if we have found one
  const user = await User.findOne({ _id: req.body.userId });
  console.log(user);
  if (!user || !user.refreshToken) return res.sendStatus(401);

  // check refresh token's validity, if good create new token
  jwt.verify(
    user.refreshToken,
    process.env.REFRESH_KEY,
    (err: any, decoded: any) => {
      if (err || decoded.userId !== user._id.toString()) {
        return res.status(403).json({ message: "Invalid token", err });
      }
      const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
        expiresIn: "15m",
      });
      res.status(200).json({ token });
    }
  );
});

module.exports = router;
