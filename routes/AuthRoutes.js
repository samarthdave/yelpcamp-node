const express = require("express"),
	router = express.Router(),
	passport = require("passport"),
	middleware = require("../middleware");

router.get("/signup", (req, res) => {
	res.render("signup", { title: "Signup - Yelpcamp" });
});

router.post("/signup", passport.authenticate("local-signup", {
		successRedirect: "/profile",
		failureRedirect: "/signup",
		failureFlash: true
	})
);

router.get("/login", (req, res) => {
	res.render("login", { title: "Login - Yelpcamp" });
});

router.post("/login",
	passport.authenticate("local-login", {
		successRedirect: "/profile",
		failureRedirect: "/login",
		failureFlash: true
	})
);

router.get("/profile", middleware.isLoggedIn, (req, res) => {
	res.render("profile", { title: "Your profile - Yelpcamp" });
});

router.get("/logout", middleware.isLoggedIn, (req, res) => {
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/");
});

module.exports = router;