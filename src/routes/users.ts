const express = require("express");
const router = express.Router();
const {
  handleLogin,
  handleLogout,
  handleRegister,
} = require("../controllers/userControllers");

router.post("/register", handleRegister);

router.post("/login", handleLogin);

router.post("/logout", handleLogout);

module.exports = router;
