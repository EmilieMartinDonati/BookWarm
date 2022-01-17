const router = require("express").Router();
const bookRedModel = require("../models/Bookred.model");
const bookWishlistModel = require("../models/Bookwishlist.model")
const genreModel = require("../models/genre.Model");


router.get("/", async (req, res, next) => {
    const wishlist = await bookWishlistModel.find();
    const red = await bookRedModel.find();
    res.render("personal.space.hbs", {wishlist, red}
    )
  });


  module.exports = router;