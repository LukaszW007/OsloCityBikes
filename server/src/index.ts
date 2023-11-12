import express from 'express';
import APIConnector from './connectors/axiosConnector.js'
import {requestLogger, unknownEndpoint, errorHandler} from './utils/middleware.js';
import cors from 'cors';

export interface FetchedAPIData {
  stationInformation: StationInformation[] | null,
  // stationInformation: any,
  stationInformationState: StationInformationState | null,
  stationStatus: StationStatus[] | null,
  // stationStatus: any,
  stationStatusState: StationStatusState | null,
}
export interface StationInformation {
  name: string,
  station_id: string,
  address: string,
  lat: number,
  lon: number,
  is_virtual_station: boolean,
  capacity: number,
  station_area: {
  type: string,
  coordinates: any,
  },
  rental_uris: {
  android: string,
  ios: string
  }
}
export interface StationInformationState {
  last_updated: number,
  ttl: number,
  version: string,
  // data: {
  //   stations: StationInformation
  // },
}
export interface StationStatus {
  station_id: string,
  is_installed: boolean,
  is_renting: boolean,
  is_returning: boolean,
  last_reported: number,
  num_vehicles_available: number,
  num_bikes_available: number,
  num_docks_available: number,
  vehicle_types_available: [
  {
  vehicle_type_id: string,
  count: number
  }
  ]
}

export interface StationStatusState {
  last_updated: number,
  ttl: number,
  version: string,
  // data: {
  //   stations: StationStatus
  // },
}

export const app = express();

let originUrl: string = 'https://oslo-city-bikes.vercel.app';

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  originUrl = 'http://localhost:3000'
}
const corsOptions ={
  origin: originUrl, 
  credentials: false,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}
console.log('corsOptions',corsOptions);

app.use(cors(corsOptions));
app.use(requestLogger)
app.use(express.json())
// const PORT = process.env.PORT || 3001;

const dataFetching = async (): Promise<any> => {
  let fetchedData: FetchedAPIData = {stationInformation: null, stationInformationState: null, stationStatus: null, stationStatusState: null};
  APIConnector.getJson('https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json', null)
  .then((data: any) => {
    // console.log('data',data);
    if (data) {
      console.info('Stations information data is fetched', data.headers.date);
      fetchedData.stationInformation = data.data.data.stations;
      fetchedData.stationInformationState = {
      last_updated: data.data.last_updated,
      ttl: data.data.ttl,
      version: data.data.version,
      } 
    }
    

    // fetchedData.stationInformationState = JSON.parse(data);
    
  })
  APIConnector.getJson('https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json', null)
  .then((data: any) => {
    // console.log('data',data);
    if (data) {
      console.info('Stations status data is fetched', data.headers.date);
      fetchedData.stationStatus = data.data.data.stations;
      fetchedData.stationStatusState = {
      last_updated: data.data.last_updated,
      ttl: data.data.ttl,
      version: data.data.version,
      }
    }
  })

  return fetchedData;
}
const fetchedAPIData: FetchedAPIData = await dataFetching();

setInterval(() => {
  dataFetching();
  console.log('Data is fetching')
},(60*1000));

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
  let station
  if (fetchedAPIData.stationInformation) {
  station = fetchedAPIData.stationInformation.find(st => st.station_id === id)
  } else {
  console.log('Data is empty or not fetched from Oslo CityBike API',);
  }

  if (station) {
  response.json(station);
  } else {
  response.status(404).end()
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
  let station
  if (fetchedAPIData.stationStatus) {
  station = fetchedAPIData.stationStatus.find(st => st.station_id === id)
  } else {
  console.log('Data is empty or not fetched from Oslo CityBike API',);
  }
  
  if (station) {
  response.json(station);
  } else {
  response.status(404).end()
  }
});

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
