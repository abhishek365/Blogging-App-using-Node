const { Router } = require("express");
const User = require("../models/user");

const router = Router();

router.get("/login", (req, res) => {
  if (req.user) return res.redirect("/");
  res.render("login");
});

router.get("/signup", (req, res) => {
  if (req.user) return res.redirect("/");
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  await User.create({ name, email, password });
  return res.render("login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const token = await User.validateUser(email, password);
  if (!token) {
    res.render("login", { error: "Wrong email or password" });
  }
  res.cookie("token", token).redirect("/");
});

router.get("/logout", async (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
