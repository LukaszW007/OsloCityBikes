import { fetchedStationStatusAPIData, fetchedStationAPIData, } from "./index.js";
import { StationInfo, deleteAllInCollection, updateStationsCollection, } from "./mongoDB/mongo.js";
// const fetchedAPIData: FetchedAPIData = await dataFetching();
export const getStationInformation = async (request, response) => {
    // const fetchedAPIData: FetchedAPIData = await dataFetching();
    response.json(fetchedStationAPIData.stationInformation);
};
export const getStationInformationState = async (request, response) => {
    try {
        // const fetchedAPIData: FetchedAPIData = await dataFetching();
        response.json(fetchedStationAPIData.stationInformationState);
    }
    catch (err) {
        console.error(err);
        response.json({ success: false });
    }
};
export const getStationInformationById = async (request, response) => {
    const id = request.params.id;
    let station;
    // const fetchedAPIData: FetchedAPIData = await dataFetching();
    if (fetchedStationAPIData.stationInformation) {
        station = fetchedStationAPIData.stationInformation.find((st) => st.station_id === id);
    }
    else {
        console.log("Data is empty or not fetched from Oslo CityBike API");
    }
    if (station) {
        response.json(station);
    }
    else {
        response.status(404).end();
    }
};
export const getStationStatus = async (request, response) => {
    // const fetchedAPIData: FetchedAPIData = await dataFetching();
    response.json(fetchedStationStatusAPIData.stationStatus);
};
export const getStationStatusState = async (request, response) => {
    try {
        // const fetchedAPIData: FetchedAPIData = await dataFetching();
        response.json(fetchedStationStatusAPIData.stationStatusState);
    }
    catch (err) {
        console.error(err);
        response.json({ success: false });
    }
};
export const getStationStatusById = async (request, response) => {
    const id = request.params.id;
    // const fetchedAPIData: FetchedAPIData = await dataFetching();
    let station;
    if (fetchedStationStatusAPIData.stationStatus) {
        station = fetchedStationStatusAPIData.stationStatus.find((st) => st.station_id === id);
    }
    else {
        console.log("Data is empty or not fetched from Oslo CityBike API");
    }
    if (station) {
        response.json(station);
    }
    else {
        response.status(404).end();
    }
};
////////////////////
//fething from Mongo
////////////////////
// export const getStations = async (request: Request, response: Response) => {
// 	let collectionData = await Station.find().lean(true);
// 	// const fetchedAPIData: FetchedAPIData = await dataFetching();
// 	if (collectionData.length <= 0) {
// 		const apiData = await fetchedAPIData.stationInformation;
// 		await updateStationsCollection(apiData!);
// 		collectionData = await Station.find().lean(true);
// 	}
// 	response.json(collectionData);
// };
export const getStations = async (request, response) => {
    const apiData = await fetchedStationAPIData.stationInformation;
    await updateStationsCollection(apiData);
};
export const getStationsInfo = async (request, response) => {
    let collectionStatusData = await StationInfo.find().lean(true);
    // if (collectionStatusData.length <= 0) {
    // 	const apiStatusData = await fetchedAPIData.stationStatus;
    // 	await addApiStatusDataToStationsInfoCollection(apiStatusData!);
    // 	collectionStatusData = await StationInfo.find().lean(true);
    // 	console.log("Added new info about stations to DB");
    // }
    response.json(collectionStatusData);
};
export const deleteAllStationsInfo = async (request, response) => {
    await deleteAllInCollection();
    const collectionStatusData = await StationInfo.find().lean(true);
    response.json(collectionStatusData);
};
export const getStationsInfoById = async (request, response) => {
    const id = request.params.id;
    StationInfo.find({
        station_id: id,
    })
        .lean(true)
        .then((station) => {
        if (station.length > 0) {
            response.json(station);
        }
        else {
            response.status(404).end();
        }
    })
        .catch((error) => {
        console.log(error);
        response.status(500).end();
    });
};
