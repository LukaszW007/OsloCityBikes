// import dotenv from "dotenv";
// dotenv.config();
// import mongoose from "mongoose";
export {};
// const url = process.env.MONGODB_URI || process.env.MONGODB_URI_DEV;
// mongoose.set("strictQuery", false);
// const options = {
// 	serverSelectionTimeoutMS: 25000, // Increase the timeout to 25 seconds
// };
// const connect = async () => {
// 	try {
// 		await mongoose.connect(url, options);
// 		console.log("connected to MongoDB");
// 	} catch (error: any) {
// 		console.log("error connecting to MongoDB:", error.message);
// 	}
// };
// // Station schema
// export const stationSchema = new mongoose.Schema({
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
// export const stationStatus = new mongoose.Schema({
// 	name: { type: String, required: true },
// 	station_id: { type: String, required: true },
// 	num_bikes_available: { type: Number, required: true },
// 	num_docks_available: { type: Number, required: true },
// 	capacity: { type: Number, required: true },
// 	dayStamp: { type: Number, required: true },
// 	timeStamp: { type: Date, required: true },
// });
// export const addApiStatusDataToStationStatusCollection = async (
// 	stationsStatusFromAPI: any[]
// ) => {
// 	if (!stationsStatusFromAPI || stationsStatusFromAPI.length <= 0) {
// 		console.log(
// 			"stationsStatusFromAPI has no data: ",
// 			stationsStatusFromAPI
// 		);
// 		return;
// 	}
// 	console.log("addApiStatusDataToStationStatusCollection");
// 	await connect();
// 	const documents = [];
// 	for (const station of stationsStatusFromAPI) {
// 		const collectionStationData = await Station.find({
// 			station_id: station.station_id,
// 		}).lean(true);
// 		if (collectionStationData.length > 0) {
// 			const stationItem = new StationsStatus({
// 				station_id: station.station_id,
// 				name: collectionStationData[0].name,
// 				num_bikes_available: station.num_vehicles_available,
// 				num_docks_available: station.num_docks_available,
// 				capacity: station.num_docks_available,
// 				dayStamp: new Date().getDay(),
// 				timeStamp: new Date(),
// 			});
// 			documents.push(stationItem);
// 		}
// 	}
// 	await StationsStatus.insertMany(documents);
// 	console.log("Saving to mongoDB is done", documents.length);
// 	// await disconnect();
// };
// export const addApiDataToStationsCollection = async (
// 	stationsFromAPI: any[]
// ) => {
// 	await connect();
// 	const stations = stationsFromAPI.map((station: any) => ({
// 		station_id: station.station_id,
// 		address: station.address,
// 		name: station.name,
// 		cross_street: station.cross_street,
// 		lat: station.lat,
// 		lon: station.lon,
// 		is_virtual_station: station.is_virtual_station,
// 		capacity: station.capacity,
// 		station_area: {
// 			type: station.station_area.type,
// 			coordinates: station.station_area.coordinates,
// 		},
// 		rental_uris: {
// 			android: station.rental_uris.android,
// 			ios: station.rental_uris.ios,
// 		},
// 		dateOfLastUpdate: new Date(),
// 	}));
// 	await Station.insertMany(stations);
// 	console.log("stations list is up to date!");
// 	// await disconnect();
// };
// export const updateStationsCollection = async (apiData: any[]) => {
// 	await connect();
// 	const collectionData = await Station.find().lean(true);
// 	const missingItemsArray = apiData.filter(
// 		(apiDataItem) =>
// 			!collectionData.some(
// 				(collectionDataItem) =>
// 					collectionDataItem.station_id === apiDataItem.station_id
// 			)
// 	);
// 	if (missingItemsArray.length > 0) {
// 		await addApiDataToStationsCollection(missingItemsArray);
// 	}
// };
// export const deleteAllInCollection = async () => {
// 	await connect();
// 	await StationsStatus.deleteMany({});
// 	console.log("Deleted all documents in StationsStatus collection");
// };
// export const Station = mongoose.model("Station", stationSchema);
// export const StationsStatus = mongoose.model("stations_status", stationStatus);
// const disconnect = async () => {
// 	await mongoose.disconnect();
// };
