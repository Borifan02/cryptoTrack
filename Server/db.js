const mongoose = require("mongoose");
require("dotenv").config();
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
	throw new Error(
		"Missing MongoDB URI. Set MONGODB_URI or MONGO_URI in Server/.env"
	);
}

mongoose.connect(MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("connected", () => {
	console.log("Connected to DB");
});

db.on("error", (err) => {
	console.log("Connection Error:", err);
});

db.on("disconnected", () => {
	console.log("Disconnected from DB");
});

module.exports = db;
