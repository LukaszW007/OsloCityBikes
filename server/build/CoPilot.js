export {};
// import express from "express";
// import mongoose from "mongoose";
// import axios from "axios";
// import cron from "node-cron";
// // MongoDB connection
// const mongoUri = "your_mongodb_connection_string";
// mongoose
// 	.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
// 	.then(() => console.log("MongoDB connected"))
// 	.catch((err) => console.error("MongoDB connection error:", err));
// // Mongoose schema
// const stationSchema = new mongoose.Schema({
// 	name: { type: String, required: true },
// 	station_id: { type: String, required: true },
// 	address: { type: String, required: true },
// 	cross_street: { type: String, required: true },
// 	lat: { type: Number, required: true },
// 	lon: { type: Number, required: true },
// 	is_virtual_station: { type: Boolean, required: true },
// 	capacity: { type: Number, required: true },
// 	station_area: {
// 		type: { type: String, required: true },
// 		coordinates: { type: Array, required: true },
// 	},
// 	rental_uris: {
// 		android: { type: String, required: true },
// 		ios: { type: String, required: true },
// 	},
// 	dateOfLastUpdate: { type: Date, required: true },
// });
// const Station = mongoose.model("Station", stationSchema);
// const app = express();
// const port = 3000;
// const apiUrl =
// 	"https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json";
// // Function to fetch and update data
// const fetchDataAndUpdateDB = async () => {
// 	try {
// 		const response = await axios.get(apiUrl);
// 		const newData = response.data;
// 		const latestEntry = await Station.findOne().sort({
// 			dateOfLastUpdate: -1,
// 		});
// 		if (
// 			latestEntry &&
// 			JSON.stringify(latestEntry) === JSON.stringify(newData)
// 		) {
// 			console.log("Data is up-to-date");
// 		} else {
// 			await Station.create({ ...newData, dateOfLastUpdate: new Date() });
// 			console.log("Data updated");
// 		}
// 	} catch (error) {
// 		console.error("Error fetching data:", error);
// 	}
// };
// // Schedule data fetching every 60 seconds
// cron.schedule("*/1 * * * *", fetchDataAndUpdateDB);
// // Endpoint to get the latest station information
// app.get("/api/station_information", async (req, res) => {
// 	try {
// 		const latestEntry = await Station.findOne().sort({
// 			dateOfLastUpdate: -1,
// 		});
// 		if (latestEntry) {
// 			res.json(latestEntry);
// 		} else {
// 			res.status(404).send("No data found");
// 		}
// 	} catch (error) {
// 		res.status(500).send("Server error");
// 	}
// });
// app.listen(port, () => {
// 	console.log(`Server running on port ${port}`);
// });
