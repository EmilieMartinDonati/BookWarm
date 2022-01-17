const router = require("express").Router();
const bookRedModel = require("../models/Bookred.model");
const bookWishlistModel = require("../models/Bookwishlist.model")
const genreModel = require("../models/genre.Model");

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

const apiKey = axios.create({
  baseURL: `http://openlibrary.org`
})


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


// Le post sur la home page qui permet d'afficher les résultats de la recherche. 

router.post("/", (req, res, next) => {
  const number = Number(req.body.number);
  api
    .get(`${req.body.name}&fields=*,availability&limit=${number}`)
    // .then(response => console.log(`The authors with this name are `, response.data.docs))
    .then((response) => {
      const authorsSearched = [];
      for (let i = 0; i < number; i++) {
        console.log(response.data.docs);
        // Amend the key. 
        response.data.docs[i].key = response.data.docs[i].key.slice(7);
        authorsSearched.push(response.data.docs[i])

      }
      // console.log(typeof (authorsSearched[1].key), authorsSearched[1].key);
      res.render("index", { authorsSearched })
    })
    .catch(error => console.log(error));
})

router.get("/oneBook/:key", (req, res, next) => {
  let number = 1;
  try {
    console.log(req.params.key);
    apiKey
    .get(`/works/${req.params.key}.json`)
      .then((response) => {
        console.log(response.data.title);
        api
        .get(`${response.data.title}&fields=*,availability&limit=${number}`)
        .then ((response) => {
          console.log(response.data.docs);
          response.data.docs[0].key = response.data.docs[0].key.slice(7)
          const titleFound = response.data.docs[0];
          res.render("bookpage.hbs", { titleFound });
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
      console.log(response.data.title);
      api
      .get(`${response.data.title}&fields=*,availability&limit=${number}`)
      .then ((response) => {
        bookWishlistModel.create({
          key: response.data.docs[0].key, 
          title: response.data.docs[0].title,
          first_publish_year: response.data.docs[0].title.first_publish_year,
          publish_year: response.data.docs[0].publish_year,
          number_of_pages_median: response.data.docs[0].number_of_pages_median,
          ISBN: response.data.docs[0].ISBN,
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
        })
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
      .then (async (response) => {
        // await bookRedModel.deleteMany();
        await bookRedModel.create({
          key: response.data.docs[0].key, 
          title: response.data.docs[0].title,
          first_publish_year: response.data.docs[0].title.first_publish_year,
          publish_year: response.data.docs[0].publish_year,
          number_of_pages_median: response.data.docs[0].number_of_pages_median,
          ISBN: response.data.docs[0].ISBN,
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
        })
      })
    
      // res.send("foo");
    })
})


module.exports = router;



