import dotenv from "dotenv";
dotenv.config();
import cron from "node-cron";
import express, { NextFunction, Request, Response } from "express";
import router from "./routes.js";
import mongoose from "mongoose";
import APIConnector from "./connectors/axiosConnector.js";
import { requestLogger, unknownEndpoint, errorHandler, apiKeyChecker, ipWhitelistMiddleware } from "./utils/middleware.js";
import cors from "cors";
import {
	Station,
	StationsStatus,
	addApiStatusDataToStationStatusCollection,
	deleteAllInCollection,
	updateStationInformationCollection,
} from "./mongoDB/mongo.js";
import { connect, disconnect, isServerless } from "./mongoDB/utils.js";
import { migrateStatusCollection, updateStationFromAPI, updateStationStatusFromAPI } from "./mongoDB/fetch-data.js";

export interface FetchedAPIData {
	stationInformation: StationInformation[] | null;
	// stationInformation: any,
	stationInformationState: StationInformationState | null;
	stationStatus: StationStatus[] | null;
	// stationStatus: any,
	stationStatusState: StationStatusState | null;
}
export interface StationInformation {
	name: string;
	station_id: string;
	address: string;
	cross_street: string;
	lat: number;
	lon: number;
	is_virtual_station: boolean;
	capacity: number;
	station_area: {
		//polygon
		type: string;
		coordinates: any;
	};
	rental_uris: {
		android: string;
		ios: string;
	};
}
export interface StationInformationState {
	last_updated: number;
	ttl: number;
	version: string;
	// data: {
	//   stations: StationInformation
	// },
}
export interface StationStatus {
	station_id: string;
	is_installed: boolean;
	is_renting: boolean;
	is_returning: boolean;
	last_reported: number;
	num_vehicles_available: number;
	num_bikes_available: number;
	num_docks_available: number;
	vehicle_types_available: [
		{
			vehicle_type_id: string;
			count: number;
		}
	];
}

export interface StationStatusState {
	last_updated: number;
	ttl: number;
	version: string;
	// data: {
	//   stations: StationStatus
	// },
}

const app = express();
app.set("trust proxy", 1);

//MongoDB
let url = process.env.MONGODB_URI as string;

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
	url = process.env.MONGODB_URI_DEV as string;
}
// mongoose.set("strictQuery", false);
// (async () => {
// 	try {
// 		await mongoose.connect(url);
// 		console.log("connected to MongoDB");
// 	} catch (error: any) {
// 		console.log("error connecting to MongoDB:", error.message);
// 	}
// })();
// mongoose
// 	.connect(url)
// 	.then((result) => {
// 		console.log("connected to MongoDB");
// 	})
// 	.catch((error) => {
// 		console.log("error connecting to MongoDB:", error.message);
// 	});
///////////////

// let originUrl: string = "https://oslo-city-bikes.vercel.app";
let originUrl: string = "https://oslocitybikes.onrender.com";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
	originUrl = "http://localhost:3000";
}
const corsOptions = {
	origin: originUrl,
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};
// console.log('corsOptions',corsOptions);

app.use(cors(corsOptions));
app.use(express.json());
app.use(requestLogger);
app.get("/favicon.ico", (req, res) => res.sendStatus(204));
app.get("/", (req, res) => res.sendStatus(404));
app.use("/api", router);
app.use(errorHandler);
// app.use(apiKeyChecker);
// app.use(ipWhitelistMiddleware);
// const PORT = process.env.PORT || 3001;
console.log("RUN APP AGAIN");

export const dataStationInformationFetching = async (): Promise<any> => {
	console.log("dataFetching");
	let fetchedData: FetchedAPIData = {
		stationInformation: null,
		stationInformationState: null,
		stationStatus: null,
		stationStatusState: null,
	};
	console.log("dataFetching station_information");
	await APIConnector.getJson("https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json", null).then((data: any) => {
		// console.log('data',data);
		if (data) {
			// console.info(
			// 	"Stations information data is fetched",
			// 	data.headers.date
			// );
			fetchedData.stationInformation = data.data.data.stations;
			fetchedData.stationInformationState = {
				last_updated: data.data.last_updated,
				ttl: data.data.ttl,
				version: data.data.version,
			};
		}
		console.log("data is Fetched station_information");
		// fetchedData.stationInformationState = JSON.parse(data);
	});

	return fetchedData;
};

export const dataStationStatusFetching = async (): Promise<any> => {
	console.log("dataFetching");
	let fetchedData: FetchedAPIData = {
		stationInformation: null,
		stationInformationState: null,
		stationStatus: null,
		stationStatusState: null,
	};
	console.log("dataFetching station_status");
	await APIConnector.getJson("https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json", null).then((data: any) => {
		// console.log('data',data);
		if (data) {
			// console.info("Stations status data is fetched", data.headers.date);
			fetchedData.stationStatus = data.data.data.stations;
			fetchedData.stationStatusState = {
				last_updated: data.data.last_updated,
				ttl: data.data.ttl,
				version: data.data.version,
			};
		}
		console.log("data is Fetched station_status");
	});

	return fetchedData;
};

export const fetchedStationInformationAPIData: FetchedAPIData = await dataStationInformationFetching(); //fetching station_information from API
export const fetchedStationStatusAPIData: FetchedAPIData = await dataStationStatusFetching(); //fetching station_status from API

//////
// Data fetching from API to update the map
if (!process.env.DISABLED_CRON_JOBS) {
	// console.log("process.env.NODE_ENV", process.env.NODE_ENV);
	// cron.schedule("*/1 * * * *", async () => {
	// 	console.log("Starting data fetch...");
	// 	// await dataStationStatusFetching();
	// 	console.log("Data is fetching");

	// 	let apiStatusData = null;
	// 	while (apiStatusData === null) {
	// 		await new Promise((resolve) => setTimeout(resolve, 500));
	// 		apiStatusData = fetchedStationStatusAPIData;
	// 		console.log("status will be added to mongoDB");
	// 	}
	// 	await addApiStatusDataToStationStatusCollection(apiStatusData!);
	// 	let apiData = null;
	// 	// await dataStationInformationFetching();
	// 	while (apiData === null) {
	// 		await new Promise((resolve) => setTimeout(resolve, 500));
	// 		apiData = fetchedStationInformationAPIData.stationInformation;
	// 		console.log("stations will be added to mongoDB");
	// 	}
	// 	// const apiData = fetchedAPIData.stationInformation;
	// 	await connect();
	// 	await updateStationInformationCollection(apiData!);

	// 	console.log("Data is fetching to update mongoDB");
	// 	disconnect();
	// });
	console.log("process.env.NODE_ENV", process.env.NODE_ENV);
	await connect();
	cron.schedule("0 0 * * *", async () => {
		console.log("Starting check stations' list in API and update MongoDB if needed");

		await updateStationFromAPI();
		// await disconnect();
	});
	cron.schedule("*/1 * * * *", async () => {
		console.log("Starting update mongoDb with API data like rentals amount every minute");

		await updateStationStatusFromAPI();
		// await disconnect();
	});
	cron.schedule("59 23 * * 0", async () => {
		console.log("Starting migrate statuses to bulk documents condensing of one week data per station");

		await migrateStatusCollection();
		// await disconnect();
	});
}
// setInterval(() => {
// 	dataStationInformationFetching();
// 	dataStationStatusFetching();
// 	console.log("Data is fetching");
// }, 60 * 1000);
// // //////
// //Data fetching from API to update mongoDB
// setInterval(async () => {
// 	let apiStatusData = null;
// 	while (apiStatusData === null) {
// 		await new Promise((resolve) => setTimeout(resolve, 500));
// 		apiStatusData = fetchedAPIData.stationStatus;
// 		console.log("status will be added to mongoDB");
// 	}
// 	await addApiStatusDataToStationStatusCollection(apiStatusData!);
// 	let apiData = null;
// 	while (apiData === null) {
// 		await new Promise((resolve) => setTimeout(resolve, 500));
// 		apiData = fetchedAPIData.stationInformation;
// 		console.log("stations will be added to mongoDB");
// 	}
// 	// const apiData = fetchedAPIData.stationInformation;
// 	await updateStationInformationCollection(apiData!);
// 	console.log("Data is fetching to update mongoDB");
// }, 60 * 1000);

// //fetching directly from service API
// app.get("/", (request, response) => {
// 	response.send("<h1>Oslo City Bikes server</h1>");
// });

// app.get("/api/station_information", (request, response) => {
// 	response.json(fetchedAPIData.stationInformation);
// });

// app.get("/api/station_information_state", (request, response) => {
// 	try {
// 		response.json(fetchedAPIData.stationInformationState);
// 	} catch (err) {
// 		console.error(err);
// 		response.json({ success: false });
// 	}
// });

// app.get("/api/station_information/:id", (request, response) => {
// 	const id = request.params.id;
// 	let station;
// 	if (fetchedAPIData.stationInformation) {
// 		station = fetchedAPIData.stationInformation.find(
// 			(st) => st.station_id === id
// 		);
// 	} else {
// 		console.log("Data is empty or not fetched from Oslo CityBike API");
// 	}

// 	if (station) {
// 		response.json(station);
// 	} else {
// 		response.status(404).end();
// 	}
// });

// app.get("/api/station_status", (request, response) => {
// 	response.json(fetchedAPIData.stationStatus);
// });

// app.get("/api/station_status_state", (request, response) => {
// 	try {
// 		response.json(fetchedAPIData.stationStatusState);
// 	} catch (err) {
// 		console.error(err);
// 		response.json({ success: false });
// 	}
// });

// app.get("/api/station_status/:id", (request, response) => {
// 	const id = request.params.id;
// 	let station;
// 	if (fetchedAPIData.stationStatus) {
// 		station = fetchedAPIData.stationStatus.find(
// 			(st) => st.station_id === id
// 		);
// 	} else {
// 		console.log("Data is empty or not fetched from Oslo CityBike API");
// 	}

// 	if (station) {
// 		response.json(station);
// 	} else {
// 		response.status(404).end();
// 	}
// });

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

export default app;
