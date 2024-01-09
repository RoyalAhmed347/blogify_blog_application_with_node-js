const { Router } = require("express");
const hbs = require("hbs");
const mongoose = require("mongoose");
const USER = require("../models/user");
const multer = require("multer");
const { createToken } = require("../../services/auth");

const router = Router();

router
  .route("/singin")
  .get((req, res) => {
    res.render("singin");
  })
  .post(async (req, res) => {
    const { email, password } = req.body;
    try {
      const token = await USER.matchPassword(email, password);

      res.cookie("loginToken", token).redirect("/");
    } catch (error) {
      res.render("singin", {
        error: "Incorrect email or password",
      });
    }
  });
router
  .route("/singup")
  .get((req, res) => {
    res.render("singup");
  })
  .post(async (req, res) => {
    const { fullName, email, password } = req.body;
    const userCreated = await USER.create({
      fullName,
      email,
      password,
    });
    const token = createToken(userCreated);
    res.cookie("loginToken", token).redirect("/");

    res.redirect("/");
  });
router.route("/logout").get((req, res) => {
  res.clearCookie("loginToken").redirect("/");
});

router.route("/userProfile").get(async (req, res) => {
  const user = await USER.findOne({ _id: req.user._id });
  res.render("userProfile", {
    user,
  });
});

module.exports = router;
