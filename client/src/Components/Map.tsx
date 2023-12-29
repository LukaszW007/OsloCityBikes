import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Map } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LatLng } from "leaflet";
import { useEffect, useState } from "react";
import { MapMarker, MapMarkerProps } from "./MapMarker";
import { StationInformation } from "../App";

interface MapLeafletProps {
  stationsList: StationInformation[];
}

export const MapLeaflet = ({ stationsList }: MapLeafletProps) => {
  const centerMapPosition = L.latLng(59.92, 10.71);
  const zoomLevel = 12;
  const hasScrollZoom = true;

  const [stations, setStations] = useState<StationInformation[]>(stationsList);

  useEffect(() => {
    setStations(stationsList);
  }, [stationsList]);

  const transformToMarker = (data: StationInformation): MapMarkerProps => {
    return {
      position: [data.lat, data.lon],
      rackName: data.name,
      rackAddress: data.address,
      rackCapacity: data.capacity,
      rackBikesCount: 0,
    };
  };

  const markers = stations.map((singleStation) => {
    const data = transformToMarker(singleStation);
    return <MapMarker key={data.rackName} {...data} />;
  });

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
