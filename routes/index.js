"use strict";

const express = require("express");
const router = express.Router();
const tmdb = require("../lib/tmdb");


router.get("/", function(req, res) {
  res.render("index", { title: "Lithium Movie Tracker", movies: tmdb.get() });
});

router.get("/update", function(req, res) {
  tmdb.update();
  res.redirect("/");
});

module.exports = router;
