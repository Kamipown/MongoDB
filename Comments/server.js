var express = require("express");
var app = express();
var server = app.listen(8080);
var mongoose = require("mongoose");
var io = require("socket.io").listen(server);

mongoose.connect("mongodb://localhost/comments", function(err)
{
	if (err) throw err;
});

var comment_schema = new mongoose.Schema(
{
	content: String,
	author: String,
	date: Date
});

var comment_model = mongoose.model("comment", comment_schema);

app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res)
{
	res.render("index.ejs");
});

io.sockets.on("connection", function(socket)
{
	console.log("New connection");

	socket.on("request_comments", function()
	{
		comment_model.find(null, function(err, comments)
		{
			socket.emit("comments_received", comments);
		});
	})

	socket.on("new_comment", function(content)
	{
		var new_comment = new comment_model();
		new_comment.content = content;
		new_comment.author = "Kamipown";
		new_comment.date = Date.now();
		new_comment.save(function(err)
		{
			if (err) throw err;
			else
			{
				console.log("New comment");
				socket.emit("new_comment", new_comment);
				socket.broadcast.emit("new_comment", new_comment);
			}
		});
	});

	socket.on("reset_comments", function()
	{
		comment_model.remove(null, function(err)
		{
			if (err) throw err;
			else
			{
				console.log("Comments removed");
				socket.broadcast.emit("comments_removed");
			}
		})
	});
});
