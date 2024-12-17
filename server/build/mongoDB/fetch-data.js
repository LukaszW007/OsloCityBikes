import { dataStationStatusFetching, dataStationInformationFetching, fetchedStationInformationAPIData, fetchedStationStatusAPIData, } from "../index.js";
import { addApiStatusDataToStationStatusCollection, disconnect, updateStationInformationCollection, } from "./mongo.js";
let fetchedAPIData;
// Data fetching from API to update the map
export const updateStationFromAPI = async () => {
    // await connect();
    console.log("Starting data fetch...");
    const fetchedStationInformationAPIData = await dataStationInformationFetching();
    await updateStationInformationCollection(fetchedStationInformationAPIData.stationInformation); //updating stations' list collection
    console.log("Data is fetched");
    await disconnect();
};
// Data fetching from API to update the map
export const updateStationStatusFromAPI = async () => {
    // await connect();
    console.log("Starting data fetch...");
    const fetchedStationStatusAPIData = await dataStationStatusFetching();
    await addApiStatusDataToStationStatusCollection(fetchedStationStatusAPIData.stationStatus); //updating statuses collection
    console.log("Data is fetched");
    await disconnect();
};
export const updateMongoDB = async () => {
    // console.log("Starting data fetch...");
    // const fetchedAPIData: FetchedAPIData = await dataFetching();
    // console.log("Data is fetched");
    // let apiStatusData = null;
    // while (apiStatusData === null) {
    // 	await new Promise((resolve) => setTimeout(resolve, 500));
    // 	apiStatusData = fetchedAPIData.stationStatus;
    // 	console.log("status will be added to mongoDB");
    // }
    await addApiStatusDataToStationStatusCollection(fetchedStationStatusAPIData.stationStatus); //updating statuses collection
    // let apiData = null;
    // while (apiData === null) {
    // 	await new Promise((resolve) => setTimeout(resolve, 500));
    // 	apiData = fetchedAPIData.stationInformation;
    // 	console.log("stations will be added to mongoDB");
    // }
    // const apiData = fetchedAPIData.stationInformation;
    await updateStationInformationCollection(fetchedStationInformationAPIData.stationInformation); //updating stations' list collection
    console.log("Data is fetching to update mongoDB");
};
