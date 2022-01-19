

module.exports = function protectRoute(req, res, next) {
    if (req.session.currentUser.username) next();
    else window.alert("This review is not yours to modify!");
}