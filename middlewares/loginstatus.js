module.exports = function loginStatus(req, res, next) {
    if (!req.session.currentUser) {
      res.locals.currentUser = undefined;
      res.locals.isLoggedIn = false;
    } else {
      console.log(res.locals.currentUser)
      res.locals.currentUser = req.session.currentUser;
      res.locals.isLoggedIn = true;
      console.log(res.locals);
    }
    next();
  };