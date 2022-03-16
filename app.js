// information: Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();
// :information: Connects to the database
require("./db/index");
// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");
require("./helpers/hbs"); // utils for hbs templates
const app = express();
const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
hbs.registerPartials(path.join(__dirname, "views/partials"));
// HELPERS TO CHECK THE REVIEWS.
// :information: This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);
// default value for title local
const projectName = "test-API";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();
// app.locals.title = `${capitalized(projectName)} created with IronLauncher`;
//Express-session is used to handle sessions, connect-mongo is to store the data sessions inside the database
//It has to be placed before the routes
const session = require("express-session");
const MongoStore = require("connect-mongo");

// for the auth with Google.
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

//use session
app.use(
  session({
    secret: "story book",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1/test-API",
      ttl: 1000 * 60 * 60 * 6,
    }),
  })
);

// app.use(passport.initialize()); // init passport on every route call
// app.use(passport.session());

// authUser = (request, accessToken, refreshToken, profile, done) => {
//   return done(null, profile);
// }

// const GOOGLE_CLIENT_ID = "331250048962-mvgeq323d1bjiu11n4hdemq66q2ln0ak.apps.googleusercontent.com";
// const GOOGLE_CLIENT_SECRET = "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";

//Use "GoogleStrategy" as the Authentication Strategy
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: GOOGLE_CLIENT_ID,
//       clientSecret: GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:3001/auth/google/callback",
//       passReqToCallback: true,
//     },
//     authUser
//   )
// );

// passport.serializeUser((user, done) => {
//   console.log(`\n--------> Serialize User:`);
//   console.log(user);
//   // The USER object is the "authenticated user" from the done() in authUser function.
//   // serializeUser() will attach this user to "req.session.passport.user.{user}", so that it is tied to the session object for each session.

//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   console.log("\n--------- Deserialized User:");
//   console.log(user);
//   // This is the {user} that was saved in req.session.passport.user.{user} in the serializationUser()
//   // deserializeUser will attach this {user} to the "req.user.{user}", so that it can be used anywhere in the App.

//   done(null, user);
// });

//console.log() values of "req.session" and "req.user" so we can see what is happening during Google Authentication
// let count = 1
// showlogs = (req, res, next) => {
//     console.log("\n==============================")
//     console.log(`------------>  ${count++}`)

//     console.log(`\n req.session.passport -------> `)
//     console.log(req.session.passport)
  
//     console.log(`\n req.user -------> `) 
//     console.log(req.user) 
  
//     console.log("\n Session and Cookie")
//     console.log(`req.session.id -------> ${req.session.id}`) 
//     console.log(`req.session.cookie -------> `) 
//     console.log(req.session.cookie) 
  
//     console.log("===========================================\n")

//     next()
// }

// app.use(showlogs)


// app.get('/auth/google',
//   passport.authenticate('google', { scope:
//       [ 'email', 'profile' ] }
// ));

// app.get('/auth/google/callback',
//     passport.authenticate( 'google', {
//         successRedirect: '/',
//         failureRedirect: '/login'
// }));



app.use(require("./middlewares/loginstatus"));

//INITIALIZE BODY-PARSER
const bodyParser = require("body-parser");
// :index_vers_le_bas: Start handling routes here
const index = require("./routes/index");
app.use("/", index);
//Link with auth.js
const auth = require("./routes/auth");
//make the app use auth.js
app.use("/", auth);
const login = require("./routes/login");
app.use("/", login);
const logout = require("./routes/logout");
app.use("/", logout);

// COSTUM MIDDLEWARES
// app.use(require("./middlewares/devMode")); // active le mode dev pour éviter les deconnexions
//   app.use(require("./middlewares/debugSessionInfos")); // affiche le contenu de la session
// app.use(require("./middlewares/protectRoute"))
// app.use(function (req, res, next) {
//     res.locals.session = req.session;
//     next();
// });
const personalspace = require("./routes/personalspace");
app.use("/", personalspace);
const reviews = require("./routes/review-route");
app.use("/", reviews);
const contest = require("./routes/contest");
app.use("/", contest);
const profile = require("./routes/profile");
app.use("/", profile);
// :point_d'exclamation: To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);
app.get("/", (req, res) => {
  res.render("index", { reviews: reviews });
});
module.exports = app;
