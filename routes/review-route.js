const express = require("express");
const app = require("../app");
const router = express.Router();
const Review = require('../models/reviews-model')

//GET REVIEWS - INDEX/REVIEWS/
/* router.get('/',req,res,next) =>{
} */

//POST REVIEWS NEW/CREATE - /REVIEWS/NEW
router.post("/bookpage", (req, res) => {
    Review.create(req.body)
    .then((review) => {
      console.log(review);
      res.redirect("/");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });


//REVIEW  REVIEWS - CREATE/REVIEWS
router.get('/reviews', (req, res) => {
    res.render('reviews/:id', {});
  })

//GET REVIEWS EDIT - /REVIEWS/:ID/EDIT
router.get('/reviews/:id/edit', (req, res) => {
    Review.findById(req.params.id, function(err, review) {
      res.render('reviews-edit', {review: review});
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
