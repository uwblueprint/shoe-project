import * as React from "react";
import styled from "styled-components";
import { AttributionControl, Map, TileLayer, ZoomControl } from "react-leaflet";
import Control from "react-leaflet-control";
import "leaflet/dist/leaflet.css";
import { PinCluster } from "../components/PinCluster";
import { StoryDrawer, StoryDrawerState } from "../components/StoryDrawer";
import { useState } from "react";
import { colors } from "../styles";

const StyledMap = styled(Map)`
  height: 100vh;
  width: 100vw;

  .leaflet-control {
    border: none;
    box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.1);
    margin: 0px 24px 24px 0px;
  }
`;

const StyledHelpIcon = styled.button`
  height: 30px;
  width: 30px;
  font-size: 20px;
  font-weight: 500;
  border: none;
  background-color: ${colors.white};
  border-radius: 5px;
  box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    cursor: pointer;
    color: ${colors.primaryDark1};
  }

  &:focus {
    outline: 0;
    font-weight: 600;
    color: ${colors.primaryDark1};
    border: 1.5px solid ${colors.primaryDark1};
  }
`;

const MapContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;

  flex-direction: column;
  align-items: center;
`;

const markerList = [
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
  },
];

export const ShoeMap: React.FC = () => {
  const zoom = 12;
  const minZoom = 3;
  const maxZoom = 18;
  const currentLocation = { lat: 43.4723, lng: -80.5449 };
  const [isDrawerOpen, setIsDrawerOpen] = useState(StoryDrawerState.Closed);

  return (
    <React.Fragment>
      <MapContainer>
        <StyledMap
          center={currentLocation}
          zoom={zoom}
          minZoom={minZoom}
          maxZoom={maxZoom}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/hanlinc27/ckhjy5wat2dvz1aplv4tkaghb/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`}
          />
          <PinCluster
            clusterPositions={markerList}
            openDrawer={() => setIsDrawerOpen(StoryDrawerState.Open)}
          />
          <ZoomControl position="bottomright" />
          <AttributionControl position="bottomleft" />
          <Control position="bottomright">
            <StyledHelpIcon>?</StyledHelpIcon>
          </Control>
        </StyledMap>
      </MapContainer>
      <StoryDrawer
        title={"Story Title"}
        author={"Jie Li"}
        date={"Dec 20, 2020"}
        country={"China"}
        state={isDrawerOpen}
        content={
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Diam non, nam dolor eget vitae. Velit massa turpis vitae ut tempus euismod. Pharetra tellus vitae mattis neque. Ipsum porttitor et enim bibendum ultricies. Egestas tortor, consequat odio urna amet. Dictumst est eu netus in iaculis cursus tincidunt dolor. Sed et enim volutpat, placerat molestie vestibulum, ac. Semper metus sit sit diam. Nam aenean nec iaculis ipsum suspendisse molestie. Commodo vitae ac ullamcorper justo. Aliquam, vestibulum sed in aenean consequat aliquam donec. Accumsan, ullamcorper tempus nisl, sit sollicitudin aliquet. Id gravida vel pretium sit diam. Ultricies neque libero scelerisque nunc, dignissim velit eget. Vitae sit magna magnis integer nulla nec arcu in senectus. Tincidunt eu commodo malesuada ultrices nulla eget urna. Nullam mi suspendisse vitae sagittis, vestibulum placerat eget eros, dictum. In adipiscing curabitur tellus etiam adipiscing sed fermentum. Aliquet molestie ornare lectus blandit aliquam malesuada arcu. Tellus vitae tristique facilisis dignissim volutpat, dictum in scelerisque. Iaculis viverra suspendisse lorem convallis habitasse malesuada erat sed et. Enim nibh mauris adipiscing velit non."
        }
        currentCity={"Toronto"}
        setState={setIsDrawerOpen}
      />
    </React.Fragment>
  );
};
