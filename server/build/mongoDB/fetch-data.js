import { dataStationStatusFetching, dataStationFetching, } from "../index.js";
import { addApiStatusDataToStationsInfoCollection, connect, disconnect, updateStationsCollection, } from "./mongo.js";
let fetchedAPIData;
// Data fetching from API to update the map
export const updateStationFromAPI = async () => {
    await connect();
    console.log("Starting data fetch...");
    const fetchedStationAPIData = await dataStationFetching();
    await addApiStatusDataToStationsInfoCollection(fetchedStationAPIData.stationStatus); //updating statuses collection
    console.log("Data is fetched");
    await disconnect();
};
// Data fetching from API to update the map
export const updateStationStatusFromAPI = async () => {
    await connect();
    console.log("Starting data fetch...");
    const fetchedStationStatusAPIData = await dataStationStatusFetching();
    await updateStationsCollection(fetchedStationStatusAPIData.stationInformation); //updating stations' list collection
    console.log("Data is fetched");
    await disconnect();
};
// export const updateMongoDB = async () => {
// 	// console.log("Starting data fetch...");
// 	// const fetchedAPIData: FetchedAPIData = await dataFetching();
// 	// console.log("Data is fetched");
// 	// let apiStatusData = null;
// 	// while (apiStatusData === null) {
// 	// 	await new Promise((resolve) => setTimeout(resolve, 500));
// 	// 	apiStatusData = fetchedAPIData.stationStatus;
// 	// 	console.log("status will be added to mongoDB");
// 	// }
// 	await addApiStatusDataToStationsInfoCollection(
// 		fetchedAPIData.stationStatus!
// 	); //updating statuses collection
// 	// let apiData = null;
// 	// while (apiData === null) {
// 	// 	await new Promise((resolve) => setTimeout(resolve, 500));
// 	// 	apiData = fetchedAPIData.stationInformation;
// 	// 	console.log("stations will be added to mongoDB");
// 	// }
// 	// const apiData = fetchedAPIData.stationInformation;
// 	await updateStationsCollection(fetchedAPIData.stationInformation!); //updating stations' list collection
// 	console.log("Data is fetching to update mongoDB");
// };
