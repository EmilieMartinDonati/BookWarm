const express = require("express");
const app = require("../app");
const router = express.Router();
const Review = require('../models/reviews-model');
const bookRedModel = require("../models/Bookred.model");
const UserModel = require("../models/User.model");
const likeModel = require("../models/like.model");
const book = require("../models/book.model");


//POST REVIEWS NEW/CREATE - /REVIEWS/NEW
router.post("/oneBook/works/:key", async (req, res, next) => {
  const { bookTitle, authorBook, review, rating } = { ...req.body };
  const key = `works/${req.params.key}`;
  try {
    const bookOnDisplay = await bookRedModel.updateOne(
      { key: key },
      { rating: rating },
      { new: true }
    );

    await Review.create({ bookTitle, authorBook, review, key, user: req.session.currentUser._id, book: bookOnDisplay._id });
    res.redirect(`/oneBook/works/${req.params.key}`);
  }
  catch (err) {
    next(err)
  }
})


router.post("/oneBook/delete/:id", async (req, res, next) => {
  const { key } = { ...req.body };
  console.log("🏓", key);
  await Review.findByIdAndDelete(req.params.id);
  res.redirect(`/oneBook/${key}`);
})

router.post("/oneBook/edit/:id", async (req, res, next) => {
  try {
    const { key } = { ...req.body };
    // console.log("🏓", key);
    await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect(`/oneBook/${key}`);
  }
  catch (err) {
    next(err)
  }
})

router.post("/oneBook/like/:id", async (req, res, next) => {

  const foundBook = await book.findOne({id: req.params.id}, {key: 1});
  console.log("🏓", foundBook.key.slice(6));
  const key = foundBook.key.slice(6);

  try {

    const review = req.body.review;
    console.log(review);
    await likeModel.create({
      review: review,
    });
    res.redirect(`/oneBook/works/${key}`);
  }
  catch (err) {
    next(err)
  }
})






module.exports = router;
