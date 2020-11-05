import * as React from "react";
import styled from "styled-components";
import { Map, TileLayer } from "react-leaflet";
import { useHistory, useLocation } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import { Pin, PinState } from "../components/Pin";
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

function getPinState(id: string, selectedPin: string) {
  switch (selectedPin) {
    case "":
      return PinState.Resting;
    case id:
      return PinState.Selected;
    default:
      return PinState.Unfocused;
  }
}

const pins = [
  { lat: 43.4723, lng: -80.5449 },
  { lat: 43.48, lng: -80.5449 },
];

export const ShoeMap: React.FC = () => {
  const zoom = 12;
  const history = useHistory();
  const location = useLocation();
  const [selectedPin, setSelectedPin] = React.useState("");

  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const loc = searchParams.get("location");
    if (loc) {
      setSelectedPin(loc);
    }
  }, [location]);

  const handlePopupOpen = React.useCallback(
    (id: string) => {
      return () => {
        setSelectedPin(id);
        history.push({
          search: `?location=${id}`,
        });
      };
    },
    [setSelectedPin]
  );
  const handleMapClick = React.useCallback(() => {
    setSelectedPin("");
    history.push({
      search: "",
    });
  }, [setSelectedPin]);

  return (
    <MapContainer>
      <TitleText>Shoe Map</TitleText>
      <StyledMap center={pins[0]} zoom={zoom} onclick={handleMapClick}>
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`}
        />
        {pins.map((location) => {
          const pinId = `${location.lat}${location.lng}`;
          return (
            <Pin
              key={pinId}
              id={pinId}
              position={[location.lat, location.lng]}
              state={getPinState(pinId, selectedPin)}
              onPopupOpen={handlePopupOpen}
              onPopupClose={handleMapClick}
            />
          );
        })}
      </StyledMap>
    </MapContainer>
  );
};
