import { dataStationStatusFetching, dataStationInformationFetching, fetchedStationInformationAPIData, fetchedStationStatusAPIData, } from "../index.js";
import { addApiStatusDataToStationStatusCollection, connect, disconnect, migrateData, UpdateCountStatus, updateStationInformationCollection, } from "./mongo.js";
import mongoose from "mongoose";
let fetchedAPIData;
// Data fetching from API to update the map
export const updateStationFromAPI = async (request, response) => {
    connect();
    console.log("Starting data fetch...");
    const fetchedStationInformationAPIData = await dataStationInformationFetching();
    // Ensure MongoDB connection is still established before saving data
    while (mongoose.connection.readyState !== 1) {
        console.log("Waiting for MongoDB connection to be re-established...");
        await new Promise((resolve) => setTimeout(resolve, 10));
    }
    await updateStationInformationCollection(fetchedStationInformationAPIData.stationInformation); //updating stations' list collection
    console.log("Data is fetched");
    disconnect();
    response.status(200);
};
// Data fetching from API to update the map
export const updateStationStatusFromAPI = async (request, response) => {
    connect();
    console.log("Starting data fetch...");
    const fetchedStationStatusAPIData = await dataStationStatusFetching();
    // Ensure MongoDB connection is still established before saving data
    while (mongoose.connection.readyState !== 1) {
        console.log("Waiting for MongoDB connection to be re-established...");
        await new Promise((resolve) => setTimeout(resolve, 10));
    }
    // saving fetched API data into mongoDB
    const updatesNumber = await addApiStatusDataToStationStatusCollection(fetchedStationStatusAPIData); //updating statuses collection
    await updateCountStatus(updatesNumber);
    console.log("Data is fetched");
    disconnect();
    response.status(200);
};
export const updateCountStatus = async (updatesNumber) => {
    const updateStatus = new UpdateCountStatus({ updates: updatesNumber });
    await updateStatus.save();
};
// Data fetching from API to update the map
export const migrateStatusCollection = async (request, response) => {
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
    await addApiStatusDataToStationStatusCollection(fetchedStationStatusAPIData); //updating statuses collection
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
