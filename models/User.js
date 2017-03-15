"use strict";

var bcrypt = require("bcrypt-nodejs");

module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define("User", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [0, 100],
				isLowercase: true
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		hooks: {
			beforeValidate: function(user, options) {
				user.username = user.username.toLowerCase();
			}
		},
		classMethods: {
			generateHash: function(password) {
				return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
			},
			associate: function(models) {
				User.hasMany(models.Campground);
				User.hasMany(models.Comment);
			}
		},
		instanceMethods: {			
			validPassword: function(password) {
				return bcrypt.compareSync(password, this.password);
			}
		}
	});

	return User;
};