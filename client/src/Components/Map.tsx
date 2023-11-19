import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet'
import {Map} from 'leaflet'
import "leaflet/dist/leaflet.css";
import { LatLng } from 'leaflet';


export const MapLeaflet = () => {
  // const map = useMap();
  // map.invalidateSize()
  // const setMap = ( map: Map ): void => {
    // const resizeObserver = new ResizeObserver( () => {
            
    // })
    // const container = document.getElementById('map-container')
    // resizeObserver.observe(container!)
  // }
  
  return (
    <MapContainer className="lg:h-[95vh] lg:w-[55vw] md:h-[50vh] md:w-[100%] sm:h-[100vh] sm:w-[100%]" center={[59.92, 10.71]} zoom={12} scrollWheelZoom={true} >
      <TileLayer
        attribution='Oslo City Bikes'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[59.92, 10.71]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  )
}