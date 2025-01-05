// mongodb+srv://wisznu07:<password>@cluster0.wzqvkl2.mongodb.net/?retryWrites=true&w=majority
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { FetchedAPIData, StationInformation, StationStatus, StationStatusState } from "../index.js";
// import { MongoClient, ServerApiVersion } from "mongodb";
// const { MongoClient, ServerApiVersion } = require("mongodb");

// if (process.argv.length < 3) {
// 	console.log("give password as argument");
// 	process.exit(1);
// }

interface IStationsStatus {
	name: string;
	station_id: string;
	num_bikes_available: number;
	num_docks_available: number;
	capacity: number;
	apiLastUpdate: number;
	dayStamp: number;
	timeStamp: Date;
}

interface IAllStationsStatuses {
	station_id: string;
	name: string;
	statuses: IStatusToMigrate[];
}

interface IStatusToMigrate {
	day: number;
	week: number;
	timestamp: Date;
	num_bikes_available: number;
	num_docks_available: number;
	apiLastUpdate: number;
	capacity: number;
}

const password = process.argv[2];

let url = process.env.MONGODB_URI as string;

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
	url = process.env.MONGODB_URI_DEV as string;
	console.log("Connecting to DEVELOPMENT mongoDB");
}

mongoose.set("strictQuery", false);
// mongoose
// 	.connect(url)
// 	.then((result) => {
// 		console.log("connected to MongoDB");
// 	})
// 	.catch((error) => {
// 		console.log("error connecting to MongoDB:", error.message);
// 	});

const options = {
	serverSelectionTimeoutMS: 25000, // Increase the timeout to 25 seconds
};

////////////////////////////////////////

// const uri =
// 	"mongodb+srv://<db_username>:<db_password>@cluster0.wzqvkl2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
// 	serverApi: {
// 		version: ServerApiVersion.v1,
// 		strict: true,
// 		deprecationErrors: true,
// 	},
// });

// async function run() {
// 	try {
// 		// Connect the client to the server	(optional starting in v4.7)
// 		await client.connect();
// 		// Send a ping to confirm a successful connection
// 		await client.db("admin").command({ ping: 1 });
// 		console.log(
// 			"Pinged your deployment. You successfully connected to MongoDB!"
// 		);
// 	} finally {
// 		// Ensures that the client will close when you finish/error
// 		await client.close();
// 	}
// }
// run().catch(console.dir);

////////////////////////////////////

export const connect = async () => {
	try {
		await mongoose.connect(url, options);
		console.log("connected to MongoDB with url: ", url);
	} catch (error: any) {
		console.log("error connecting to MongoDB:", error.message);
	}
};

// Station schema
export const stationSchema = new mongoose.Schema({
	name: { type: String, required: true },
	station_id: { type: String, required: true },
	address: { type: String, required: true },
	cross_street: { type: String, required: true },
	lat: { type: Number, required: true },
	lon: { type: Number, required: true },
	is_virtual_station: { type: Boolean, required: true },
	capacity: { type: Number, required: true },
	station_area: {
		type: { type: String, required: true },
		coordinates: { type: Array, required: true },
	},
	rental_uris: {
		android: { type: String, required: true },
		ios: { type: String, required: true },
	},
	dateOfLastUpdate: { type: Date, required: true },
});

// Station schema
export const stationsStatus = new mongoose.Schema<IStationsStatus>({
	name: { type: String, required: true },
	station_id: { type: String, required: true },
	num_bikes_available: { type: Number, required: true },
	num_docks_available: { type: Number, required: true },
	capacity: { type: Number, required: true },
	apiLastUpdate: { type: Number, required: true },
	dayStamp: { type: Number, required: true },
	timeStamp: { type: Date, required: true },
});

export const stationsStatusByDay = new mongoose.Schema({
	station_id: { type: String, required: true },
	name: { type: String, required: true },
	statuses: [
		{
			day: { type: Number, required: true },
			week: { type: Number, required: true },
			timestamp: { type: Date, required: true },
			num_bikes_available: { type: Number, required: true },
			num_docks_available: { type: Number, required: true },
			apiLastUpdate: { type: Number, required: true },
			capacity: { type: Number, required: true },
		},
	],
});

export const addApiStatusDataToStationStatusCollection2 = async (stationsStatusFromAPI: any[]) => {
	if (!stationsStatusFromAPI || stationsStatusFromAPI.length <= 0) {
		console.log("stationsStatusFromAPI has no data: ", stationsStatusFromAPI);
		return;
	}
	console.log("addApiStatusDataToStationStatusCollection");
	// await connect();
	const documents = [];
	for (const station of stationsStatusFromAPI) {
		//check does the station even exists in mongoDb collection of stations
		const collectionStationData = await Station.find({
			station_id: station.station_id,
		}).lean(true);
		if (collectionStationData.length > 0) {
			const stationItem = new StationsStatus({
				station_id: station.station_id,
				name: collectionStationData[0].name,
				num_bikes_available: station.num_vehicles_available,
				num_docks_available: station.num_docks_available,
				capacity: station.num_docks_available,
				dayStamp: new Date().getDay(),
				timeStamp: new Date(),
			});

			documents.push(stationItem);
			console.log("Documents:  ", documents.length);

			// stationItem.save().then((savedStation) => {
			// 	// response.json(savedStation)
			// 	console.log("station status saved!");
			// });
		}
	}
	console.log("documents.length ", documents.length);
	await StationsStatus.insertMany(documents);
	console.log("Saving to mongoDB is done", documents.length);
	// await disconnect();
};

// Function to check if status has changed
const hasStatusChanged = (fetchedStatuses: StationStatus[], statusesFromMongo: IStationsStatus[], stationId: string) => {
	const statusesOfStation = statusesFromMongo.filter((status) => status.station_id === stationId);
	const lastStatus = statusesOfStation.reduce((latest, current) => {
		return current.timeStamp > latest.timeStamp ? current : latest;
	}, statusesOfStation[0]);

	const statusFromApi = fetchedStatuses.find((status) => status.station_id === stationId);
	const dateOfStatusFromApiLastUpdate = statusFromApi ? new Date(statusFromApi?.last_reported * 1000) : undefined;

	const apiLastUpdateDate = new Date(lastStatus.apiLastUpdate * 1000);
	//Status is changed only when number of bikes or available docks are changed
	return (
		apiLastUpdateDate !== dateOfStatusFromApiLastUpdate &&
		(lastStatus.num_bikes_available !== statusFromApi?.num_bikes_available ||
			lastStatus.num_docks_available !== statusFromApi?.num_docks_available)
	);
};

export const addApiStatusDataToStationStatusCollection = async (fetchedStationStatusAPIData: FetchedAPIData): Promise<number> => {
	const fetchedStatuses: StationStatus[] = fetchedStationStatusAPIData.stationStatus!;
	const fetchedStatusesState: StationStatusState = fetchedStationStatusAPIData.stationStatusState!;
	//fetchedStatusesState.last_updated is POSIX/unix timestamp so has to be *1000
	const lastStautsesStateUpdate = new Date(fetchedStatusesState.last_updated * 1000);
	// Fetch all stations once to reduce multiple database calls
	const statuses = await StationsStatus.find().exec();
	const stationsFromMongo = await Station.find().exec();
	const latestAddedStatus = await StationsStatus.findOne().sort({ timeStamp: -1 }).limit(1);
	console.log("Latest added status to Mongo is: ", latestAddedStatus?.timeStamp);
	console.log("Latest ", fetchedStatusesState, " added status to API is: ", lastStautsesStateUpdate);
	const compare = latestAddedStatus ? lastStautsesStateUpdate > latestAddedStatus?.timeStamp : null;
	console.log("Mongo update is required: ", compare);

	if (!latestAddedStatus || (latestAddedStatus && lastStautsesStateUpdate.getTime() > latestAddedStatus?.timeStamp.getTime())) {
		const stationMap = new Map();
		stationsFromMongo.forEach((station) => {
			stationMap.set(station.station_id, station.name);
		});
		const newStatuses: any[] = [];

		// Loop through fetched statuses and compare with current statuses
		fetchedStatuses.forEach((status: StationStatus) => {
			const stationId = status.station_id;
			const currentStationStatus = stationMap.get(stationId);
			if (currentStationStatus) {
				// Check if the status has changed
				if (!latestAddedStatus || hasStatusChanged(fetchedStatuses, statuses, stationId)) {
					// Create a new StationStatus object
					const newStatus = new StationsStatus({
						station_id: stationId,
						name: stationMap.get(stationId),
						num_bikes_available: status.num_vehicles_available,
						num_docks_available: status.num_docks_available,
						capacity: status.num_docks_available,
						apiLastUpdate: status.last_reported,
						dayStamp: new Date().getDay(),
						timeStamp: new Date(),
					});
					newStatuses.push(newStatus);
				}
			}
		});
		// Bulk insert	new statuses();
		if (newStatuses.length > 0) {
			console.log(`All data: `, newStatuses.length);
			await StationsStatus.insertMany(newStatuses);
		}
		console.log("Status data has been updated in the StationStatus collection.");
		return newStatuses.length;
	} else {
		console.log(`Stations' statuses are up to date`);
		return 0;
	}
};

export const addApiDataToStationInformationCollection = async (stationsFromAPI: StationInformation[]) => {
	await connect();
	stationsFromAPI.map(async (station: StationInformation) => {
		const stationItem = new Station({
			station_id: station.station_id,
			address: station.address,
			name: station.name,
			cross_street: station.cross_street,
			lat: station.lat,
			lon: station.lon,
			is_virtual_station: station.is_virtual_station,
			capacity: station.capacity,
			station_area: {
				type: station.station_area.type,
				coordinates: station.station_area.coordinates,
			},
			rental_uris: {
				android: station.rental_uris.android,
				ios: station.rental_uris.ios,
			},
			dateOfLastUpdate: new Date(),
		});

		await stationItem.save().then((savedStation) => {
			// response.json(savedStation)
			console.log("station saved!");
		});
	});
	console.log("stations list is updated!");
	// await disconnect();
};

// Unhandled Rejection: TypeError: Cannot read properties of undefined (reading 'filter')
//     at updateStationsCollection (file:///var/task/server/build/mongoDB/mongo.js:165:38)
//     at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
//     at async updateMongoDB (file:///var/task/server/build/mongoDB/fetch-data.js:22:5)
// Node.js process exited with exit status: 128. The logs above can help with debugging the issue.
export const updateStationInformationCollection = async (apiData: StationInformation[]) => {
	await connect();
	const collectionData = await Station.find().lean(true);
	const collectionDataCount = collectionData.length;
	const missingItemsArray: StationInformation[] = [];
	if (apiData?.length !== collectionDataCount) {
		const missingItems = apiData!.filter((apiDataItem) => {
			const checkedItem = collectionData!.filter((collectionDataItem) => collectionDataItem.station_id === apiDataItem.station_id);
			if (checkedItem.length > 0) {
				return null;
			} else {
				return apiDataItem;
			}
		});
		// console.log("missingItems ", missingItems);
		missingItemsArray.push(...missingItems);
	}

	if (missingItemsArray.length > 0) {
		addApiDataToStationInformationCollection(missingItemsArray);
	} else {
		console.log("stations list is up to date!");
		await disconnect();
	}
};

export const deleteAllInCollection = async () => {
	await connect();
	const collectionData = await StationsStatus.deleteMany({});
	// console.log("collectionData ", collectionData);
	await disconnect();
};

export const Station = mongoose.model("Station", stationSchema);
export const StationTemp = mongoose.model("Station", stationSchema);
export const StationsStatus = mongoose.model("stations_status", stationsStatus);
export const StationsStatusTemp = mongoose.model("stations_status", stationsStatus);
export const StationsStatusByDay = mongoose.model("stations_status_by_day", stationsStatusByDay);

function getCurrentWeek(timeStamp: Date): number {
	const d = new Date(timeStamp);
	let yearStart = +new Date(d.getFullYear(), 0, 1);
	let today = +new Date(d.getFullYear(), d.getMonth(), d.getDate());
	let dayOfYear = (today - yearStart + 1) / 86400000;
	let week = Math.ceil(dayOfYear / 7);
	return week;
}

export const migrateData = async () => {
	const statuses = await StationsStatus.find().exec();
	const stationsFromMongo = await Station.find().exec();

	const migrationArray: IAllStationsStatuses[] = [];
	for (const station of stationsFromMongo) {
		const arrayOfStatusesToMigrate: IStatusToMigrate[] = [];
		const statusesArrayOfStationId = statuses.filter((status) => status.station_id === station.station_id);
		for (const status of statusesArrayOfStationId) {
			const statusToMigrate: IStatusToMigrate = {
				day: status.dayStamp,
				week: getCurrentWeek(status.timeStamp), // Custom function to get the week number
				timestamp: status.timeStamp,
				num_bikes_available: status.num_bikes_available,
				num_docks_available: status.num_docks_available,
				apiLastUpdate: status.apiLastUpdate,
				capacity: status.capacity,
			};
			arrayOfStatusesToMigrate.push(statusToMigrate);
		}

		const singleDocument: IAllStationsStatuses = {
			station_id: station.station_id,
			name: station.name,
			statuses: arrayOfStatusesToMigrate,
		};

		//Array ready to add to mongoDB collection
		migrationArray.push(singleDocument);
	}

	console.log("migrationArray.length ", migrationArray.length);
	await StationsStatusByDay.insertMany(migrationArray);
};

// Disconnect from MongoDB Atlas
// process.on("SIGINT", () => {
export const disconnect = async () => {
	try {
		await mongoose.disconnect();
		console.log("disconnected from MongoDB");
	} catch (error: any) {
		console.log("error disconnecting from MongoDB:", error.message);
	}
};

// export const StationsStatus = mongoose.model("StationsStatus", stationStatus);

// Station.find({}).then((result) => {
// 	result.forEach((note) => {
// 		console.log(note);
// 	});
// 	mongoose.connection.close();
// });

// const station = new Station({
// 	station_id: "4683",
// 	address: "Valle Vision",
// 	name: "Valle Vision",
// 	cross_street: "Valle",
// 	lat: 59.91606483663281,
// 	lon: 10.807177606311825,
// 	is_virtual_station: false,
// 	capacity: 21,
// 	station_area: {
// 		type: "MultiPolygon",
// 		coordinates: [
// 			[
// 				[
// 					[10.806948306023173, 59.91613614756602],
// 					[10.80693754708878, 59.91603598985276],
// 					[10.807457049923272, 59.915989763114],
// 					[10.807503159643403, 59.91609377318596],
// 					[10.806948306023173, 59.91613614756602],
// 				],
// 			],
// 		],
// 	},
// 	rental_uris: {
// 		android: "oslobysykkel://stations/4683",
// 		ios: "oslobysykkel://stations/4683",
// 	},
// });

// station.save().then(() => {
// 	console.log("station saved!");
// 	// mongoose.connection.close();
// });
