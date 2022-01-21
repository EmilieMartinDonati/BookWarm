const router = require("express").Router();
const bookRedModel = require("../models/Bookred.model");
const bookWishlistModel = require("../models/Bookwishlist.model");
const genreModel = require("../models/genre.Model");
const fileUploader = require("./../config/cloudinary");
const Review = require("../models/reviews-model");
const UsercreateModel = require("./../models/User-create-book-model");
const UserModel = require("../models/User.model");





router.get("/personalspace/", async (req, res, next) => {
  try {
    const username = req.session.currentUser.userName;
    console.log("🏓", username);
    const wishlist = await bookWishlistModel.find({
      user: req.session.currentUser._id,
    });
    const red = await bookRedModel
      .find()
      .sort({ date: -1 })
      .limit(5);
    const reviews = await Review.find({
      user: req.session.currentUser._id,
    });
    const createdBooks = await UsercreateModel.find({
      user: req.session.currentUser._id,
    });

    const picture = await UserModel.findById(req.session.currentUser._id, {
      image: 1,
    });
    console.log(picture);
    // const profilePic = await picModel.find({
    //   user: req.session.currentUser._id,
    // });
    // const profilePic = await picModel.findById(req.params.id).populate("User");
    res.render("personal.space.hbs", {
      username,
      wishlist,
      red,
      reviews,
      createdBooks,
      newPic: picture,
    });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/uploadimage",
  fileUploader.single("image"),
  async (req, res, next) => {
    console.log(req.body, "This is reqbody");
    // const updatedPicture = { ...req.body };
    if (!req.file) updatedPicture = undefined;
    else updatedPicture = req.file.path;
    console.log(updatedPicture);
    try {
      const profilePic = await UserModel.findByIdAndUpdate(
        req.session.currentUser._id,
        { image: updatedPicture }
      );
      res.redirect("/personalspace");
      // const wishlist = await bookWishlistModel.find();
      // const red = await bookRedModel.find().sort({ date: -1 }).limit(5);
      // const reviews = await Review.find();
      // const createdBooks = await UsercreateModel.find();
      // const newPic = await picModel.create(updatedPicture);
      // res.render("personal.space.hbs", {
      // //   newPic,
      //   wishlist,
      //   red,
      //   reviews,
      //   createdBooks,
      // });
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
    const createdBooks = await UsercreateModel.find();
    res.render("personalbooks.hbs", { createdBooks });
  } catch (err) {
    next(err);
  }
});
module.exports = router;
