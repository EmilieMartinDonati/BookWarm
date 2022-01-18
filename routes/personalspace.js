const router = require("express").Router();
const bookRedModel = require("../models/Bookred.model");
const bookWishlistModel = require("../models/Bookwishlist.model")
const genreModel = require("../models/genre.Model");
const Review = require('../models/reviews-model');


router.get("/", async (req, res, next) => {
    const wishlist = await bookWishlistModel.find();
    const red = await bookRedModel.find();
    const reviews = await Review.find()
    res.render("personal.space.hbs", {wishlist, red, reviews}
    )
  });


router.post("/:id", async (req, res, next) => {
  const wishlist = await bookWishlistModel.findByIdAndRemove(req.params.id);
  res.redirect("/personalspace");
})



router.post("/delete/:id", async (req, res, next) => {
  await Review.findByIdAndDelete(req.params.id);
  res.redirect("/personalspace");
})

router.post("/edit/:id", async (req, res, next) => {
  await Review.findByIdAndUpdate(req.params.id, req.body, {new: true})
  res.redirect("/personalspace");
})
  module.exports = router;