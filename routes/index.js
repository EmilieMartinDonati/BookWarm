const router = require("express").Router();

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

router.get("/oneBook/:key", async (req, res, next) => {
// Ajouter aux favoris. 
// Ajouter à la wishlist. 
// Est-ce qu'on change de pages ? 
// Modal qui s'affiche à ce moment-là.
})


module.exports = router;



