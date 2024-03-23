const jwt = require("jsonwebtoken");
require("dotenv").config();
import { Request, Response, NextFunction } from "express";
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers["authorization"];
  const token = auth && auth.split(" ")[1];
  console.log("no token");
  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }
  console.log("wrong token");
  jwt.verify(token, process.env.JWT_KEY, (err: any, user: any) => {
    console.log("Middleware: ", token);
    if (err) return res.status(401).json({ message: "Invalid token", err });

    req.body.user = user;
    console.log(user);
    next();
  });
}

module.exports = authenticateToken;
