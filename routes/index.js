const router = require("express").Router();

// Première API. Le search général. 

const axios = require('axios');

const api = axios.create({
    baseURL: `https://openlibrary.org/search.json?q=$`
  });


// Seconde API à construire. 


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
  for (let i = 0 ; i < number ; i++) {
  // Amend the key. 
  authorsSearched.push(response.data.docs[i])

  }
  console.log(typeof(authorsSearched[1].key), authorsSearched[1].key);
  res.render("index", {authorsSearched})
})
.catch(error => console.log(error));
})

router.get("/oneBook/:key", (req, res, next) => {
  console.log(req.params.key);
  res.render("foo");

})


module.exports = router;



