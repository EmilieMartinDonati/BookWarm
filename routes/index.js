const router = require("express").Router();
const bookRedModel = require("../models/Bookred.model");
const bookWishlistModel = require("../models/Bookwishlist.model")
const genreModel = require("../models/genre.Model");
const Review = require("../models/reviews-model");
const User = require("../models/User.model");
const UsercreateModel = require("./../models/User-create-book");
const fileUploader = require("./../config/cloudinary");
const protectRoute = require("./../middlewares/protectRoute");


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
  res.render("index", {booksRead});
});


// Le post sur la home page qui permet d'afficher les résultats de la recherche. 

router.post("/", async (req, res, next) => {

  const personalBooks = await UsercreateModel.find({ title: req.body.name });
  // console.log("🌈", personalBooks);
  const booksRead = await bookRedModel.find().sort({ rating: -1 }).limit(6);
  console.log(booksRead);

  const number = Number(req.body.number);
  api
    .get(`${req.body.name}&fields=*,availability&limit=${number}`)
    // .then(response => console.log(`The authors with this name are `, response.data.docs))
    .then((response) => {
      const authorsSearched = [];
      for (let i = 0; i < number; i++) {
        // console.log(response.data.docs);
        // Amend the key. 
        response.data.docs[i].key = response.data.docs[i].key.slice(7);
        authorsSearched.push(response.data.docs[i])

      }
      // console.log(typeof (authorsSearched[1].key), authorsSearched[1].key);
      res.render("index", { authorsSearched, personalBooks, booksRead})
    })
    .catch(error => console.log(error));
})


// Sur onebook Page


router.get("/oneBook/works/:key", async (req, res, next) => {
  try {
    const booksRead = await bookRedModel.findOne({ key: `/works/${req.params.key}` });
    // console.log("🌈", booksRead);
    if (booksRead) booksRead.otherKey = booksRead.key.slice(7).toString();
    let number = 1;
    console.log("🌈", req.params.key);
    apiKey
      .get(`/works/${req.params.key}.json`)
      .then((response) => {
        // console.log(response.data.title);
        api
          .get(`${response.data.title}&fields=*,availability&limit=${number}`)
          .then(async (response) => {
            // console.log("🌈",response.data.docs);
            response.data.docs[0].key = response.data.docs[0].key.slice(7)
            const titleFound = response.data.docs[0];
            const user = req.session.currentUser.username;
            console.log("🐤", user);
            // const reviewsOneBook = await Review.find({ key: `/works/${req.params.key}` });
            // const reviewWriter = reviewsOneBook[0].user._id;
            // console.log("💣", reviewWriter);
            res.render("bookpage.hbs", { titleFound, user, reviews: await Review.find({ key: `/works/${req.params.key}` }).populate("user"), booksRead });
          })

        // res.send("foo");
      })
  }
  catch (err) {
    next(err)
  }
})

router.get("/oneBook/wishlist/:key", async (req, res, next) => {
  let number = 1;
  apiKey
    .get(`/works/${req.params.key}.json`)
    .then((response) => {
      // console.log(response.data.title);
      api
        .get(`${response.data.title}&fields=*,availability&limit=${number}`)
        .then(async (response) => {
          const lccnFixed = JSON.parse(response.data.docs[0].lccn[0]);
          console.log("❤️‍🔥", lccnFixed, typeof lccnFixed);
          // const cover = await apiCover.get(`/lccn/${lccnFixed}-M.jpg?default=false`);
          console.log("🌈", response.data.docs[0].key);

          await bookWishlistModel.create({
            key: response.data.docs[0].key.slice(1).toString(),
            title: response.data.docs[0].title,
            first_publish_year: response.data.docs[0].title.first_publish_year,
            publish_year: response.data.docs[0].publish_year,
            number_of_pages_median: response.data.docs[0].number_of_pages_median,
            isbn: response.data.docs[0].isbn,
            lccn: response.data.docs[0].lccn,
            publisher: response.data.docs[0].publisher,
            author_name: response.data.docs[0].author_name,
            subject: response.data.docs[0].subject,
            cover_i: response.data.docs[0].cover_i,
            first_sentence: response.data.docs[0].first_sentence,
            author_alternative_name: response.data.docs[0].author_alternative_name,
            author_key: response.data.docs[0].author_key,
            author_name: response.data.docs[0].author_name
          });
          genreModel.create({
            subject: response.data.docs[0].subject
          });
          res.redirect("/personalspace");
        })
    })
})



router.get("/oneBook/redlist/:key", async (req, res, next) => {
  let number = 1;
  apiKey
    .get(`/works/${req.params.key}.json`)
    .then((response) => {
      console.log(response.data.title);
      api
        .get(`${response.data.title}&fields=*,availability&limit=${number}`)
        .then(async (response) => {
          // apiGoogle
          //   .get(`${response.data.docs[0].title}${response.data.docs[0].author_name}&key=AIzaSyAU4_7l55akAv2nS3YqqWvQFN_fPEMfgvk`)
          //   .then((response) => {
          //     const description = response.data.items[0].volumeInfo.description;
          //   })
          await bookRedModel.create({
            key: response.data.docs[0].key,
            title: response.data.docs[0].title,
            first_publish_year: response.data.docs[0].title.first_publish_year,
            publish_year: response.data.docs[0].publish_year,
            number_of_pages_median: response.data.docs[0].number_of_pages_median,
            isbn: response.data.docs[0].isbn,
            lccn: response.data.docs[0].lccn,
            publisher: response.data.docs[0].publisher,
            author_name: response.data.docs[0].author_name,
            subject: response.data.docs[0].subject,
            cover_i: response.data.docs[0].cover_i,
            first_sentence: response.data.docs[0].first_sentence,
            author_alternative_name: response.data.docs[0].author_alternative_name,
            author_key: response.data.docs[0].author_key,
            author_name: response.data.docs[0].author_name,
            date: new Date(),
          });
          genreModel.create({
            subject: response.data.docs[0].subject
          });
          res.redirect("/personalspace");
        })

      // res.send("foo");
    })
})

// GET - CREATE A BOOK 

router.get("/",protectRoute, async (req, res, next) => {
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
    const wishlist = await bookWishlistModel.find();
    const red = await bookRedModel.find();
    const reviews = await Review.find();
    const createdBooks = await UsercreateModel.find();
    res.render("personal.space.hbs", {wishlist, red, reviews, createdBooks});
  } catch (err) {
    next(err);
  }
});

module.exports = router;



