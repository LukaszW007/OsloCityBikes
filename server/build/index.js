import express from 'express';
import APIConnector from './connectors/axiosConnector.js';
import { requestLogger, unknownEndpoint } from './utils/middleware.js';
import cors from 'cors';
export const app = express();
let originUrl = 'https://oslo-city-bikes.vercel.app';
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    originUrl = 'http://localhost:3000';
}
const corsOptions = {
    origin: originUrl,
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200
};
// console.log('corsOptions',corsOptions);
app.use(cors(corsOptions));
app.use(requestLogger);
app.use(express.json());
// const PORT = process.env.PORT || 3001;
const dataFetching = async () => {
    let fetchedData = { stationInformation: null, stationInformationState: null, stationStatus: null, stationStatusState: null };
    APIConnector.getJson('https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json', null)
        .then((data) => {
        // console.log('data',data);
        if (data) {
            console.info('Stations information data is fetched', data.headers.date);
            fetchedData.stationInformation = data.data.data.stations;
            fetchedData.stationInformationState = {
                last_updated: data.data.last_updated,
                ttl: data.data.ttl,
                version: data.data.version,
            };
        }
        // fetchedData.stationInformationState = JSON.parse(data);
    });
    APIConnector.getJson('https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json', null)
        .then((data) => {
        // console.log('data',data);
        if (data) {
            console.info('Stations status data is fetched', data.headers.date);
            fetchedData.stationStatus = data.data.data.stations;
            fetchedData.stationStatusState = {
                last_updated: data.data.last_updated,
                ttl: data.data.ttl,
                version: data.data.version,
            };
        }
    });
    return fetchedData;
};
const fetchedAPIData = await dataFetching();
setInterval(() => {
    dataFetching();
    console.log('Data is fetching');
}, (60 * 1000));
app.get("/", (request, response) => {
    response.send("<h1>Hello World!</h1>");
});
app.get("/api/station_information", (request, response) => {
    response.json(fetchedAPIData.stationInformation);
});
app.get("/api/station_information_state", (request, response) => {
    response.json(fetchedAPIData.stationInformationState);
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
app.get("/api/station_status_state", (request, response) => {
    response.json(fetchedAPIData.stationStatusState);
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
