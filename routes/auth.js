const express = require("express");
const router = express.Router();
const User = require("./../models/User.model");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const zxcvbn = require("zxcvbn");

//GET signup route

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

//POST signup route

router.post("/signup", (req, res, next) => {
  const { username: userName, password } = req.body;
  console.log(userName, password);
  if (userName === "" || password === "") {
    res.redirect("auth/signup", {
      errorMessage: "Please enter a username and a password",
    });
  }
  else {
    User.findOne({ userName })
      .then((user) => {
        console.log(">>",user);
        if (user !== null) {
          res.redirect("/auth/signup", {
            errorMessage: "This username already exists",
          });
        }
        
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        User.create({ userName, password: hashedPassword })
          .then(() => res.redirect("/login"))
          .catch((err) =>
            res.render("auth/signup", {
              errorMessage: "Error while trying to create a new user",
            })
          );
      })
      .catch((err) => next(err));
  }
});

module.exports = router;
