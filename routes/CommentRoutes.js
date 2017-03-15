var express = require("express"),
	router = express.Router({mergeParams: true}),
	middleware = require("../middleware"),
	models = require("../models");

router.post("/", middleware.isValidCampground, function(req, res) {
	//find campground to post on
	var campground_id = req.params.id, comment_body = req.body.body;
	models.Campground.findById(campground_id)
	.then(function(campground) {
		if(campground) {
			//make the comment
			models.Comment.create({
				body: comment_body,
				UserId: req.user.id,
				CampgroundId: campground_id
			}).then(function(comment) {
				res.redirect("/campgrounds/" + campground_id);
			}).catch(function(err) {
				req.flash("error", err.errors[0].message);
				res.redirect("/campgrounds/" + campground_id);
			});
		}
	});
});

router.put("/:commentid", middleware.isValidCampground, middleware.checkCommentOwnership, function(req, res) {
	var campgroundId = req.params.id,
		commentid = req.params.commentid,
		comment_body = req.body.body;
	models.Comment.findById(commentid)
	.then(function(comment) {
		if(comment) {
			comment.update({ body: comment_body }, { fields: ["body"] });
		}
		res.redirect("/campgrounds/" + campgroundId);
	}).catch(function(err) {
		req.flash("error", err.errors[0].message);
		res.redirect("/campgrounds/" + campground_id);
	});
});

router.delete("/:commentid", middleware.isValidCampground, middleware.checkCommentOwnership, function(req, res) {
	var commentid = req.params.commentid, campgroundId = req.params.id;
	models.Comment.findById(commentid)
	.then(function(comment) {
		if(comment) comment.destroy();
		res.redirect("/campgrounds/" + campgroundId);
	});
});

module.exports = router;