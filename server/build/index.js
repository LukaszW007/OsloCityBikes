import express from 'express';
import APIConnector from './connectors/axiosConnector.js';
import { requestLogger, unknownEndpoint } from './utils/middleware.js';
import cors from 'cors';
export const app = express();
app.use(cors());
app.use(requestLogger);
app.use(express.json());
const dataFetching = async () => {
    let fetchedData = { stationInformation: null, stationInformationState: null, stationStatus: null, stationStatusState: null };
    APIConnector.getJson('https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json', null)
        .then((data) => {
        fetchedData.stationInformation = data.data.data.stations;
        fetchedData.stationInformationState = {
            last_updated: data.data.last_updated,
            ttl: data.data.ttl,
            version: data.data.version,
        };
    });
    APIConnector.getJson('https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json', null)
        .then((data) => {
        fetchedData.stationStatus = data.data.data.stations;
        fetchedData.stationStatusState = {
            last_updated: data.data.last_updated,
            ttl: data.data.ttl,
            version: data.data.version,
        };
    });
    return fetchedData;
};
const fetchedAPIData = await dataFetching();
app.get("/", (request, response) => {
    response.send("<h1>Hello World!</h1>");
});
app.get("/api/station_information", (request, response) => {
    response.json(fetchedAPIData.stationInformation);
});
app.get("/api/station_information/:id", (request, response) => {
    const id = request.params.id;
    let station;
    if (fetchedAPIData.stationInformation) {
        station = fetchedAPIData.stationInformation.find(st => st.station_id === id);
    }
    else {
        console.log('Data is empty or not fetched from Oslo CityBike API');
    }
    if (station) {
        response.json(station);
    }
    else {
        response.status(404).end();
    }
});
app.get("/api/station_status", (request, response) => {
    response.json(fetchedAPIData.stationStatus);
});
app.get("/api/station_status/:id", (request, response) => {
    const id = request.params.id;
    let station;
    if (fetchedAPIData.stationStatus) {
        station = fetchedAPIData.stationStatus.find(st => st.station_id === id);
    }
    else {
        console.log('Data is empty or not fetched from Oslo CityBike API');
    }
    if (station) {
        response.json(station);
    }
    else {
        response.status(404).end();
    }
});
app.use(unknownEndpoint);
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
