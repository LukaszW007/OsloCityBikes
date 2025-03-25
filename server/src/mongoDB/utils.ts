import mongoose from "mongoose";
import { StationStatus } from "../app.js";
import { UpdateCountStatus } from "./mongo.js";

export interface IStationsStatus {
	name: string;
	station_id: string;
	num_bikes_available: number;
	num_docks_available: number;
	capacity: number;
	apiLastUpdate: number;
	dayStamp: number;
	timeStamp: Date;
}

let url = process.env.MONGODB_URI as string;

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
	url = process.env.MONGODB_URI_DEV as string;
	console.log("Connecting to DEVELOPMENT mongoDB", process.env.NODE_ENV);
	console.log("Connecting to DEVELOPMENT mongoDB", url);
}

const options = {
	serverSelectionTimeoutMS: 25000, // Increase the timeout to 25 seconds
};

export const connect = async () => {
	try {
		await mongoose.connect(url, options);
		console.log("connected to MongoDB with url: ", url);
	} catch (error: any) {
		console.log("error connecting to MongoDB:", error.message);
	}
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

// Function to check if status has changed
export const hasStatusChanged = (fetchedStatuses: StationStatus[], statusesFromMongo: IStationsStatus[], stationId: string) => {
	const statusesOfStation = statusesFromMongo.filter((status) => status.station_id === stationId);
	if (statusesOfStation && statusesOfStation.length === 0) {
		return true;
	}

	const lastStatus = statusesOfStation.reduce((latest, current) => {
		return current.timeStamp > latest.timeStamp ? current : latest;
	}, statusesOfStation[0]);

	const statusFromApi = fetchedStatuses.find((status) => status.station_id === stationId);
	const dateOfStatusFromApiLastUpdate = statusFromApi ? new Date(statusFromApi?.last_reported * 1000) : undefined;
	// console.log("lastStatus ", lastStatus);
	// console.log("lastStatus.apiLastUpdate ", lastStatus.apiLastUpdate);
	const apiLastUpdateDate = new Date(lastStatus.apiLastUpdate * 1000);
	//Status is changed only when number of bikes or available docks are changed
	return (
		apiLastUpdateDate !== dateOfStatusFromApiLastUpdate &&
		(lastStatus.num_bikes_available !== statusFromApi?.num_bikes_available ||
			lastStatus.num_docks_available !== statusFromApi?.num_docks_available)
	);
};

export const getCurrentWeek = (timeStamp: Date): number => {
	const d = new Date(timeStamp);
	let yearStart = +new Date(d.getFullYear(), 0, 1);
	let today = +new Date(d.getFullYear(), d.getMonth(), d.getDate());
	let dayOfYear = (today - yearStart + 1) / 86400000;
	let week = Math.ceil(dayOfYear / 7);
	return week;
};

// Environment-based route configuration
export const isServerless = process.env.DEPLOYMENT_ENV && process.env.DEPLOYMENT_ENV === "serverless";
