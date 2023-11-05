import React, {useEffect, useState} from 'react';
import './App.css';
import {Xhr} from "./Utils/Xhr";
import {StationsList} from "./Components/StationsList";
import {Spinner} from "./Components/Spinner";


export enum ValuesToParse {
  station_id = 'station_id',
  name = 'name',
  address = 'address',
  capacity = 'capacity',
  num_docks_available = 'num_docks_available',
  num_bikes_available = 'num_bikes_available',
}

const stationsListUrl = 'https://oslo-city-bikes-server.vercel.app/api/station_information'
const stationsListLocalUrl = 'http://localhost:3001/api/station_information'
const stationsStatusUrl = 'https://oslo-city-bikes-server.vercel.app/api/station_status'
const stationsStatusLocalUrl = 'http://localhost:3001/api/station_status'

function App(props: any) {
  const [isFetchedStationInfoData, setIsFetchedStationInfoData] = useState(false);
  const [isFetchedStationStatusData, setIsFetchedStationStatusData] = useState(false);
  const [fetchedStationInfoData, setFetchedStationInfoData] = useState(null);
  const [fetchedStationStatusData, setFetchedStationStatusData] = useState(null);
  const [urlPageId, setUrlPageId] = useState(props.pageId | 1);

  const dataFetching = () => {
    Xhr.getJson(stationsListUrl, null)
      .then((data) => {
        setFetchedStationInfoData(data.data);
        setIsFetchedStationInfoData(true);
      })
    Xhr.getJson(stationsStatusUrl, null)
      .then((data) => {
        setFetchedStationStatusData(data.data);
        setIsFetchedStationStatusData(true);
      })
  }

  useEffect(() => {
    let interval: any;
    if (!isFetchedStationInfoData && !isFetchedStationStatusData) {
      dataFetching(); // fetch on component mount
      interval = setInterval(() => {
        dataFetching()
      },(5*60*1000)); // fetching data every 5min to update the table
    }
    return () => {
      clearInterval(interval);
    }
  }, []);

  //Elements to render
  const stationsList = isFetchedStationInfoData && isFetchedStationStatusData ?
    <StationsList info={fetchedStationInfoData} status={fetchedStationStatusData} pageId = {props.pageId}/> : <Spinner />

  return (
    <div className="flex flex-col items-center">
      <div className='header'>
        <h1 className="flex text-center text-3xl font-bold text-custom-blue">
          Oslo City Bikes
        </h1>
      </div>
      <div className="flex flex-col justify-items-center">
        {stationsList}
      </div>
    </div>
  );
}

export default App;
