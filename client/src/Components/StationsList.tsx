import React, { useEffect, useState } from 'react';
import { StationsListItem } from "./StationsListItem";
import { ValuesToParse } from "../App";
import { TableHeaders } from "../Utils/TableHeaders";
import { StationsParser } from "../Utils/StationsParser";
import { Pagination } from "./Pagination";
import { useParams } from 'react-router-dom';
import { Page404 } from './404';

export interface StationsListProps {
  info: any,
  status: any,
  pageId: string,
}
export interface StationsListItem {
  station_id: string,
  name: string,
  capacity: number,
  num_bikes_available: number | null,
}

//remember to update in the case of updating ValuesToDisplay
export enum headers {
  name = 'Rack name',
  address = "Adress",
  capacity = 'Capacity',
  num_docks_available = 'Availabel slots',
  num_bikes_available = 'Available bikes',
}

export function StationsList(props: StationsListProps) {
  const [currentPage, setCurrentPage] = useState(parseInt(props.pageId));
  const [itemsPerPage] = useState(15);

  const pageId = useParams();

  useEffect(()=> {
    if (pageId.id) setCurrentPage(parseInt(pageId.id))
  },[])

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

  const list =  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                    {headersToDisplay}
                    </tr>
                  </thead>
                    {stationsList}
                  </table>
                </div>

  const paginationController = () => {
    if (currentPage === 0) {
      return <Page404 />
    } else if (currentPage <= Math.ceil(parsedList.length/itemsPerPage)) {
      return list;
    } else {
      return <Page404 />
    } 
  }

  return (
    <>
      <div className="flex flex-col">
        {/* <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"> */}
        <div className="overflow-x-auto mb-8">
          <div className="align-middle inline-block min-w-full">
            {paginationController()}
          </div>
        </div>
        <div className="flex items-center">
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
