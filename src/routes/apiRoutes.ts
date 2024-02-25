import { Request, Response } from "express";
const express = require("express");
require("dotenv").config();
const { encode } = require("../controllers/encryptionController");
const router = express.Router();
const Manager = require("../models/Manager");
const User = require("../models/User");
const makeUpdateObj = require("../utils/updateObj");

// GET all the users information
router.get("/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  // find user and check if there is one, if yes -> make sure the id in params is the same as the token user.
  const user = await User.findOne({ refreshToken: cookies.jwt });
  if (!user || user._id.toString() !== userId) return res.sendStatus(401);

  //Get the user's managed passwords
  const info = await Manager.find({ userId }).exec();
  if (!info) return res.sendStatus(404);

  res.status(200).json(info);
});
// GET specific information
router.get("/:userId/:managerId", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const managerId = req.params.managerId;

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  // find user and check if there is one, if yes -> make sure the id in params is the same as the token user.
  const user = await User.findOne({ refreshToken: cookies.jwt });
  if (!user || user._id.toString() !== userId) return res.sendStatus(401);

  // Get specific user's managed password
  const info = await Manager.findOne({ userId, _id: managerId });
  if (!info) return res.sendStatus(404);
  res.status(200).json(info);
});
// Download passwords as a csv file
router.get("/download-all", async (req: Request, res: Response) => {});
// Add to the users information
router.post("/add", async (req: Request, res: Response) => {
  // req.body = { userId, username, password, name, description }
  try {
    const encryptedPWD = encode(req.body.password, {
      algo: process.env.ENCRYPTION_ALGO,
      salt: process.env.ENCRYPTION_SALTS,
      iterations: parseInt(process.env.ENCRYPTION_ITER || "", 10),
    });
    const pwdInfo = {
      userId: req.body.userId,
      username: req.body.username,
      password: encryptedPWD,
      name: req.body.name,
      description: req.body.description,
    };
    const duplicate = await Manager.findOne({ name: req.body.name });
    if (duplicate) {
      // update the old for the new values
      const update = await Manager.findOneAndUpdate(
        { name: req.body.name },
        pwdInfo,
        { returnDocument: "after" }
      );
      const saved = await update.save();
      res.status(201).json(saved);
    } else {
      // create a new one
      const newManaged = new Manager(pwdInfo);
      const saved = await newManaged.save();
      res.status(201).json(saved);
    }
  } catch (err) {
    res.status(500).json({ message: "Error adding password.", err });
  }
});
// Update the users information
router.post("/update", async (req: Request, res: Response) => {
  // req.body = { managerId, userId, username, password, name, description }
  try {
    const toUpdate: { [key: string]: any } = makeUpdateObj(req.body);
    // Check if there is something to update
    if (Object.keys(toUpdate).length === 0) return res.sendStatus(201);

    const update = await Manager.findOneAndUpdate(
      { _id: req.body.managerId, userId: req.body.userId },
      toUpdate,
      { returnDocument: "after" }
    );
    const saved = await update.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Error adding password.", err });
  }
});
// Delete the users information
router.post("/del", async (req: Request, res: Response) => {});

module.exports = router;
