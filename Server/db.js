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

const cleanupLegacyIndexes = async () => {
	try {
		const usersCollection = mongoose.connection.collection("users");
		const indexes = await usersCollection.indexes();
		const hasLegacyEmailIndex = indexes.some(
			(index) => index.name === "email_1"
		);

		if (hasLegacyEmailIndex) {
			await usersCollection.dropIndex("email_1");
			console.log("Dropped legacy users.email_1 unique index");
		}
	} catch (err) {
		// Startup should continue even if index cleanup is unnecessary or blocked.
		console.log("Index cleanup skipped:", err.message);
	}
};

db.on("connected", () => {
	console.log("Connected to DB");
	cleanupLegacyIndexes();
});

db.on("error", (err) => {
	console.log("Connection Error:", err);
});

db.on("disconnected", () => {
	console.log("Disconnected from DB");
});

module.exports = db;
