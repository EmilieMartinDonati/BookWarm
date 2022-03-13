const express = require("express");
const router = express.Router();
const User = require("./../models/User.model");

const bcrypt = require("bcrypt");

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter username and password.",
    });
    return;
  }

  User.findOne({ userName: username })
    .then((user) => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "This username doesn't exist.",
        });
        return;
      }

      const rightPassword = bcrypt.compareSync(password, user.password);
      // console.log(username, user)

      if (rightPassword) {
        req.session.currentUser = user;
        res.redirect("/");
      } 
      else res.render("auth/login", { errorMessage: "Incorrect password" });
    })
    .catch((error) => next(error));
});

module.exports = router;
