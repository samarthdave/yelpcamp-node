$(document).ready(function() {
	$("#edit-comment-modal").on("show.bs.modal", function(e) {
		var button = $(e.relatedTarget);
		var campgroundId = button.data("campground"),
			commentId = button.data("comment"),
			body = button.data("body").substring(0, 101);
		$("#edit-comment-form").attr("action", "/campgrounds/" + campgroundId + "/comments/" + commentId + "?_method=PUT");
		$("#edit-comment-form input").attr("value", body);
	});

	$("#delete-comment-modal").on("show.bs.modal", function(e) {
		var button = $(e.relatedTarget);
		var campgroundId = button.data("campground"),
			commentId = button.data("comment");
		$("#delete-comment-form").attr("action", "/campgrounds/" + campgroundId + "/comments/" + commentId + "?_method=DELETE");
	});
});
