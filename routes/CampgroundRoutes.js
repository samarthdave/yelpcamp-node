const express = require("express"),
	router = express.Router({mergeParams: true}),
	middleware = require("../middleware"),
	models = require("../models");

//INDEX
router.get("/", (req, res) => {
	req.flash("warning", "This link has been moved to root path.");
	res.redirect("/");
});
//NEW
router.get("/new", (req, res) => {
	res.render("campgrounds/new", { title: "Create a campground - Yelpcamp" });
});
//CREATE
router.post("/", (req, res) => {
	let name = req.body.name, imageurl = req.body.imageurl, body = req.body.body;
	models.Campground.create({
		name: name,
		imageurl: imageurl,
		body: body,
		UserId: req.user.id
	}).then((campground) => {
		if(campground) {
			req.flash("success", "Created your campground!");
			res.redirect("/campgrounds/" + campground.id);
		} else {
			res.render("new");
		}
	});
});
//SHOW
router.get("/:id", middleware.isValidCampground, (req, res) => {
	let id = req.params.id;
	models.Campground.find({
		where: { id: id	},
		include: [{ all: true, nested: true }],
		order: [[models.Comment, "createdAt", "DESC"]]
	})
	.then((campground) => {
		res.render("campgrounds/show", {
			campground: campground,
			comments: campground.Comments,
			title: campground.name.substring(0, 15) + " - Yelpcamp"
		});
	});
});
//EDIT
router.get("/:id/edit", middleware.isValidCampground, middleware.checkCampgroundOwnership, (req, res) => {
	let id = req.params.id;
	models.Campground.findById(id)
	.then((campground) => {
		if(campground) {
			res.render("campgrounds/edit", {
				campground: campground,
				title: "Edit " + campground.name.substring(0, 15) + " - Yelpcamp"
			});
		}
	});
});
//UPDATE
router.put("/:id", middleware.isValidCampground, middleware.checkCampgroundOwnership, (req, res) => {
	let id = req.params.id;
	models.Campground.findById(id)
	.then((campground) => {
		if(campground) {
			let name = req.body.name, imageurl = req.body.imageurl, body = req.body.body;
			campground.update({
				name: name,
				imageurl: imageurl,
				body: body
			}, { fields: ["name", "imageurl", "body"] })
			.then(() => {
				res.redirect("/campgrounds/" + campground.id);
			});
		}
	});
});
//DELETE
router.delete("/:id", middleware.isValidCampground, middleware.checkCampgroundOwnership, (req, res) => {
	let id = req.params.id;
	models.Campground.findById(id)
	.then((campground) => {
		if(campground) {
			campground.destroy();
			req.flash("success", "Deleted your campground.");
			res.redirect("/");
		}
	});
});

module.exports = router;