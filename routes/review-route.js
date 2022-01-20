const express = require("express");
const app = require("../app");
const router = express.Router();
const Review = require('../models/reviews-model');
const bookRedModel = require("../models/Bookred.model");
const UserModel = require("../models/User.model");


//POST REVIEWS NEW/CREATE - /REVIEWS/NEW
router.post("/oneBook/works/:key", async (req, res, next) => {
  // console.log("🔥", req.params.key)
  const { bookTitle, authorBook, review, rating } = { ...req.body };
  const key = `works/${req.params.key}`;
  try {
    const bookOnDisplay = await bookRedModel.updateOne(
      {key: key },
      {rating: rating },
      {new: true}
    );

    await Review.create({ bookTitle, authorBook, review, key, user: req.session.currentUser._id, book: bookOnDisplay._id });
    res.redirect(`/oneBook/works/${req.params.key}`);
    // res.send("foo");
  }
  catch (err) {
    next(err)
  }
})




router.post("/oneBook/delete/:id", async (req, res, next) => {
  const {key} = {...req.body};
  console.log("🏓", key);
  await Review.findByIdAndDelete(req.params.id);
  // const key = await Review.find({id: req.params.id}, 'key');
//   console.log("🏓", key, typeof key);
//  const keyAmended = key[0].key.slice(6).toString();
//   console.log("🏓", keyAmended);
  res.redirect(`/oneBook/${key}`);
})

router.post("/oneBook/edit/:id", async (req, res, next) => {
  try {
    const {key} = {...req.body};
     console.log("🏓", key);
    await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect(`/oneBook/${key}`);
  }
  catch (err) {
    next(err)
  }
})

router.post("/oneBook//like/:id", async (req, res, next) => {
  try {
    await Review.findByIdAndRemove(req.params.id);
    res.redirect(`/oneBook/${req.params.titleFound.key}`);
  }
  catch (err) {
    next(err)
  }
})






module.exports = router;
