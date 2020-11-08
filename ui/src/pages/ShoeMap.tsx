import styled from "styled-components";
import { Map, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { PinCluster } from "../components/PinCluster";
import 'react-leaflet-markercluster/dist/styles.min.css';
import 'leaflet.markercluster';

const StyledMap = styled(Map)`
  height: 100vh;
  width: 100vw;
`;

const MapContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

var markerList = [
  {
    lat: 43.4723,
    lng: -80.321796,
  },
  {
    lat: 43.4923,
    lng: -80.366873,
  },
  {
    lat: 43.4323,
    lng: -80.391796,
  }
];

export const ShoeMap: React.FC = () => {
  const zoom = 12;
  const currentLocation = { lat: 43.4723, lng: -80.5449 };

  return (
    <MapContainer>
      <StyledMap center={currentLocation} zoom={zoom} zoomControl={false}>
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`}
        />
        <PinCluster clusterPositions={markerList} />
        <ZoomControl position="topright" />
      </StyledMap>
    </MapContainer>
  );
};
