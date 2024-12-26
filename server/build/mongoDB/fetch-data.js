import { dataStationStatusFetching, dataStationInformationFetching, fetchedStationInformationAPIData, fetchedStationStatusAPIData, } from "../index.js";
import { addApiStatusDataToStationStatusCollection, connect, disconnect, updateStationInformationCollection, } from "./mongo.js";
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
    connect();
    console.log("Starting data fetch...");
    const fetchedStationStatusAPIData = await dataStationStatusFetching();
    // saving fetched API data into mongoDB
    await addApiStatusDataToStationStatusCollection(fetchedStationStatusAPIData); //updating statuses collection
    console.log("Data is fetched");
    disconnect();
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
