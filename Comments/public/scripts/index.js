var socket = io.connect("http://localhost:8080");

var new_com = document.getElementById("new_com");
var read = document.getElementById("read");


function get_comments()
{
	socket.emit("request_comments");
}

function send_comment(e)
{
	e.preventDefault();
	if (new_com.value.length > 0)
		socket.emit("new_comment", new_com.value);
}

function reset_comments()
{
	socket.emit("reset_comments");
	read.innerHTML = "";
}

function add_comment(c)
{
	var comment = document.createElement("div");
	comment.className = "comment";
		var comment_content = document.createElement("p");
		comment_content.className = "content";
		comment_content.innerHTML = c.content;
		var comment_infos = document.createElement("p");
		comment_infos.className = "infos";
		comment_infos.innerHTML = "By <span class='author'>" + c.author + "</span> - <span class='date'>" + c.date + "</span>";
	comment.appendChild(comment_content);
	comment.appendChild(comment_infos);
	read.appendChild(comment);
}

socket.on("comments_received", function(comments)
{
	for (var i = 0; i < comments.length; ++i)
		add_comment(comments[i]);
});

socket.on("new_comment", function(comment)
{
	add_comment(comment);
});

socket.on("comments_removed", function()
{
	read.innerHTML = "";
});
