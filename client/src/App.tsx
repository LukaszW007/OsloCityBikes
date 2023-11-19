import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {Xhr} from "./Utils/Xhr";
import {StationsList} from "./Components/StationsList";
import {Spinner} from "./Components/Spinner";
import {MapLeaflet} from "./Components/Map";
import {Helmet} from "react-helmet";

export enum ValuesToParse {
  station_id = 'station_id',
  name = 'name',
  address = 'address',
  capacity = 'capacity',
  num_docks_available = 'num_docks_available',
  num_bikes_available = 'num_bikes_available',
}

export enum TypeOfFetchedData {
  list = 'list',
  status = 'status'
}
let refreshingCount = 0;
let stationsListUrl: string, stationsListUpdatingTimeUrl: string, stationsStatusUrl: string, stationsStatusUpdatingTimeUrl : string
const APIVersion = '2.3';

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  // dev code
  stationsListUrl = 'http://localhost:3001/api/station_information';
  stationsListUpdatingTimeUrl = 'http://localhost:3001/api/station_information_state';
  stationsStatusUrl = 'http://localhost:3001/api/station_status';
  stationsStatusUpdatingTimeUrl = 'http://localhost:3001/api/station_status_state'
} else {
  // production code
  stationsListUrl = 'https://oslo-city-bikes-server.vercel.app/api/station_information';
  stationsListUpdatingTimeUrl = 'https://oslo-city-bikes-server.vercel.app/api/station_information_state';
  stationsStatusUrl = 'https://oslo-city-bikes-server.vercel.app/api/station_status';
  stationsStatusUpdatingTimeUrl = 'https://oslo-city-bikes-server.vercel.app/api/station_status_state'
}

function App(props: any) {
  const [isFetchedStationInfoData, setIsFetchedStationInfoData] = useState(false);
  const [isFetchedStationStatusData, setIsFetchedStationStatusData] = useState(false);
  const [fetchedStationInfoData, setFetchedStationInfoData] = useState(null);
  const [fetchedStationStatusData, setFetchedStationStatusData] = useState(null);
  const [stationsListLastUpdate, setStationsListLastUpdate] = useState(null);
  const [stationsStatusLastUpdate, setStationsStatusLastUpdate] = useState(null);
  
  const interval = useRef<any>(null);
  
  useEffect(() => {
    if (!isFetchedStationInfoData && !isFetchedStationStatusData) {
      dataStatesFetching(); // fetch on component mount
    }

  }, []);
  useEffect(() => {
    interval.current = setInterval(() => {
      dataStatesFetching()
    },(60*1000)); // fetching data every 5min to update the table

    return () => {
      clearInterval(interval.current);
    }
  }, [fetchedStationInfoData, fetchedStationStatusData]);

  
  const isDataValid = (fetchedDataTime: number, savedDataTime: number): boolean => {
    return fetchedDataTime > savedDataTime ? false : true
  }

  const dataStatesFetching = async (): Promise<void> => {
    await Xhr.getJson(stationsListUpdatingTimeUrl, null)
    .then((data) => {
      if (data && data.data != null) {
        if (data.data.version === APIVersion) {
          if (stationsListLastUpdate) {
            if (isDataValid(data.data.last_updated, stationsListLastUpdate)) {
              console.info('Stations information data is up to date');
              return
            } else {
              dataFetching(TypeOfFetchedData.list, stationsListUrl);
            }
          } else {
            setStationsListLastUpdate(data.data.last_updated);
            dataFetching(TypeOfFetchedData.list, stationsListUrl);
          }
        }
        refreshingCount = 0;
      } else {
        if (refreshingCount < 5) {
          dataStatesFetching();
          refreshingCount++;
        }
      }
      
    })
    await Xhr.getJson(stationsStatusUpdatingTimeUrl, null)
    .then((data) => {
      if (data && data.data != null) {
        if (data.data.version === APIVersion) {
          if (stationsStatusLastUpdate) {
            if (isDataValid(data.data.last_updated, stationsStatusLastUpdate)) {
              console.info('Stations status data is up to date');
              return
            } else {
              dataFetching(TypeOfFetchedData.status, stationsStatusUrl);
            }
          } else {
            setStationsStatusLastUpdate(data.data.last_updated);
            dataFetching(TypeOfFetchedData.status, stationsStatusUrl);
          }
        }
        refreshingCount = 0;
      } else {
        if (refreshingCount < 5) {
          dataStatesFetching();
          refreshingCount++;
        }
      }
    })
    
  }
  const dataFetching = async (type: TypeOfFetchedData, url: string): Promise<void> => {
    await Xhr.getJson(url, null)
      .then((data) => {
        if (data && type === TypeOfFetchedData.list) {
          setFetchedStationInfoData(data.data);
          setIsFetchedStationInfoData(true);
        } else if (data && type === TypeOfFetchedData.status) {
          setFetchedStationStatusData(data.data);
          setIsFetchedStationStatusData(true);
        }
        
      })
  }


  //Elements to render
  const stationsList = fetchedStationInfoData && fetchedStationStatusData ?
    <StationsList info={fetchedStationInfoData} status={fetchedStationStatusData} pageId = {props.pageId}/> : <Spinner />

  return (
    <div className="flex flex-col items-center h-[100vh]">
      <Helmet>
                <meta charSet="utf-8" />
                <title>Oslo City Bikes</title>
                <link rel="icon" type="image/png" href="bicycle_white_background.svg" sizes="16x16" />
      </Helmet>
      <div className='header'>
        <h1 className="flex text-center text-3xl font-bold text-custom-blue">
          Oslo City Bikes
        </h1>
      </div>
      <div className='relative flex sm:flex-col md:flex-col lg:flex-row w-[100vw] h-[100vh]'>
        <div className="">
          <MapLeaflet />
        </div>
        <div className="relative lg:w-[40vw] md:w-[90vw] sm:w-[90vw] flex flex-col justify-items-center ml-8">
          {stationsList}
        </div>
      </div>
    </div>
  );
}

export default App;
