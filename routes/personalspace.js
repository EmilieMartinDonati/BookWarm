const router = require("express").Router();
const bookRedModel = require("../models/Bookred.model");
const bookWishlistModel = require("../models/Bookwishlist.model")
const genreModel = require("../models/genre.Model");
const fileUploader = require('./../config/cloudinary');
const picModel = require('../models/Pic.model')

router.get("/", async (req, res, next) => {
    const wishlist = await bookWishlistModel.find();
    const red = await bookRedModel.find();
    res.render("personal.space.hbs", {wishlist, red}
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



  



  module.exports = router;