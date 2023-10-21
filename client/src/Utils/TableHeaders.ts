import {ValuesToParse} from "../App";
import {headers} from "../Components/StationsList";

export const TableHeaders = () => {
    const listOfHeaders = [];
    for (let enumKey of Object.keys(ValuesToParse))  {
        if (enumKey !== ValuesToParse.station_id) {
            const headerToDisplay = () => {
                let toDisplay;
                for (let headerName in headers) {
                    if (headerName == enumKey) {
                        toDisplay  = headers[headerName as keyof typeof headers]
                    }
                }
                return toDisplay
            }
            const listItem = headerToDisplay();
            listOfHeaders.push(listItem);
        }

    }
    return listOfHeaders
}
