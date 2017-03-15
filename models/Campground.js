"use strict";

module.exports = function(sequelize, DataTypes) {
	var Campground = sequelize.define("Campground", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [2, 100]
			}
		},
		imageurl: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				isUrl: true,
				len: [5, 500]
			}
		},
		body: {
			type: DataTypes.TEXT,
			validate: {
				len: [0, 1000]
			}
		}
	}, {
		// hooks: {
		// 	beforeValidate: function(user, options) {
		// 	}
		// },
		classMethods: {
			associate: function(models) {
				Campground.belongsTo(models.User, {
					onDelete: "CASCADE",
					foreignKey: {
						allowNull: false
					}
				});
				Campground.hasMany(models.Comment);
			}
		}
	});
	return Campground;
};