const express = require("express");
const app = require("../app");
const router = express.Router();
const Review = require('../models/reviews-model');
const bookRedModel = require("../models/Bookred.model");
const UserModel = require("../models/User.model");

//GET REVIEWS - INDEX/REVIEWS/
/* router.get('/',req,res,next) =>{
} */

//POST REVIEWS NEW/CREATE - /REVIEWS/NEW
router.post("/oneBook/:key", async (req, res, next) => {
  const {bookTitle, authorBook, review} = {...req.body};
  const key = `/works/${req.params.key}`;
  try {
    const bookOnDisplay = await bookRedModel.findOne({key: key});
    await Review.create({bookTitle, authorBook, review, key, user: req.session.currentUser._id, book: bookOnDisplay._id});
    res.redirect(`/oneBook/${req.params.key}`);
    }
  catch (err) {
    next(err)
  }
})


// //REVIEW  REVIEWS - CREATE/REVIEWS
// router.get('/reviews', (req, res) => {
//   res.render('reviews/:id', {});
// })

//GET REVIEWS EDIT - /REVIEWS/:ID/EDIT
// router.get('/oneBook/:key/', (req, res) => {
//   Review.findById(req.params.id, function (err, review) {
//     res.render('reviews-edit', { review: review });
//   })
// })

//DELETE REVIEWS DESTROY - /REVIEWS/:ID

router.use(require("../middlewares/userIdentity"));

router.delete("/oneBook/:key/delete/:id", function (req, res, next) {
  console.log("DELETE review");
  Review.findByIdAndRemove(req.params.id)
    .then((review) => {
      res.redirect(`/oneBook/${req.params.key}`);
    })
    .catch((err) => {
      next(err)
    });
});


module.exports = router;
