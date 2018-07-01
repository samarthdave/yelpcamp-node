const models = require("../models"),
	Campground = models.Campground,
	User = models.User,
	Comment = models.Comment;

exports.isLoggedIn = (req, res, next) => {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

exports.checkCampgroundOwnership = (req, res, next) => {
	const campgroundId = req.params.id;
	Campground.findById(campgroundId)
	.then((campground) => {
		if(campground) {
			if(campground.UserId == req.user.id) {
				return next();
			}
			req.flash("error", "You're not allowed to do that!");
			res.redirect("/campgrounds/" + campground.id);
		} else {
			req.flash("error", "Couldn't find that campground. It may have been deleted. Check the link and try again.");
			res.redirect("/");
		}
	});
}

exports.isValidCampground = (req, res, next) => {
	const campground_id = req.params.id;
	Campground.findById(campground_id)
	.then((campground) => {
		if(campground) {
			return next();
		} else {
			req.flash("error", "Couldn't find that campground. Check the link and try again.");
			res.redirect("/");
		}
	});
}

exports.checkCommentOwnership = (req, res, next) => {
	//first part checks for comment exists
	let userid = req.user.id, commentId = req.params.commentid;
	let foundComment = false;
	Comment.findById(commentId)
	.then((comment) => {
		if(comment) { foundComment = true; }
	}).catch((err) => {}).then(() => {
		if(!foundComment) {
			req.flash("error", "Couldn't find your comment!");
			res.redirect("back");
			return;
		}
		//assume comment exists
		User.find({
			where: { id: userid },
			include: [{ all: true, nested: true }]
		})
		.then((user) => {
			if(user) {
				let comments = user.Comments;
				for(let i = 0; i < comments.length; i++) {
					if(comments[i].id == commentId) { return next(); }
				}
				req.flash("error", ":/ You're not allowed to change other people's comments.");
				res.redirect("/campgrounds/" + req.params.id);
			}
		});
	});
}