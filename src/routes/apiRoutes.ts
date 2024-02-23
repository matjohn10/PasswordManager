import { Request, Response } from "express";
const express = require("express");
require("dotenv").config();
const router = express.Router();
const Manager = require("../models/Manager");

// GET all the users information
router.get("/", async (req: Request, res: Response) => {
  res.send("Hello API!");
});
// GET specific information
router.get("/:managerId", async (req: Request, res: Response) => {
  const ID = req.params.managerId;
});
// Download passwords as a csv file
router.get("/download-all", async (req: Request, res: Response) => {});
// Add to the users information
router.post("/add", async (req: Request, res: Response) => {});
// Update the users information
router.post("/update", async (req: Request, res: Response) => {});
// Delete the users information
router.post("/del", async (req: Request, res: Response) => {});

module.exports = router;
