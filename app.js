// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db/index");


// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();
const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "views/partials")); 

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const projectName = "test-API";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

// app.locals.title = `${capitalized(projectName)} created with IronLauncher`;

//INITIALIZE BODY-PARSER 
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const personalspace = require("./routes/personalspace")
app.use("/personalspace", personalspace);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);


//API

//Retrieving data by author.

//REVIEWS 
app.get('/',(req,res) => {
    res.render('index',{ reviews:reviews});
})


// Retrieving data by subject. 


module.exports = app;
