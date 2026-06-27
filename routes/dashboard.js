const express = require("express");
const router = express.Router();

function isLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect("/auth/login");
}

router.get("/dashboard", isLoggedIn, (req, res) => {
  res.render("dashboard", {
    user: req.session.user
  });
});

module.exports = router;