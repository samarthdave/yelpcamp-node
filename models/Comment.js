"use strict";

module.exports = function(sequelize, DataTypes) {
	var Comment = sequelize.define("Comment", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		body: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				rightLength: function(value) {
					if(value.length < 1) {
						throw new Error("Your comment is too short.");
					} else if(value.length > 100) {
						throw new Error("Your comment is too long!");
					}
				}

			}
		}
	}, {
		// hooks: {
		// 	beforeValidate: function(user, options) {
		// 	}
		// },
		classMethods: {
			associate: function(models) {
				Comment.belongsTo(models.User, {
					onDelete: "CASCADE",
					foreignKey: {
						allowNull: false
					}
				});
				Comment.belongsTo(models.Campground, {
					onDelete: "CASCADE",
					foreignKey: {
						allowNull: false
					}
				});
			}
		}
	});
	return Comment;
};