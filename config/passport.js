var models = require("../models"),
	User = models.User,
	Campground = models.Campground,
	LocalStrategy = require("passport-local").Strategy;

module.exports = function(passport) {
	// (de)serializing user
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.find({
			where: { id: id },
			include: [{ all: true }] // wouldn't recommend this line, but its fine for now
		}).then(function(user) {
			done(null, user);
		}).catch(function(e){
			done(e, false);
		});
	});

	// local signup

	passport.use('local-signup', new LocalStrategy({
		// usernameField: 'email', (optional if email login)
		passReqToCallback: true
	}, function(req, username, password, done) {
		// find if a user with the username already exists
		User.findOne({
			where: {
				username: username
			}
		}).then(function(user) {
			if(user) {
				return done(null, false, req.flash('error', 'That username is already taken.'));
			} else {
				// set credentials
				User.create({
					username: username,
					// hash function from the models
					password: User.generateHash(password)
				}).then(function(user) {
					return done(null, user);
				}).catch(function(e) {
					throw e;
				});
			}
		}).catch(function(e) {
			return done(e);
		});
	}));

	// local login

	passport.use("local-login", new LocalStrategy({
		passReqToCallback: true
	}, function(req, username, password, done) {
		User.findOne({
			where: { username: username },
			include: [{ all: true }],
			order: [[ Campground, 'createdAt', 'DESC']]
		}).then(function(user) {
			// errors if invalid password, etc.
			// invalid username
			if(!user)
				return done(null, false, req.flash("error", "Oops! Couldn't find you!"));
			// use function from models
			if(!user.validPassword(password))
				return done(null, false, req.flash("error", "Oops! Wrong password."));
			// authenticated the user (and it only took 75 lines)
			req.flash("success", "Logged you in!");
			return done(null, user);
		});
	}));
}