const express = require("express");
const app = require("../app");
const router = express.Router();
const Review = require('../models/reviews-model');
const bookRedModel = require("../models/Bookred.model");

//GET REVIEWS - INDEX/REVIEWS/
/* router.get('/',req,res,next) =>{
} */

//POST REVIEWS NEW/CREATE - /REVIEWS/NEW
router.post("/oneBook/review/:key", async (req, res, next) => {
  const {bookTitle, authorBook, review} = {...req.body};
  key = `/works/${req.params.key}`;
  try {
    await Review.create({bookTitle, authorBook, review, key});
    bookRedModel.findOne({key: key})
    .then((response) => response.populate("reviews"))
    .then (function () {
      bookRedModel.findOne({key: key})
    .then((response) => console.log(response.reviews))});
    // populate("reviews")
    }
  catch (err) {
    next(err)
  }
})


//REVIEW  REVIEWS - CREATE/REVIEWS
router.get('/reviews', (req, res) => {
  res.render('reviews/:id', {});
})

//GET REVIEWS EDIT - /REVIEWS/:ID/EDIT
router.get('/reviews/:id/edit', (req, res) => {
  Review.findById(req.params.id, function (err, review) {
    res.render('reviews-edit', { review: review });
  })
})

//DELETE REVIEWS DESTROY - /REVIEWS/:ID

router.delete("/reviews/:id", function (req, res) {
  console.log("DELETE review");
  Review.findByIdAndRemove(req.params.id)
    .then((review) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err.message);
    });
});


module.exports = router;
