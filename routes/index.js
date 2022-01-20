const router = require("express").Router();
const bookRedModel = require("../models/Bookred.model");
const bookWishlistModel = require("../models/Bookwishlist.model")
const genreModel = require("../models/genre.Model");
const Review = require("../models/reviews-model");
const User = require("../models/User.model");
const UsercreateModel = require("../models/User-create-book-model.js");
const fileUploader = require("./../config/cloudinary");
const likeModel = require("./../models/like.model")
// const protectRoute = require("./../middlewares/protectRoute");


// Première API. Le search général. 

const axios = require('axios');

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
  const booksRead = await bookRedModel.find().sort({ rating: -1 }).limit(3);
  console.log(booksRead);
  res.render("index", { booksRead });
});


// Le post sur la home page qui permet d'afficher les résultats de la recherche. 

router.post("/", async (req, res, next) => {
  const personalBooks = await UsercreateModel.find({ title: req.body.name });
  const booksRead = await bookRedModel.find().sort({ rating: -1 }).limit(6);
  console.log(booksRead);
  const number = Number(req.body.number);
  const response = await api.get(`${req.body.name}&fields=*,availability&limit=${number}`)
  const authorsSearched = [];
  for (let i = 0; i < number; i++) {
    response.data.docs[i].key = response.data.docs[i].key.slice(7);
    authorsSearched.push(response.data.docs[i]);
  }
  res.render("index", { authorsSearched, personalBooks, booksRead })
})


// Sur onebook Page

router.get("/oneBook/works/:key", async (req, res, next) => {
  try {
    const booksRead = await bookRedModel.findOne({ key: `works/${req.params.key}` });
    if (booksRead) booksRead.otherKey = booksRead.key.slice(7).toString();
    const booksWished = await bookWishlistModel.findOne({ key: `works/${req.params.key}` });
    let number = 1;

    const response = await apiKey.get(`/works/${req.params.key}.json`);
    const response2 = await api.get(`${response.data.title}&fields=*,availability&limit=${number}`);
    response2.data.docs[0].key = response2.data.docs[0].key.slice(7)
    console.log("🏓", response2.data.docs[0].key);
    const keyForCompare = `works/${response2.data.docs[0].key}`;
    const titleFound = response2.data.docs[0];
    const response3 = await apiGoogle.get(`${response2.data.docs[0].title}${response2.data.docs[0].author_name[0]}&key=AIzaSyAU4_7l55akAv2nS3YqqWvQFN_fPEMfgvk`);
    const response4 = await apiGoogleSingle.get(`${response3.data.items[0].id}?key=AIzaSyAU4_7l55akAv2nS3YqqWvQFN_fPEMfgvk`);
    let image;
    if (response4.data.volumeInfo.imageLinks) {
      if (response4.data.volumeInfo.imageLinks.medium) image = response4.data.volumeInfo.imageLinks.medium;
      else if (response4.data.volumeInfo.imageLinks.large) image = response4.data.volumeInfo.imageLinks.large;
      else if (response4.data.volumeInfo.imageLinks.small) image = response4.data.volumeInfo.imageLinks.small;
      else { image = `https://www.publishersweekly.com/images/cached/ARTICLE_PHOTO/photo/000/000/073/73607-v1-600x.JPG` }
    }
    else {
      image = `https://www.publishersweekly.com/images/cached/ARTICLE_PHOTO/photo/000/000/073/73607-v1-600x.JPG`
    }
    const user = req.session.currentUser ? req.session.currentUser.username : "Bogus";
    const reviewsOneBook = await Review.find({ key: `works/${req.params.key}` });
    // const reviewWriter = reviewsOneBook[0].user._id;
    res.render("bookpage.hbs", { titleFound, keyForCompare, booksWished, user, reviews: await Review.find({ key: `works/${req.params.key}` }).populate("user"), booksRead, image });
  }
  catch (err) {
    next(err)
  }
})

router.get("/oneBook/wishlist/:key", async (req, res, next) => {
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


  await bookWishlistModel.create({
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
  });
  await genreModel.create({
    subject: response2.data.docs[0].subject
  });
  const addedBooks = await bookWishlistModel.find();
  res.render("wishlist.hbs", { addedBooks });
})

router.post("/oneBook/wishlist/:id/delete", async (req, res, next) => {
  try {
    await bookWishlistModel.findByIdAndDelete(req.params.id);
    res.redirect(`/oneBook/wishlist`);
  }
  catch (err) {
    next(err);
  }
})

// apiKey
//   .get(`/works/${req.params.key}.json`)
//   .then((response) => {
//     // console.log(response.data.title);
//     api
//       .get(`${response.data.title}&fields=*,availability&limit=${number}`)
//       .then(async (response) => {
//         const lccnFixed = JSON.parse(response.data.docs[0].lccn[0]);
//         console.log("❤️‍🔥", lccnFixed, typeof lccnFixed);
//         // const cover = await apiCover.get(`/lccn/${lccnFixed}-M.jpg?default=false`);
//         console.log("🌈", response.data.docs[0].key);

//         await bookWishlistModel.create({
//           key: response.data.docs[0].key.slice(1).toString(),
//           title: response.data.docs[0].title,
//           first_publish_year: response.data.docs[0].title.first_publish_year,
//           publish_year: response.data.docs[0].publish_year,
//           number_of_pages_median: response.data.docs[0].number_of_pages_median,
//           isbn: response.data.docs[0].isbn,
//           lccn: response.data.docs[0].lccn,
//           publisher: response.data.docs[0].publisher,
//           author_name: response.data.docs[0].author_name,
//           subject: response.data.docs[0].subject,
//           cover_i: response.data.docs[0].cover_i,
//           first_sentence: response.data.docs[0].first_sentence,
//           author_alternative_name: response.data.docs[0].author_alternative_name,
//           author_key: response.data.docs[0].author_key,
//           author_name: response.data.docs[0].author_name
//         });
//         genreModel.create({
//           subject: response.data.docs[0].subject
//         });
//         res.redirect("/personalspace");
//       })
//   })




router.get("/oneBook/redlist/:key", async (req, res, next) => {
  // let number = 1;
  // apiKey
  //   .get(`/works/${req.params.key}.json`)
  //   .then((response) => {
  //     console.log(response.data.title);
  //     api
  //       .get(`${response.data.title}&fields=*,availability&limit=${number}`)
  //       .then(async (response) => {
  //         // apiGoogle
  //         //   .get(`${response.data.docs[0].title}${response.data.docs[0].author_name}&key=AIzaSyAU4_7l55akAv2nS3YqqWvQFN_fPEMfgvk`)
  //         //   .then((response) => {
  //         //     const description = response.data.items[0].volumeInfo.description;
  //         //   })
  //         await bookRedModel.create({
  //           key: response.data.docs[0].key,
  //           title: response.data.docs[0].title,
  //           first_publish_year: response.data.docs[0].title.first_publish_year,
  //           publish_year: response.data.docs[0].publish_year,
  //           number_of_pages_median: response.data.docs[0].number_of_pages_median,
  //           isbn: response.data.docs[0].isbn,
  //           lccn: response.data.docs[0].lccn,
  //           publisher: response.data.docs[0].publisher,
  //           author_name: response.data.docs[0].author_name,
  //           subject: response.data.docs[0].subject,
  //           cover_i: response.data.docs[0].cover_i,
  //           first_sentence: response.data.docs[0].first_sentence,
  //           author_alternative_name: response.data.docs[0].author_alternative_name,
  //           author_key: response.data.docs[0].author_key,
  //           author_name: response.data.docs[0].author_name,
  //           date: new Date(),
  //         });
  //         genreModel.create({
  //           subject: response.data.docs[0].subject
  //         });
  //         res.redirect("/personalspace");
  //       })

  //     // res.send("foo");
  //   })

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




  await bookRedModel.create({
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
  });
  genreModel.create({
    subject: response2.data.docs[0].subject
  });
  res.redirect("/personalspace");

})

// GET - CREATE A BOOK 

router.get("/", async (req, res, next) => {
  const newBook = await bookRedModel.find()
    .then((newbook) => {
      res.render("/createdBooks", { newBook });
    })
    .catch(err);
});

//POST- CREATE A BOOK 

router.post("/createdBooks", fileUploader.single("picture"), async (req, res, next) => {
  const newBook = { ...req.body };

  if (!req.file) newBook.cover = undefined;
  else newBook.picture = req.file.path;

  try {
    await UsercreateModel.create(newBook);
    const createdBooks = await UsercreateModel.find();
    res.render("personalbooks.hbs", { createdBooks });
  } catch (err) {
    next(err);
  }
});

router.get("/oneBook/wishlist", async (req, res, next) => {
  try {
    const addedBooks = await bookWishlistModel.find();
    res.render("wishlist.hbs", { addedBooks });
  }
  catch (err) {
    next(err)
  }
})



//ROUTE POUR LES LIKES 

/* router.get("/", async (req, res, next) => {
  try {
    res.redirect("/oneBook/works/:key", {
      likes: await likeModel.find().populate("reviews User"),
    });
  } catch (err) {
    next(err);
  }
}); 

router.post('/oneBook/works/:key', (req, res, next) => {
  const action = {...req.body}
  const counter = action === 'Like' ? 1 : -1;
  likeModel.updateOne({_id: req.params.id}, {$inc: {type: counter}}, {}, (err, numberAffected) => {
 

      let payload = { action: action, postId: req.params.id };
     pusher.trigger('post-events', 'postAction', payload, req.body.socketId);

      res.send('/oneBook/works/:key');  */ 
 
module.exports = router;



