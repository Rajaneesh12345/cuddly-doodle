const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server);
const path = require("path");

app.use(express.static(path.join(__dirname, "./public")));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

let name;

io.on("connection", socket => {
	console.log("We have a new user online");

	socket.on("joininig message", userName => {
		name = userName;
		io.emit("chat message", ` - - - A user just joined the chat`);
	});

	socket.on("disconnect", () => {
		console.log("user disconnected");
		io.emit("chat message", `- - - A user just left the chat - - -`);
	});

	socket.on("chat message", message => {
		socket.broadcast.emit("chat message", message);
	});
});

server.listen(8000, () => {
	console.log(`we are running on port 8000 bro...`);
});
