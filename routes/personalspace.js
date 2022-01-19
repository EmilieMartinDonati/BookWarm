const router = require("express").Router();
const bookRedModel = require("../models/Bookred.model");
const bookWishlistModel = require("../models/Bookwishlist.model")
const genreModel = require("../models/genre.Model");
const fileUploader = require('./../config/cloudinary');
const picModel = require('../models/Pic.model')
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
  
  router.post("/uploadimage", fileUploader.single("image"), async (req, res, next) => {
    const updatedPicture = {...req.body};
    console.log(updatedPicture)
    if (!req.file) updatedPicture.image = undefined;
    else updatedPicture.image = req.file.path;
  
    try {
      const newPic = await picModel.create(updatedPicture);
      res.render("personal.space.hbs",{newPic})
    } catch (err) {
      next(err);
    }
  })

  module.exports = router;
