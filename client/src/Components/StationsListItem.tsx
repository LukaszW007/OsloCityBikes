import React from 'react';
import {ValuesToParse} from "../App";

interface StationsListItemProps {
    stationInfo: any,
}

export function StationsListItem(props: StationsListItemProps) {

    const {num_bikes_available} = props.stationInfo;

    const stationsListItemParsed = () => {
        const infoList = []
        for (const [key, value] of Object.entries(props.stationInfo)) {
            if (key !== ValuesToParse.station_id) {
                const stringValue: any = value;
                infoList.push(stringValue);
            }
        }
        return infoList;
    }

    const stationsListItemInformation = stationsListItemParsed().map((item,index) =>{
        return (
            <td key={index} className="px-4 py-4 w-40">
                <div className="flex-box items-center">
                    <div className="w-full break-words">
                      {item}
                    </div>
                </div>
            </td>
        )
    })

    return (
        <tbody className="bg-white divide-y divide-gray-200">
          <tr className={num_bikes_available === 0 ? "text-gray-200" : "text-gray-800"}>
            {stationsListItemInformation}
          </tr>
        </tbody>
    )
}
