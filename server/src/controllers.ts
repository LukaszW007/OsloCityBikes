import { Request, Response } from "express";
import { fetchedStationStatusAPIData, FetchedAPIData, fetchedStationInformationAPIData } from "./index.js";

// const fetchedAPIData: FetchedAPIData = await dataFetching();
export const maxDuration = 60;
export const dynamic = "force-dynamic";
export const getStationInformation = async (request: Request, response: Response) => {
	// const fetchedAPIData: FetchedAPIData = await dataFetching();
	response.json(fetchedStationInformationAPIData.stationInformation);
};

export const getStationInformationState = async (request: Request, response: Response) => {
	try {
		// const fetchedAPIData: FetchedAPIData = await dataFetching();
		response.json(fetchedStationInformationAPIData.stationInformationState);
	} catch (err) {
		console.error(err);
		response.json({ success: false });
	}
};

export const getStationInformationById = async (request: Request, response: Response) => {
	const id = request.params.id;
	let station;
	// const fetchedAPIData: FetchedAPIData = await dataFetching();
	if (fetchedStationInformationAPIData.stationInformation) {
		station = fetchedStationInformationAPIData.stationInformation.find((st) => st.station_id === id);
	} else {
		console.log("Data is empty or not fetched from Oslo CityBike API");
	}

	if (station) {
		response.json(station);
	} else {
		response.sendStatus(404).end();
	}
};

export const getStationStatus = async (request: Request, response: Response) => {
	// const fetchedAPIData: FetchedAPIData = await dataFetching();
	response.json(fetchedStationStatusAPIData.stationStatus);
};

export const getStationStatusState = async (request: Request, response: Response) => {
	try {
		// const fetchedAPIData: FetchedAPIData = await dataFetching();
		response.json(fetchedStationStatusAPIData.stationStatusState);
	} catch (err) {
		console.error(err);
		response.json({ success: false });
	}
};

export const getStationStatusById = async (request: Request, response: Response) => {
	const id = request.params.id;
	// const fetchedAPIData: FetchedAPIData = await dataFetching();
	let station;
	if (fetchedStationStatusAPIData.stationStatus) {
		station = fetchedStationStatusAPIData.stationStatus.find((st) => st.station_id === id);
	} else {
		console.log("Data is empty or not fetched from Oslo CityBike API");
	}

	if (station) {
		response.json(station);
	} else {
		response.sendStatus(404).end();
	}
};
