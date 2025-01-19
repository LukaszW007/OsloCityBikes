import { Request, Response } from "express";
import {
	dataStationStatusFetching,
	dataStationInformationFetching,
	fetchedStationInformationAPIData,
	fetchedStationStatusAPIData,
	StationInformation,
	FetchedAPIData,
} from "../index.js";
import {
	addApiStatusDataToStationStatusCollection,
	deleteAllInCollection,
	migrateData,
	Station,
	StationsStatus,
	UpdateCountStatus,
	updateStationInformationCollection,
} from "./mongo.js";
import mongoose from "mongoose";
import { connect, disconnect } from "./utils.js";

let fetchedAPIData: FetchedAPIData;

// Data fetching from API to update the map
export const updateStationFromAPI = async (request: Request, response: Response) => {
	connect();
	console.log("Starting data fetch...");
	const fetchedStationInformationAPIData: FetchedAPIData = await dataStationInformationFetching();

	// Ensure MongoDB connection is still established before saving data
	while (mongoose.connection.readyState !== 1) {
		console.log("Waiting for MongoDB connection to be re-established...");
		await new Promise((resolve) => setTimeout(resolve, 10));
	}

	await updateStationInformationCollection(fetchedStationInformationAPIData.stationInformation!); //updating stations' list collection
	console.log("Data is fetched");
	disconnect();
	response.status(200);
};

// Data fetching from API to update the map
export const updateStationStatusFromAPI = async (request: Request, response: Response) => {
	connect();
	console.log("Starting data fetch...");
	const fetchedStationStatusAPIData: FetchedAPIData = await dataStationStatusFetching();

	// Ensure MongoDB connection is still established before saving data
	while (mongoose.connection.readyState !== 1) {
		console.log("Waiting for MongoDB connection to be re-established...");
		await new Promise((resolve) => setTimeout(resolve, 10));
	}
	// saving fetched API data into mongoDB
	const updatesNumber = await addApiStatusDataToStationStatusCollection(fetchedStationStatusAPIData!); //updating statuses collection
	// await updateCountStatus(updatesNumber);
	console.log("Data is fetched");
	disconnect();
	response.status(200).json({ updates: updatesNumber });
};

export const updateCountStatus = async (updatesNumber: number) => {
	const updateStatus = new UpdateCountStatus({ updates: updatesNumber });
	await updateStatus.save();
};

// Data fetching from API to update the map
export const migrateStatusCollection = async (request: Request, response: Response) => {
	await connect();
	console.log("Starting migration");

	await migrateData();
	console.log("Data is migrated");
	disconnect();
	response.status(200);
};

// Data fetching from API to update the map
export const mongoCheck = async () => {
	const example = [
		{
			station_id: "5220",
			is_installed: true,
			is_renting: true,
			is_returning: true,
			last_reported: 1734463072,
			num_vehicles_available: 0,
			num_bikes_available: 0,
			num_docks_available: 20,
			vehicle_types_available: [{ vehicle_type_id: "bike", count: 0 }],
		},
	];

	// await addApiStatusDataToStationStatusCollection(example);
	await disconnect();
};

export const updateMongoDB = async (request: Request, response: Response) => {
	await connect();

	await addApiStatusDataToStationStatusCollection(fetchedStationStatusAPIData!); //updating statuses collection
	await updateStationInformationCollection(fetchedStationInformationAPIData.stationInformation!); //updating stations' list collection

	console.log("Data is fetching to update mongoDB");
	disconnect();
	response.sendStatus(200);
};

export const getStations = async (request: Request, response: Response) => {
	await connect();
	const stationsFromMongo = await Station.find().exec();
	disconnect();
	response.sendStatus(200).json(stationsFromMongo);
};

export const getStationsInfo = async (request: Request, response: Response) => {
	await connect();
	let collectionStatusData = await StationsStatus.find().lean(true);
	// if (collectionStatusData.length <= 0) {
	// 	const apiStatusData = await fetchedAPIData.stationStatus;
	// 	await addApiStatusDataToStationStatusCollection(apiStatusData!);
	// 	collectionStatusData = await StationsStatus.find().lean(true);
	// 	console.log("Added new info about stations to DB");
	// }
	disconnect();
	response.sendStatus(200).json(collectionStatusData);
};

export const deleteAllStationsInfo = async (request: Request, response: Response) => {
	await deleteAllInCollection();
	const collectionStatusData = await StationsStatus.find().lean(true);
	response.sendStatus(200).json(collectionStatusData);
};

export const getStationsInfoById = async (request: Request, response: Response) => {
	await connect();
	const id = request.params.id;
	StationsStatus.find({
		station_id: id,
	})
		.lean(true)
		.then((station) => {
			disconnect();
			if (station.length > 0) {
				response.sendStatus(200).json(station);
			} else {
				response.sendStatus(404).end();
			}
		})
		.catch((error) => {
			console.log(error);
			disconnect();
			response.sendStatus(500).end();
		});
};
