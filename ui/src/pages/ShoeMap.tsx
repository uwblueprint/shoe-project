import * as React from "react";
import styled from "styled-components";
import { Map, TileLayer, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { Pin, PinState } from "../components/Pin";

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

export const ShoeMap: React.FC = () => {
  const zoom = 12;
  const currentLocation = { lat: 43.4723, lng: -80.5449 };

  return (
    <MapContainer>
      <StyledMap center={currentLocation} zoom={zoom} zoomControl={false}>
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`}
        />
        <Pin
          position={[currentLocation.lat, currentLocation.lng]}
          state={PinState.Resting}
        />
        <ZoomControl position='topright'/>
      </StyledMap>
    </MapContainer>
  );
};
