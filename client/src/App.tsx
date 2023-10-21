import React, {useEffect, useState} from 'react';
import './App.css';
import {Xhr} from "./Utils/Xhr";
import {StationsList} from "./Components/StationsList";
import {Spinner} from "./Components/Spinner";

export enum ValuesToParse {
    station_id = 'station_id',
    name = 'name',
    // address = 'address',
    // capacity = 'capacity',
    num_docks_available = 'num_docks_available',
    num_bikes_available = 'num_bikes_available',
}

function App() {
    const [isFetchedStationInfoData, setIsFetchedStationInfoData] = useState(false);
    const [isFetchedStationStatusData, setIsFetchedStationStatusData] = useState(false);
    const [fetchedStationInfoData, setFetchedStationInfoData] = useState(null);
    const [fetchedStationStatusData, setFetchedStationStatusData] = useState(null);

    const dataFetching = () => {
        Xhr.getJson('https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json', null)
            .then((data) => {
                setFetchedStationInfoData(data.data.data);
                setIsFetchedStationInfoData(true);
            })
        Xhr.getJson('https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json', null)
            .then((data) => {
                setFetchedStationStatusData(data.data.data);
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
        <StationsList info={fetchedStationInfoData} status={fetchedStationStatusData} /> : <Spinner />

    return (
        <div className="flex flex-col items-center">
            <div className='header'>
                <h1 className="flex text-center text-3xl font-bold text-custom-blue">
                    Oslo BySykkel
                </h1>
            </div>
            <div className="flex flex-col justify-items-center">
                {stationsList}
            </div>
        </div>
    );
}

export default App;
