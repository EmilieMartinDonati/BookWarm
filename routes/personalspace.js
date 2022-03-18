const router = require("express").Router();
const bookRedModel = require("../models/Bookred.model");
const bookWishlistModel = require("../models/Bookwishlist.model");
const genreModel = require("../models/Genre.model");
const fileUploader = require("./../config/cloudinary");
const Review = require("../models/reviews-model");
const UsercreateModel = require("../models/User-create-book-model");
const UserModel = require("../models/User.model");
// Trying to install them from Github, didn't work.
const helpers = require('handlebars-helpers')(['math', 'comparison', 'string']);



// Display the profile as it does include the profile pic.

router.get("/personalspace/", async (req, res, next) => {
  try {
    const neither = helpers.neither;
    const value = 3;
    const foundUser = await UserModel.findById(req.session.currentUser._id).populate("read").populate({path: "following", options: {limit: 3}}).populate({path: "followers", options: {limit: 3}});
    const following = foundUser.following;
    const followers = foundUser.followers;
    const areFollowing = following.length > 0 ? true : false;
    const areFollowers = followers.length > 0 ? true : false;
    const read = foundUser.read;
    const reviews = await Review.find({
      user: req.session.currentUser._id,
    });
    const createdBooks = await UsercreateModel.find({
      user: req.session.currentUser._id,
    });

    res.render("personal.space.hbs", {
      foundUser,
      following,
      followers,
      read,
      reviews,
      createdBooks,
      value,
      neither,
      areFollowing,
      areFollowers,
    });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/uploadimage",
  fileUploader.single("image"),
  async (req, res, next) => {
    if (!req.file) updatedPicture = undefined;
    else updatedPicture = req.file.path;
    try {
      const profilePic = await UserModel.findByIdAndUpdate(
        req.session.currentUser._id,
        { image: updatedPicture }
      );
      res.redirect("/personalspace");
    } catch (err) {
      next(err);
    }
  }
);

router.post("/personalspace/:id", async (req, res, next) => {
  const wishlist = await bookWishlistModel.findByIdAndRemove(req.params.id);
  res.redirect("/personalspace");
});
router.post("/personalspace/delete/:id", async (req, res, next) => {
  await Review.findByIdAndDelete(req.params.id);
  res.redirect("/personalspace");
});
router.post("/personalspace/edit/:id", async (req, res, next) => {
  await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.redirect("/personalspace");
});

router.get("/oneBook/works/:key", async (req, res, next) => {
  try {
    console.log(":feu:", `/works/${req.params.key}`);
    key = `works/${req.params.key}`;
    const clickedBooks = await bookWishlistModel.findOne({ key: key });
    const clickedBooks2 = await bookRedModel.findOne({ key: key });
    res.render("user-create-book.hbs", { clickedBooks, clickedBooks2 });
  } catch (err) {
    next(err);
  }
});

// CREATED BOOK ROUTE GET 
router.get("/personalbooks", async (req, res, next) => {
  try {
    const createdBooks = await UsercreateModel.find({
      user: req.session.currentUser._id,
    });
    res.render("personalbooks.hbs", { createdBooks });
  } catch (err) {
    next(err);
  }
});
module.exports = router;
