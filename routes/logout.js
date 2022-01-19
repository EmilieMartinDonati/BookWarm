const express = require('express')
const router = express.Router()

const protectRoute = require("./../middlewares/protectRoute");
const loginstatus = require("./../middlewares/loginstatus")

//GET logout

router.get('/logout', protectRoute, (req, res, next) => {
    req.session.destroy((err) => {
      res.redirect("/login");
    });
  });



module.exports = router