import express from 'express';
import APIConnector from './connectors/axiosConnector.ts'
import {requestLogger, unknownEndpoint, errorHandler} from './utils/middleware.ts';
import cors from 'cors';

export interface FetchedAPIData {
  stationInformation: null,
  stationStatus: null
}


const app = express();
app.use(cors());
app.use(requestLogger)
app.use(express.json())
// const PORT = process.env.PORT || 3001;

const dataFetching = async (): Promise<any> => {
  let fetchedData: FetchedAPIData = {stationInformation: null, stationStatus: null};
  APIConnector.getJson('https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json', null)
    .then((data: any) => {
      // console.log('data',data);
      fetchedData.stationInformation = data.data;
        
    })
  APIConnector.getJson('https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json', null)
    .then((data: any) => {
      // console.log('data',data);
      fetchedData.stationStatus = data.data;
    })

  return fetchedData;
}
const fetchedAPIData: FetchedAPIData = await dataFetching();

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/station_information", (request, response) => {
  response.json(fetchedAPIData.stationInformation);
});

app.get("/api/station_status", (request, response) => {
  response.json(fetchedAPIData.stationStatus);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
