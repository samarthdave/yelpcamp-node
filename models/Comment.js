"use strict";

module.exports = (sequelize, DataTypes) => {
	const Comment = sequelize.define("Comment", {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		body: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				rightLength: (value) => {
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
			associate: (models) => {
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