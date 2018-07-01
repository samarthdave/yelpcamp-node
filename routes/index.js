const express = require("express"),
	router = express.Router({mergeParams: true}),
	models = require("../models");

router.get("/", (req, res) => {
	models.Campground.findAll({
		order: "createdAt DESC"
	}).then((campgrounds) => {
		res.render("index", {campgrounds: campgrounds});
	});
});

module.exports = router;