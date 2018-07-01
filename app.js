const express = require("express"),
	app = express(),
	cp = require("cookie-parser"),
	bp = require("body-parser"),
	session = require("express-session"),
	flash = require("connect-flash"),
	methodOverride = require("method-override"),
	models = require("./models"),
	passport = require("passport"),
	IndexRoutes = require("./routes"),
	AuthRoutes = require("./routes/AuthRoutes"),
	CampgroundRoutes = require("./routes/CampgroundRoutes"),
	CommentRoutes = require("./routes/CommentRoutes"),
	middleware = require("./middleware");

require("./config/passport")(passport);

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(cp());
app.use(bp.urlencoded({extended: true}));
app.use(session({
	secret: process.env.session_password || "some password secret here to secure signin sessions",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
	res.locals = {
		error: req.flash("error"),
		success: req.flash("success"),
		warning: req.flash("warning"),
		user: req.user,
		title: "Yelpcamp"
	}
	next();
});

app.use(AuthRoutes);
app.use(middleware.isLoggedIn);
app.use(IndexRoutes);
app.use("/campgrounds", CampgroundRoutes);
app.use("/campgrounds/:id/comments", CommentRoutes);

models.sequelize.sync().then(() => {
	app.listen(3000, () => {
		console.log("The magic happens on port 3000!");
	});
});