import { Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LatLng } from "leaflet";
import { MapMarkerPopup } from "./MapMarkerPopup";
import { colorMarkerIconBike, defaultMarkerIconBike } from "./MapMarkerIcon";

export interface MapMarkerProps {
  position: number[];
  rackName: string;
  rackAddress: string;
  rackCapacity: number;
  rackBikesCount: number;
}

export const MapMarker = (props: MapMarkerProps) => {
  const getIcon = (bikesCount: number) => {
    switch (true) {
      case bikesCount > 5: {
        return colorMarkerIconBike("green");
      }
      case bikesCount <= 5 && bikesCount >= 2: {
        return colorMarkerIconBike("yellow");
      }
      case bikesCount <= 1: {
        return colorMarkerIconBike("red");
      }
      default: {
        return defaultMarkerIconBike;
      }
    }
  };
  return (
    <Marker
      autoPanOnFocus={true}
      position={[props.position[0], props.position[1]]}
      icon={getIcon(props.rackBikesCount)}
    >
      <MapMarkerPopup
        name={props.rackName}
        address={props.rackAddress}
        capacity={props.rackCapacity}
        bikesAmount={props.rackBikesCount}
      />
    </Marker>
  );
};
