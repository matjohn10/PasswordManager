import { Request, Response } from "express";
const express = require("express");
require("dotenv").config();
const { encrypt, decrypt } = require("../controllers/encryptionController");
const router = express.Router();
const Manager = require("../models/Manager");
const User = require("../models/User");
const makeUpdateObj = require("../utils/updateObj");
const createCSV = require("../utils/createCSV");

// GET all the users information
router.get("/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;

  // find user and check if there is one, if yes -> make sure the id in params is the same as the token user.
  const user = await User.findOne({ _id: userId });
  if (!user || req.body.user.userId !== userId) return res.sendStatus(401);

  //Get the user's managed passwords
  const info = await Manager.find({ userId }).exec();
  if (!info) return res.sendStatus(404);

  res.status(200).json(info);
});
// GET specific information
router.get("/:userId/:managerId", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const managerId = req.params.managerId;

  // find user and check if there is one, if yes -> make sure the id in params is the same as the token user.
  const user = await User.findOne({ _id: userId });
  if (!user || req.body.user.userId !== userId) return res.sendStatus(401);

  // Get specific user's managed password
  const info = await Manager.findOne({ userId, _id: managerId });
  if (!info) return res.sendStatus(404);
  res.status(200).json(info);
});
// Download passwords as a csv file
router.post("/download", async (req: Request, res: Response) => {
  // req.body = { userId }
  try {
    // find user and check if there is one, if yes -> make sure the id in params is the same as the token user.
    const user = await User.findOne({ _id: req.body.userId });

    if (!user || user._id.toString() !== req.body.user.userId)
      return res.sendStatus(401);

    const info = await Manager.find({ userId: req.body.user.userId });
    if (!info) return res.sendStatus(404);

    // file url is created and ready to be downloaded on the frontend.
    const file: string = createCSV(info);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=data.csv");
    res.send(file);
  } catch (err) {
    res.status(500).json({ message: "Error preparing csv file.", err });
  }
});
// Add to the users information
router.post("/add", async (req: Request, res: Response) => {
  // req.body = { username, password, name, description }
  try {
    const encryptedPWD = encrypt(req.body.password);
    const pwdInfo = {
      userId: req.body.user.userId,
      username: req.body.username,
      password: encryptedPWD.password,
      iv: encryptedPWD.iv,
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
  // req.body = { managerId, username, password, name, description }
  try {
    // makes update object, except the IDs
    const toUpdate: { [key: string]: any } = makeUpdateObj(req.body, [
      "managerId",
      "user",
    ]);

    // Check if there is something to update
    if (Object.keys(toUpdate).length === 0) return res.sendStatus(201);

    // encrypts the new password if it is passed in req.body
    if (Object.keys(toUpdate).includes("password")) {
      const encrypted = encrypt(toUpdate.password);
      toUpdate.password = encrypted.password;
      toUpdate["iv"] = encrypted.iv;
    }
    const update = await Manager.findOneAndUpdate(
      { _id: req.body.managerId, userId: req.body.user.userId },
      toUpdate,
      { returnDocument: "after" }
    );
    const saved = await update.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Error updating.", err });
  }
});
// Delete the users information
router.post("/del", async (req: Request, res: Response) => {
  // req.body { managerId }
  try {
    const deleted = await Manager.findOneAndDelete({
      _id: req.body.managerId,
      userId: req.body.user.userId,
    });
    res.status(200).json(deleted);
  } catch (err) {
    res.status(500).json({ message: "Error deleting.", err });
  }
});

//Decipher using the url name passed in req.body
router.post("/decipher-pwd", async (req: Request, res: Response) => {
  // const cookies = req.cookies;
  // console.log(cookies);
  //if (!cookies?.jwt) return res.sendStatus(401);
  // find user and check if there is one, if yes -> make sure the id in params is the same as the token user.
  console.log("here");
  const user = await User.findOne({ _id: req.body.user.userId });
  console.log(user);
  if (!user) return res.sendStatus(401);

  // Get specific user's managed password
  const info = await Manager.findOne({
    userId: req.body.user.userId,
    name: req.body.url,
  }).select({
    _id: 0,
    username: 1,
    password: 1,
    iv: 1,
  });
  const decrypted = decrypt(info);
  if (!info) return res.sendStatus(404);
  res.status(200).json({ username: info.username, password: decrypted });
});

// Decipher the password to show to the user
router.post("/decipher-pwd/:managerId", async (req: Request, res: Response) => {
  const managerId = req.params.managerId;
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);
  // find user and check if there is one, if yes -> make sure the id in params is the same as the token user.
  const user = await User.findOne({ refreshToken: cookies.jwt });
  if (!user || user._id.toString() !== req.body.user.userId)
    return res.sendStatus(401);

  // Get specific user's managed password
  const info = await Manager.findOne({
    userId: req.body.user.userId,
    _id: managerId,
  }).select({
    _id: 0,
    password: 1,
    iv: 1,
  });
  const decrypted = decrypt(info);
  if (!info) return res.sendStatus(404);
  res.status(200).json({ password: decrypted });
});

module.exports = router;
