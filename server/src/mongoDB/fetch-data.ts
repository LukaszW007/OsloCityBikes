import { dataFetching, FetchedAPIData, StationInformation } from "../index.js";
import {
	addApiDataToStationsCollection,
	addApiStatusDataToStationsInfoCollection,
	connect,
	disconnect,
	Station,
	updateStationsCollection,
} from "./mongo.js";

// Data fetching from API to update the map
export const updateMongoDB = async () => {
	console.log("Starting data fetch...");
	const fetchedAPIData: FetchedAPIData = await dataFetching();
	console.log("Data is fetched");

	let apiStatusData = null;
	while (apiStatusData === null) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		apiStatusData = fetchedAPIData.stationStatus;
		console.log("status will be added to mongoDB");
	}
	await addApiStatusDataToStationsInfoCollection(apiStatusData!); //updating statuses collection
	let apiData = null;
	while (apiData === null) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		apiData = fetchedAPIData.stationInformation;
		console.log("stations will be added to mongoDB");
	}
	// const apiData = fetchedAPIData.stationInformation;
	await updateStationsCollection(apiData!); //updating stations' list collection
	console.log("Data is fetching to update mongoDB");
};
