const router = require("express").Router();
const bookRedModel = require("../models/Bookred.model");
const bookWishlistModel = require("../models/Bookwishlist.model")
const genreModel = require("../models/Genre.model");
const Review = require("../models/reviews-model");
const User = require("../models/User.model");
const UsercreateModel = require("../models/User-create-book-model.js");
const fileUploader = require("./../config/cloudinary");
const likeModel = require("../models/like.model");
const book = require("../models/book.model");
// const protectRoute = require("./../middlewares/protectRoute");


// Première API. Le search général. 

const axios = require('axios');
// const { user } = require("pg/lib/defaults");

const api = axios.create({
  baseURL: `https://openlibrary.org/search.json?q=$`
});


// Seconde API à construire. 

const apiTitle = axios.create({
  baseURL: `http://openlibrary.org/search.json?title=`
})

// Troisième API.

const apiGoogle = axios.create({
  baseURL: `https://www.googleapis.com/books/v1/volumes?q=`
})

const apiGoogleSingle = axios.create({
  baseURL: `https://www.googleapis.com/books/v1/volumes/`
})

const apiKey = axios.create({
  baseURL: `http://openlibrary.org`
})

const apiCover = axios.create({
  baseURL: `https://covers.openlibrary.org/b`
})


/* GET home page */
router.get("/", async (req, res, next) => {
  // REVAMP MODELS :
  let categoriesArr = [];
  const categories = await genreModel.find();
  categories.forEach((cat) => {
    categoriesArr.push(cat.subject[0]);
  })

  let uniquifiedCat = [...new Set(categoriesArr)];

  const bestrated = await book.find().sort({ avgRate: -1 }).limit(6);
  res.render("index", { bestrated, uniquifiedCat });
});


// The post that allows to display the results from the search.

router.post("/", async (req, res, next) => {

  try {
    let mode = "discover";
    let categoriesArr = [];
    const categories = await genreModel.find();
    categories.forEach((cat) => {
      categoriesArr.push(cat.subject[0]);
    })
    let uniquifiedCat = [...new Set(categoriesArr)];
    const number = Number(req.body.number);
    console.log("this is log line 69", typeof req.body.name)
    const personalBooks = await UsercreateModel.find({ title: { $in: [req.body.name] } }).limit(number);
    const bestrated = await book.find().sort({ avgRate: 1 }).limit(6);
    const response = await api.get(`${req.body.name}&fields=*,availability&limit=${number}`)
    const authorsSearched = [];
    for (let i = 0; i < number; i++) {
      response.data.docs[i].key = response.data.docs[i].key.slice(7);
      authorsSearched.push(response.data.docs[i]);
    }
    res.render("index", { authorsSearched, personalBooks, bestrated, mode, uniquifiedCat })
  }
  catch (err) {
    next(err)
  }
})

router.post("/categories", async (req, res, next) => {
  try {
    let categoriesArr = [];
    const categories = await genreModel.find();
    categories.forEach((cat) => {
      categoriesArr.push(cat.subject[0]);
    })
    let uniquifiedCat = [...new Set(categoriesArr)];
  const {cat} = req.body;
  console.log(cat);
  let booksArr = [];
  let mode = "categories";
  const foundBooks = await book.find();
  foundBooks.forEach((book) => {
    console.log("line 93", book.subject[0]);
    if (book.subject.includes(cat)) booksArr.push(book);
  })
  const bestrated = await book.find().sort({ avgRate: 1 }).limit(6);
  res.render("index", {booksArr, mode, bestrated, cat, uniquifiedCat});
  }
  catch (err) {
    next(err)
  }
})


// Sur onebook Page.
// This is the page where we display onebook but also the reviews/comments and their likes. 

router.get("/oneBook/works/:key", async (req, res, next) => {
  try {

    // This is an attempt to filter thru what the user already has is their wishlist and their books already red list. Ibidem for the books already rated.
    const currentGuy = req.session.currentUser?._id;
    console.log(" 🏓this is current guy line 124", currentGuy)

    const currentUser = await User.findById(req.session.currentUser?._id).populate("wishlist").populate("read").populate("booksRated");
    console.log(" 🏓this is current user line 124", currentUser);

    // Check whether the wishlist of read includes a book with the key given in the params. If the user already added the book to its wishlist or already read it. 

    let wishArray = [];
    let readArray = [];
    let ratedArray = [];
    let alreadyWished = false;
    let alreadyRead = false;
    let alreadyRated = false;

    if (currentUser !== null) {

      currentUser.wishlist?.forEach((wish) => {
        let keyCompare = wish.key.slice(6)
        if (keyCompare === req.params.key) wishArray.push(wish);
        else console.log("yo")
      })

      currentUser.read?.forEach((el) => {
        //  console.log(el.key, req.params.key)
        let keyCompare = el.key.slice(6)
        if (keyCompare === req.params.key) readArray.push(el);
        else console.log("this is line 150");
      })

      currentUser.booksRated?.forEach((el) => {
        console.log("this is log line 149", el.key, req.params.key)
        let keyCompare = el.key.slice(6)
        if (keyCompare === req.params.key) ratedArray.push(el);
        else console.log("this is line 150");
      })
    }

    if (wishArray.length > 0) {
      alreadyWished = true;
    }

    if (readArray.length > 0) {
      alreadyRead = true;
    }

    if (ratedArray.length > 0) {
      alreadyRated = true;
    }

    let number = 1;
    // Search by key.
    const response = await apiKey.get(`/works/${req.params.key}.json`);
    // Search by title.
    const response2 = await api.get(`${response.data.title}&fields=*,availability&limit=${number}`);
    response2.data.docs[0].key = response2.data.docs[0].key.slice(7)
    const keyForCompare = `works/${response2.data.docs[0].key}`;
    const titleFound = response2.data.docs[0];
    const response3 = await apiGoogle.get(`${response2.data.docs[0].title}${response2.data.docs[0].author_name[0]}&key=AIzaSyAU4_7l55akAv2nS3YqqWvQFN_fPEMfgvk`);
    const response4 = await apiGoogleSingle.get(`${response3?.data?.items[0]?.id}?key=AIzaSyAU4_7l55akAv2nS3YqqWvQFN_fPEMfgvk`);
    let image;
    if (response4.data.volumeInfo.imageLinks) {
      if (response4.data.volumeInfo.imageLinks.medium) image = response4.data.volumeInfo.imageLinks.medium;
      else if (response4.data.volumeInfo.imageLinks.large) image = response4.data.volumeInfo.imageLinks.large;
      else if (response4.data.volumeInfo.imageLinks.small) image = response4.data.volumeInfo.imageLinks.small;
      else { image = `https://www.publishersweekly.com/images/cached/ARTICLE_PHOTO/photo/000/000/073/73607-v1-600x.JPG` }
    }
    else {
      image = `https://www.publishersweekly.com/images/cached/ARTICLE_PHOTO/photo/000/000/073/73607-v1-600x.JPG`;
    }

    // console.log(response4.data.volumeInfo.imageLinks, typeof response4);
    const user = req.session.currentUser ? req.session.currentUser.userName : "Bogus";
    const reviewsOneBook = await Review.find({ key: `works/${req.params.key}` });
    const reviews = await Review.find({ key: `works/${req.params.key}` }).populate("user").populate("likedBy").sort({nbLikes: -1});

    const keyUrl = req.params.key;

    // I am going to fetch the other users that have added this book to their wishlist.

    const foundBook = await book.find({key: `works/${req.params.key}`});

     let otherUsers = [];

    const allUsers = await User.find().populate("wishlist");

  // console.log("this is log line 182", allUsers[0].wishlist)

  if (foundBook.length > 0) {
    allUsers?.forEach(async (user) => {
      await user.wishlist?.forEach(async (wish) => {
        await console.log("this is line 186", wish._id, foundBook?._id, foundBook[0]?._id);
        if (wish._id.toString() === foundBook[0]?._id.toString() || wish._id.toString() === foundBook?._id?.toString()) await otherUsers.push(user);
        else console.log("line 187 couldn't find user who wished for this book");
      })
    })
  }

    

     console.log("this is line 197", otherUsers)


    res.render("bookpage.hbs", { titleFound, keyForCompare, user, reviews, image, alreadyRead, alreadyWished, alreadyRated, currentGuy, keyUrl, otherUsers});
  }
  catch (err) {
    next(err)
  }
})


// The route to add to the wishlist.


router.get("/oneBook/wishlist/:key", async (req, res, next) => {

  try {
    let number = 1;

    const response = await apiKey.get(`/works/${req.params.key}.json`);
    const response2 = await api.get(`${response.data.title}&fields=*,availability&limit=${number}`);
    const response3 = await apiGoogle.get(`${response2.data.docs[0].title}${response2.data.docs[0].author_name[0]}&key=AIzaSyAU4_7l55akAv2nS3YqqWvQFN_fPEMfgvk`);
    const response4 = await apiGoogleSingle.get(`${response3.data.items[0].id}?key=AIzaSyAU4_7l55akAv2nS3YqqWvQFN_fPEMfgvk`);
    let image;
    if (response4.data.volumeInfo.imageLinks) {
      if (response4.data.volumeInfo.imageLinks.medium) image = response4.data.volumeInfo.imageLinks.medium;
      else if (response4.data.volumeInfo.imageLinks.large) image = response4.data.volumeInfo.imageLinks.large;
      else if (response4.data.volumeInfo.imageLinks.small) image = response4.data.volumeInfo.imageLinks.small;
      else { image = `https://www.publishersweekly.com/images/cached/ARTICLE_PHOTO/photo/000/000/073/73607-v1-600x.JPG` };
    }
    else {
      image = `https://www.publishersweekly.com/images/cached/ARTICLE_PHOTO/photo/000/000/073/73607-v1-600x.JPG`
    }

    // I enter the book added to the wishlist into the database.

    const exists = await book.findOne({ key: `works/${req.params.key}` });
    console.log("🐤this is log line 312", exists)

    if (exists) {
      const thebook = await book.findByIdAndUpdate(exists._id, {
        $push: { wishedBy: req.session.currentUser._id }
      },
        { new: true })


      await User.findByIdAndUpdate(req.session.currentUser?._id, {
        $push: { wishlist: thebook._id }
      }, {
        new: true
      })
    }

    else {

      const createdBook = await book.create({
        key: response2.data.docs[0].key.slice(1).toString(),
        title: response2.data.docs[0].title,
        first_publish_year: response2.data.docs[0].title.first_publish_year,
        publish_year: response2.data.docs[0].publish_year,
        number_of_pages_median: response2.data.docs[0].number_of_pages_median,
        isbn: response2.data.docs[0].isbn,
        lccn: response2.data.docs[0].lccn,
        publisher: response2.data.docs[0].publisher,
        author_name: response2.data.docs[0].author_name,
        subject: response2.data.docs[0].subject,
        cover_i: response2.data.docs[0].cover_i,
        first_sentence: response2.data.docs[0].first_sentence,
        author_alternative_name: response2.data.docs[0].author_alternative_name,
        author_key: response2.data.docs[0].author_key,
        author_name: response2.data.docs[0].author_name,
        image: image
      });

      await book.findByIdAndUpdate(createdBook._id, {
        $push: { wishedBy: req.session.currentUser?._id }
      },
        { new: true }
      )

      await genreModel.create({
        subject: response2.data.docs[0].subject
      });

      await User.findByIdAndUpdate(req.session.currentUser?._id, {
        $push: { wishlist: createdBook._id }
      }, {
        new: true
      })
    }


    // I give the book to the given user.

    const currentUser = await User.findById(req.session.currentUser?._id).populate("wishlist")


    const addedBooks = currentUser.wishlist;
    console.log("log line 243 ❤️‍🔥", addedBooks)


    res.render("wishlist.hbs", { addedBooks });
  }
  catch (err) {
    next(err)
  }
})

// REMOVE A BOOK FROM THE WISHLIST. 
// Remove both from the database (no it's not a good idea) and pull out of the user.

router.post("/oneBook/wishlist/:id/delete", async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.session.currentUser?._id, {
      $pull: { wishlist: req.params.id }
    }, {
      new: true
    });
    res.redirect(`/oneBook/wishlist`);
  }
  catch (err) {
    next(err);
  }
})


// This is the route to add a book to those already read by the user.
// The first step is check whether it already exists in the database, in which case, I don't need to create it but only to update it. 


router.get("/oneBook/redlist/:key", async (req, res, next) => {
  try {
    let number = 1;
    const response = await apiKey.get(`/works/${req.params.key}.json`);
    const response2 = await api.get(`${response.data.title}&fields=*,availability&limit=${number}`);
    const response3 = await apiGoogle.get(`${response2.data.docs[0].title}${response2.data.docs[0].author_name[0]}&key=AIzaSyAU4_7l55akAv2nS3YqqWvQFN_fPEMfgvk`);
    const response4 = await apiGoogleSingle.get(`${response3.data.items[0].id}?key=AIzaSyAU4_7l55akAv2nS3YqqWvQFN_fPEMfgvk`);
    let image;
    // console.log("🐤", response4.data.volumeInfo);
    if (response4.data.volumeInfo.imageLinks) {
      if (response4.data.volumeInfo.imageLinks.medium) image = response4.data.volumeInfo.imageLinks.medium;
      else if (response4.data.volumeInfo.imageLinks.large) image = response4.data.volumeInfo.imageLinks.large;
      else if (response4.data.volumeInfo.imageLinks.small) image = response4.data.volumeInfo.imageLinks.small;
    }


    const exists = await book.findOne({ key: `works/${req.params.key}` });
    console.log("🐤this is log line 312", exists)

    if (exists) {
      const thebook = await book.findByIdAndUpdate(exists._id, {
        $push: { readBy: req.session.currentUser._id }
      },
        { new: true })


      await User.findByIdAndUpdate(req.session.currentUser?._id, {
        $push: { read: thebook._id }
      }, {
        new: true
      })
    }

    else {
      const createdBook = await book.create({
        key: response2.data.docs[0].key.slice(1).toString(),
        title: response2.data.docs[0].title,
        first_publish_year: response2.data.docs[0].title.first_publish_year,
        publish_year: response2.data.docs[0].publish_year,
        number_of_pages_median: response2.data.docs[0].number_of_pages_median,
        isbn: response2.data.docs[0].isbn,
        lccn: response2.data.docs[0].lccn,
        publisher: response2.data.docs[0].publisher,
        author_name: response2.data.docs[0].author_name,
        subject: response2.data.docs[0].subject,
        cover_i: response2.data.docs[0].cover_i,
        first_sentence: response2.data.docs[0].first_sentence,
        author_alternative_name: response2.data.docs[0].author_alternative_name,
        author_key: response2.data.docs[0].author_key,
        author_name: response2.data.docs[0].author_name,
        image: image
      });

      await book.findByIdAndUpdate(createdBook._id, {
        $push: { readBy: req.session.currentUser?._id },
      }, { new: true })


      genreModel.create({
        subject: response2.data.docs[0].subject
      });


      await User.findByIdAndUpdate(req.session.currentUser?._id, {
        $push: { read: createdBook._id }
      }, {
        new: true
      })
    }


    res.redirect("/personalspace");

  }
  catch (err) {
    next(err)
  }

})


// THE RATINGS.

router.post("/oneBook/rate/:key", async (req, res, next) => {
  try {

    const { rating } = req.body;
    console.log(typeof rating);

    const exists = await book.findOne({ key: `works/${req.params.key}` });
    console.log("🐤this is log line 312", exists)

    if (exists) {
      const thebook = await book.findByIdAndUpdate(exists._id, {
        $inc: { nbRates: 1, totalRate: Number(rating) },
      },
        { new: true });

      console.log(typeof thebook.avgRate);

      const avg = thebook.totalRate / thebook.nbRates;
      console.log("🐤", avg);

      const thebook2 = await book.findByIdAndUpdate(thebook._id, {
        avgRate: avg
      }, { new: true })


      await User.findByIdAndUpdate(req.session.currentUser?._id, {
        $push: { booksRated: thebook2._id }
      }, {
        new: true
      })
    }

    else {
      let number = 1;
      const response = await apiKey.get(`/works/${req.params.key}.json`);
      const response2 = await api.get(`${response.data.title}&fields=*,availability&limit=${number}`);
      const response3 = await apiGoogle.get(`${response2.data.docs[0].title}${response2.data.docs[0].author_name[0]}&key=AIzaSyAU4_7l55akAv2nS3YqqWvQFN_fPEMfgvk`);
      const response4 = await apiGoogleSingle.get(`${response3.data.items[0].id}?key=AIzaSyAU4_7l55akAv2nS3YqqWvQFN_fPEMfgvk`);
      let image;
      // console.log("🐤", response4.data.volumeInfo);
      if (response4.data.volumeInfo.imageLinks) {
        if (response4.data.volumeInfo.imageLinks.medium) image = response4.data.volumeInfo.imageLinks.medium;
        else if (response4.data.volumeInfo.imageLinks.large) image = response4.data.volumeInfo.imageLinks.large;
        else if (response4.data.volumeInfo.imageLinks.small) image = response4.data.volumeInfo.imageLinks.small;
      }

      const createdBook = await book.create({
        key: response2.data.docs[0].key.slice(1).toString(),
        title: response2.data.docs[0].title,
        first_publish_year: response2.data.docs[0].title.first_publish_year,
        publish_year: response2.data.docs[0].publish_year,
        number_of_pages_median: response2.data.docs[0].number_of_pages_median,
        isbn: response2.data.docs[0].isbn,
        lccn: response2.data.docs[0].lccn,
        publisher: response2.data.docs[0].publisher,
        author_name: response2.data.docs[0].author_name,
        subject: response2.data.docs[0].subject,
        cover_i: response2.data.docs[0].cover_i,
        first_sentence: response2.data.docs[0].first_sentence,
        author_alternative_name: response2.data.docs[0].author_alternative_name,
        author_key: response2.data.docs[0].author_key,
        author_name: response2.data.docs[0].author_name,
        image: image,
        totalRate: rating,
        nbRates: 1,
        avgRate: rating
      });

      await User.findByIdAndUpdate(req.session.currentUser?._id, {
        $push: { booksRated: createdBook._id }
      }, {
        new: true
      })
    }
    res.redirect(`/oneBook/works/${req.params.key}`)
  }
  catch (err) {
    next(err)
  }
})

// GET - CREATE A BOOK 

router.get("/", async (req, res, next) => {
  const newBook = await bookRedModel.find()
    .then((newbook) => {
      res.render("/createdBooks", { newBook });
    })

});

//POST- CREATE A BOOK 

router.post("/createdBooks", fileUploader.single("picture"), async (req, res, next) => {
  const { title, author_name, description } = { ...req.body };

  if (!req.file) cover = undefined;
  else cover = req.file.path;

  try {
    await UsercreateModel.create({
      author_name: author_name,
      description: description,
      title: title,
      picture: cover,
      user: req.session.currentUser._id,
    }
    );
    const createdBooks = await UsercreateModel.find(
      {
        user: req.session.currentUser._id,

      }
    );
    res.render("personalbooks.hbs", { createdBooks });
  } catch (err) {
    next(err);
  }
});


// This is the route to display the wishlist.

router.get("/oneBook/wishlist", async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.session.currentUser?._id
    ).populate("wishlist")
    const addedBooks = currentUser.wishlist;
    res.render("wishlist.hbs", { addedBooks });
  }
  catch (err) {
    next(err)
  }
})



module.exports = router;



