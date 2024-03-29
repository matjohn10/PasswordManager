import { Request, Response } from "express";

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
require("./db.ts");
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//protection middleware
const protection = require("./middleware/JwtMiddleware");
const PORT = 3030;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/refresh", require("./routes/refreshToken"));
app.use("/auth", require("./routes/users"));

// protected routes
app.use("/api", protection, require("./routes/apiRoutes"));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
