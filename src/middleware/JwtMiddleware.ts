const jwt = require("jsonwebtoken");
require("dotenv").config();
import { Request, Response, NextFunction } from "express";
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers["authorization"];
  const token = auth && auth.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }
  jwt.verify(token, process.env.JWT_KEY, (err: any, user: any) => {
    if (err) return res.status(401).json({ message: "Invalid token", err });

    console.log("Good user in middleware");
    req.body.user = user;
    next();
  });
}

module.exports = authenticateToken;
