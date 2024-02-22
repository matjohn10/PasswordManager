import { Request, Response } from "express";

const express = require("express");
const cors = require("cors");
const app = express();
require("./db.ts");
app.use(cors());
app.use(express.json());
const PORT = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/auth", require("./routes/users"));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
