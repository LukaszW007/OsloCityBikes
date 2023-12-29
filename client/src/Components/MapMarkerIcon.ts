import L from "leaflet";
import "./MapMarkerIcon.css";
import bikeIcon from "../Assets/bicycle.svg";

const defaultMarkerIconBike = new L.Icon({
  iconUrl: require("../Assets/bicycle.svg"),
  iconRetinaUrl: require("../Assets/bicycle.svg"),
  iconAnchor: [55, 70],
  popupAnchor: [-3, -76],
  shadowUrl: undefined,
  shadowSize: undefined,
  shadowAnchor: undefined,
  // iconSize: new L.Point(60, 75),
  iconSize: [60, 75],
  className: "leaflet-marker-icon",
});

const colorMarkerIconBike = (color: string) => {
  let classname: string = "";
  switch (color) {
    case "red": {
      classname = "leaflet-marker-icon-red";
      break;
    }
    case "yellow": {
      classname = "leaflet-marker-icon-yellow";
      break;
    }
    case "green": {
      classname = "leaflet-marker-icon-green";
      break;
    }
  }
  const icon = new L.Icon({
    iconUrl: bikeIcon,
    iconRetinaUrl: bikeIcon,
    iconAnchor: [15, 20],
    popupAnchor: [-3, -26],
    shadowUrl: undefined,
    shadowSize: undefined,
    shadowAnchor: undefined,
    // iconSize: new L.Point(60, 75),
    iconSize: [25, 20],
    className: `pin ${classname}`,
  });

  return icon;
};

export { defaultMarkerIconBike, colorMarkerIconBike };
