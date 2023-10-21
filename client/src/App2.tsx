import React, {useEffect, useState} from 'react';
import './App.css';

import axios from 'axios';

export enum ValuesToParse {
    station_id = 'station_id',
    name = 'name',
    // address = 'address',
    // capacity = 'capacity',
    num_docks_available = 'num_docks_available',
    num_bikes_available = 'num_bikes_available',
}

function App2() {
    axios.get('https://cat-fact.herokuapp.com/facts',{
        // params: args,
        responseType: 'json',
    }).then((data: any)=> {
        console.log('AXIOS response from : ',data.data);
        return data
    }).catch((error: any) => {
        console.log(error);
    });

    //Elements to render
    // const stationsList = <div>{axio}</div>

    return (
        <div className="flex flex-col items-center">
            <div className='header'>
                <h1 className="flex text-center text-3xl font-bold text-custom-blue">
                    Oslo BySykkel
                </h1>
            </div>
            <div className="flex flex-col justify-items-center">
                {/*{stationsList}*/}
            </div>
        </div>
    );
}

export default App2;
