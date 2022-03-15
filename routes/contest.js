

const router = require("express").Router();

router.get("/contest", (req, res, next) => {
    res.render("contest");
})

module.exports = router;