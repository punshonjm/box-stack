const path = require("path");
const Express = require("express");

var app = Express();

app.get("/", function(req, res) {
	res.sendFile( path.join(__dirname, "/index.html") );
});

app.use("/vendor", Express.static( path.join(__dirname, "/vendor")) );
app.use("/public", Express.static( path.join(__dirname, "/public")) );
app.use("/dist", Express.static( path.join(__dirname, "/dist")) );

app.listen(8000, () => {
	console.log("Listening on port #8000...");
});
