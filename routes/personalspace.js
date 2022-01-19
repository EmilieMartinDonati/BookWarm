const router = require("express").Router();
const bookRedModel = require("../models/Bookred.model");
const bookWishlistModel = require("../models/Bookwishlist.model")
const genreModel = require("../models/genre.Model");
const Review = require('../models/reviews-model');
const UsercreateModel = require("./../models/User-create-book");


router.get("/personalspace/", async (req, res, next) => {
    const wishlist = await bookWishlistModel.find();
    const red = await bookRedModel.find().sort({ date: -1 }).limit(5);
    const reviews = await Review.find();
    const createdBooks = await UsercreateModel.find();
    console.log("---createdBooks----------------", createdBooks);
    res.render("personal.space.hbs", {wishlist, red, reviews, createdBooks}
    )
  });


router.post("/personalspace/:id", async (req, res, next) => {
  const wishlist = await bookWishlistModel.findByIdAndRemove(req.params.id);
  res.redirect("/personalspace");
})



router.post("/personalspace/delete/:id", async (req, res, next) => {
  await Review.findByIdAndDelete(req.params.id);
  res.redirect("/personalspace");
})

router.post("/personalspace/edit/:id", async (req, res, next) => {
  await Review.findByIdAndUpdate(req.params.id, req.body, {new: true})
  res.redirect("/personalspace");
})


router.get("/oneBook/works/:key", async (req, res, next) => {
  try {
  console.log("🔥", `/works/${req.params.key}`);
  key = `works/${req.params.key}`;
  const clickedBooks = await bookWishlistModel.findOne({key: key});
  const clickedBooks2 = await bookRedModel.findOne({key: key});
  res.render("user-create-book.hbs", {clickedBooks, clickedBooks2})
  }
  catch (err) {
    next(err)
  }
})

  module.exports = router;