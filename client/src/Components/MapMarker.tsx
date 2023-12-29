import { Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LatLng } from "leaflet";
import { MapMarkerPopup } from "./MapMarkerPopup";

export interface MapMarkerProps {
  position: [number, number];
  rackName: string;
  rackAddress: string;
  rackCapacity: number;
  rackBikesCount: number;
}

export const MapMarker = (props: MapMarkerProps) => {
  return (
    <Marker position={props.position}>
      <MapMarkerPopup
        name={props.rackName}
        address={props.rackAddress}
        capacity={props.rackCapacity}
        bikesAmount={props.rackBikesCount}
      />
    </Marker>
  );
};
