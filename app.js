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

//Express-session is used to handle sessions, connect-mongo is to store the data sessions inside the database
//It has to be placed before the routes

const session = require("express-session");
const MongoStore = require("connect-mongo")


//use session
app.use(
    session({
        secret: 'story book',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: 'mongodb://127.0.0.1/test-API'
        })
    })
);

  

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

//Link with auth.js
const auth = require("./routes/auth")
//make the app use auth.js
app.use("/", auth)

const login = require("./routes/login")
app.use("/", login)

const logout = require("./routes/logout")
app.use("/", logout)


// app.use(require("./middlewares/loginstatus"));

// app.use(function (req, res, next) {
//     res.locals.session = req.session;
//     next();
// });





// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);


//API

//Retrieving data by author.



// Retrieving data by subject. 
 


module.exports = app;
