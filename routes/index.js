var express = require("express"),
	router = express.Router({mergeParams: true}),
	models = require("../models");

router.get("/", function(req, res) {
	models.Campground.findAll({
		order: "createdAt DESC"
	}).then(function(campgrounds) {
		res.render("index", {campgrounds: campgrounds});
	});
});

module.exports = router;