const router = require("express").Router();
const bookRedModel = require("../models/Bookred.model");
const bookWishlistModel = require("../models/Bookwishlist.model")
const genreModel = require("../models/genre.Model");
const fileUploader = require('./../config/cloudinary');
const picModel = require('../models/Pic.model')
const Review = require('../models/reviews-model');
const UsercreateModel = require("./../models/User-create-book-model");

router.get("/personalspace/", async (req, res, next) => {
    const wishlist = await bookWishlistModel.find();
    const red = await bookRedModel.find().sort({ date: -1 }).limit(5);
    const reviews = await Review.find();
    const createdBooks = await UsercreateModel.find();
    console.log("---createdBooks----------------", createdBooks);
    res.render("personal.space.hbs", {wishlist, red, reviews, createdBooks}
    )
  });
  router.post("/uploadimage", fileUploader.single("image"), async (req, res, next) => {
    const updatedPicture = { ...req.body };
    if (!req.file) updatedPicture.image = undefined;
    else updatedPicture.image = req.file.path;
    try {
      const newPic = await picModel.create(updatedPicture);
      res.render("personal.space",{newPic})
    } catch (err) {
      next(err);
    }
  })
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
  console.log(":feu:", `/works/${req.params.key}`);
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















