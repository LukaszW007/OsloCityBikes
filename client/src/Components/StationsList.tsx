import React, {useState} from 'react';
import {StationsListItem} from "./StationsListItem";
import {ValuesToParse} from "../App";
import {TableHeaders} from "../Utils/TableHeaders";
import {StationsParser} from "../Utils/StationsParser";
import {Pagination} from "./Pagination";

export interface StationsListProps {
    info: any,
    status: any,
}
export interface StationsListItem {
    station_id: string,
    name: string,
    capacity: number,
    num_bikes_available: number | null,
}

//remember to update in the case of updating ValuesToDisplay
export enum headers {
    name = 'Stativnavn',
    // address = "Adresse",
    // capacity = 'Kapasitet',
    num_docks_available = 'Tilgjengelige låser',
    num_bikes_available = 'Ledige sykler',
}

export function StationsList(props: StationsListProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);

    const parsedList = StationsParser(props);

    // Get current items - stations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = parsedList.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    //Elements to render
    const stationsList = currentItems.map(item => {
            return <StationsListItem key={item[ValuesToParse.station_id]} stationInfo={item}/>
        })

    const headersToDisplay = TableHeaders().map((singleHeader,index) => {
        return (
            <th key={index} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {singleHeader}
            </th>
        )
    })

    return (
        <>
            <div className="flex flex-col my-10">
                <div className="flex flex-col my-10">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                {headersToDisplay}
                              </tr>
                            </thead>
                            {stationsList}
                          </table>
                        </div>
                      </div>
                    </div>
                </div>
                <div className="flex my-10 items-center">
                    <Pagination
                        currentPage = {currentPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={parsedList.length}
                        paginate={paginate}
                    />
                </div>
            </div>

        </>
    )
}
