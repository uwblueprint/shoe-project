import * as React from "react";
import styled from "styled-components";
import { Map, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { TitleText } from "../styles/typography";

const StyledMap = styled(Map)`
  height: 70vh;
  width: 90vw;
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
      <TitleText>Shoe Map</TitleText>
      <StyledMap center={currentLocation} zoom={zoom}>
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`}
        />
      </StyledMap>
    </MapContainer>
  );
};
