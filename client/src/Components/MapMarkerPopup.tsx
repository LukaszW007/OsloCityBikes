import {Popup} from 'react-leaflet'
import "leaflet/dist/leaflet.css";

interface MapMarkerPopupProps {
  name: string,
  address: string,
  capacity: number,
  bikesAmount: number,
}

export const MapMarkerPopup = (props:MapMarkerPopupProps) => {

  return (
        <Popup>
          {props.name} <br /> 
          {props.address}<br /> 
          {props.bikesAmount} of {props.capacity} are available<br /> 
        </Popup>
  )
}