import {ValuesToParse} from "../App";
import {StationsListProps} from "../Components/StationsList";

export const StationsParser = (props: StationsListProps) => {
    const list: any[] = [];
    if (props.info && props.status) {
        props.info.stations.map((singleStation: any)=> {
            let parsedSingleStation: any ={};
            for (let enumValue in ValuesToParse) {
                for (const [key, value] of Object.entries(singleStation)) {
                    if (enumValue === key) {
                        parsedSingleStation[`${key}`] = value;
                    }
                }
            }
            list.push(parsedSingleStation);

        })
        //find station by id and add available racks
        const {stations} = props.status;
        for(let i= 0; i<list.length; i++) {
            const stationStatus = stations[stations.findIndex((el: any) => el.station_id === list[i][ValuesToParse.station_id])];
            for (let enumValue in ValuesToParse) {
                for (const [key, value] of Object.entries(stationStatus)) {
                    if (enumValue === key && !list[i].hasOwnProperty(enumValue)) {
                        const tempListItem = list[i];
                        tempListItem[`${key}`] = value;
                    }
                }
            }
        }

    }
    return list;
}
