import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Map } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LatLng } from "leaflet";
import { FC, useEffect, useState } from "react";
import { MapMarker, MapMarkerProps } from "./MapMarker";
import { StationInformation, StationStatus } from "../App";

interface MapLeafletProps {
	stationsList: StationInformation[];
	stationsStatusList: StationStatus[];
}

export const MapLeaflet: FC<MapLeafletProps> = ({
	stationsList,
	stationsStatusList,
}) => {
	const centerMapPosition = L.latLng(59.92, 10.71); // the center of Oslo
	const zoomLevel = 12;
	const hasScrollZoom = true;

	const [stations, setStations] =
		useState<StationInformation[]>(stationsList);
	const [stationsStatus, setStationsStatus] =
		useState<StationStatus[]>(stationsStatusList);

	useEffect(() => {
		setStations(stationsList);
		setStationsStatus(stationsStatusList);
	}, [stationsList, stationsStatusList]);

	const transformToMarker = (
		data: StationInformation,
		status: StationStatus
	) => {
		return {
			position: [data.lat, data.lon],
			rackName: data.name,
			rackAddress: data.address,
			rackCapacity: data.capacity,
			rackBikesCount: status ? status.num_bikes_available : 0,
		};
	};

	const markers =
		stations.length > 0 && stationsStatus.length > 0
			? stations.map((singleStation) => {
					const singleStationStatus = stationsStatus.find(
						(singleStatus) =>
							singleStation.station_id === singleStatus.station_id
					) as StationStatus;
					const data = transformToMarker(
						singleStation,
						singleStationStatus
					);
					return (
						<MapMarker
							key={data.rackName}
							{...data}
						/>
					);
			  })
			: null;

	return (
		<MapContainer
			className="lg:h-[95vh] lg:w-[55vw] md:h-[50vh] md:w-[100%] sm:h-[100vh] sm:w-[100%]"
			center={centerMapPosition}
			zoom={zoomLevel}
			scrollWheelZoom={hasScrollZoom}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{markers}
		</MapContainer>
	);
};
