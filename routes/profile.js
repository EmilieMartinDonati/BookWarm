const express = require('express')
const router = express.Router();
const User = require("../models/User.model");

router.get("/profile/:id", async (req, res, next) => {
    try {
     const {id} = req.params;
     // This is the current user stored in local storage.
     const currentUserId = req.session.currentUser._id;
     const currentUser = await User.findById(currentUserId).populate("following");
     console.log("this is log line 13", currentUser.following);

     let alreadyFollowed = false;

     // This is the user whose profile we visit.
     foundUser = await User.findById(id).populate("wishlist").populate("booksRated").populate("following").populate("followers");

     // I check whether current user already follows this guy.

     console.log("line 20", currentUser)

     currentUser.following.length > 0 ? currentUser.following.forEach((friend) => {
       console.log("log 21", friend._id, foundUser._id);
       if (friend._id.toString() === foundUser._id.toString()) alreadyFollowed = true;
     })
     : console.log("nvm");

     console.log('this is line 26', alreadyFollowed)

     // I find a way to retrieve the books stored in this guy in order to activate the carousel.

     const firstWish = foundUser.wishlist[0];
     const firstRated = foundUser.booksRated[0];
     const otherWishes = foundUser.wishlist.slice(1);
     console.log("line 35", otherWishes);
     const otherRated = foundUser.booksRated.slice(1);
     const followersLength = foundUser.following.length;
     const followingLength = foundUser.followers.length;
     res.render("profile", {foundUser, firstWish, otherWishes, firstRated, otherRated, followersLength, followingLength, alreadyFollowed});
    }
    catch (e) {
        next(e)
    }
})

router.post("/befriend/:id", async (req, res, next) => {
  try {
    const {id} = req.params;
    console.log(id);
    const currentUserId = req.session.currentUser._id;
     const currentUser = await User.findByIdAndUpdate(currentUserId, {
       $push: {following: id}
     }, 
     {new: true});
     res.redirect("/personalspace")
  }
  catch (e) {
    next(e)
  }
})

router.post("/unfriend/:id", async (req, res, next) => {
  try {
    const {id} = req.params;
    console.log(id);
    const currentUserId = req.session.currentUser._id;
     const currentUser = await User.findByIdAndUpdate(currentUserId, {
       $pull: {following: id}
     }, 
     {new: true});
     res.redirect("/personalspace")
  }
  catch (e) {
    next(e)
  }
})

module.exports = router;