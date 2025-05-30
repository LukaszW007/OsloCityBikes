/* eslint-disable padded-blocks */
/* eslint-disable max-len */
/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";
import functions from 'firebase-functions';
// Start writing functions
// https://firebase.google.com/docs/functions/typescript
// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
import express from 'express';
import { APIConnector } from './connectors/axiosConnector.js'; //.js file extensions are now allowed
import { requestLogger, unknownEndpoint } from './utils/middleware.js';
import cors from 'cors';
const app = express();
app.use(cors());
app.use(requestLogger);
app.use(express.json());
// const PORT = process.env.PORT || 3001;
const dataFetching = async () => {
  const fetchedData = { stationInformation: null, stationInformationState: null, stationStatus: null, stationStatusState: null };
  APIConnector.getJson('https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json', null)
    .then((data) => {
    // console.log('data',data);
    fetchedData.stationInformation = data.data.data.stations;
    fetchedData.stationInformationState = {
      last_updated: data.data.last_updated,
      ttl: data.data.ttl,
      version: data.data.version,
    };
    // fetchedData.stationInformationState = JSON.parse(data);
  });
  APIConnector.getJson('https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json', null)
    .then((data) => {
    // console.log('data',data);
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
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});
app.get('/api/station_information', (request, response) => {
  response.json(fetchedAPIData.stationInformation);
});
app.get('/api/station_information/:id', (request, response) => {
  const id = request.params.id;
  let station;
  if (fetchedAPIData.stationInformation) {
    station = fetchedAPIData.stationInformation.find((st) => st.station_id === id);
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
app.get('/api/station_status', (request, response) => {
  response.json(fetchedAPIData.stationStatus);
});
app.get('/api/station_status/:id', (request, response) => {
  const id = request.params.id;
  let station;
  if (fetchedAPIData.stationStatus) {
    station = fetchedAPIData.stationStatus.find((st) => st.station_id === id);
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
export const application = functions.https.onRequest(app);
