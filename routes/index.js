const express = require("express");
const router = express.Router();

const dateformat = require("date-and-time");
const write = require("write");

/* GET home page. */
router.get("/", async function (req, res, next) {
   res.render("index", { title: "Express" });
});

module.exports = router;
