const express = require("express");
const router = express.Router();
const Wallet = require("../models/wallet");

function isLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect("/auth/login");
}

router.get("/", isLoggedIn, async (req, res) => {
  try {
    const wallet = await Wallet.findByUserId(req.session.user.user_id);
    res.render("dashboard/index", {
      user: req.session.user,
      wallet: wallet || null,
    });
  } catch (err) {
    console.error("Error loading dashboard:", err);
    res.render("dashboard/index", {
      user: req.session.user,
      wallet: null,
    });
  }
});

module.exports = router;
