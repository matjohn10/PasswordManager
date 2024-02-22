const mongoose = require("mongoose");
require("dotenv").config();
console.log(process.env.MONGO_URL);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error: Error) => {
    console.error("Error connecting to MongoDB:", error);
  });
