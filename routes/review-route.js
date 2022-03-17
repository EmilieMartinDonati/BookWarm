const express = require("express");
const app = require("../app");
const router = express.Router();
const Review = require('../models/reviews-model');
const UserModel = require("../models/User.model");
const likeModel = require("../models/like.model");
const book = require("../models/book.model");


//POST REVIEWS NEW/CREATE - /REVIEWS/NEW
router.post("/oneBook/works/:key", async (req, res, next) => {
  const { bookTitle, authorBook, review} = { ...req.body };
  const key = `works/${req.params.key}`;
  try {
    const bookOnDisplay = await book.findOne(
      { key: key }
    );

    await Review.create({ bookTitle, authorBook, review, key, user: req.session.currentUser._id, book: bookOnDisplay?._id });
    res.redirect(`/oneBook/works/${req.params.key}`);
  }
  catch (err) {
    next(err)
  }
})


router.post("/oneBook/delete/:id", async (req, res, next) => {
  const { key } = { ...req.body };
  await Review.findByIdAndDelete(req.params.id);
  res.redirect(`/oneBook/${key}`);
})

router.post("/oneBook/edit/:id", async (req, res, next) => {
  try {
    const { key } = { ...req.body };
    await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect(`/oneBook/${key}`);
  }
  catch (err) {
    next(err)
  }
})

router.post("/oneBook/like/:keyUrl", async (req, res, next) => {

  try {
  const currentUser = req.session.currentUser._id;
  const {reviewId} = req.body;
  console.log("🏓 line 53", reviewId);
  const foundReview = await Review.findByIdAndUpdate(reviewId, {
          $inc: {nbLikes: 1},
          $push: {likedBy: currentUser}
  }, {new: true})
  res.redirect(`/oneBook/works/${req.params.keyUrl}`);
  }
  catch (err) {
    next(err)
  }
})






module.exports = router;
