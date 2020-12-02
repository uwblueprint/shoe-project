import "leaflet/dist/leaflet.css";

import * as React from "react";
import { AttributionControl, Map, TileLayer, ZoomControl, Marker } from "react-leaflet";
import Control from "react-leaflet-control";
import styled, { css } from "styled-components";
import useSWR from "swr";
import ShoeLogo from "../assets/images/shoeproject-logo.svg";
import {
  Filter,
  HelpDrawer,
  HelpDrawerState,
  PinCluster,
  StoryDrawer,
  TutorialState,
  WelcomeTutorial,
  EdgePins,
} from "../components";
import { isTimestampExpired } from "../components/helpers/welcomeTutorialFunctions";
import { colors } from "../styles";
import { Story, Tokens } from "../types";
import { useRef, useState } from "react";
import { LatLng, LatLngBounds } from "leaflet";
const TIMEOUT_SECONDS = 1728000000;

interface StyledMapProps {
  isHelpDrawerOpen: boolean;
}

const StyledMap = styled(Map)<StyledMapProps>`
  height: 100vh;
  width: 100vw;
  .leaflet-control {
    border: none;
    margin: 0px 36px 16px 0px;
  }
  .leaflet-bar a {
    width: 40px;
    height: 40px;
    background-color: ${colors.white};
    font-size: 26px;
    line-height: 45px;
    box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.1);
    :first-child {
      border-radius: 10px 10px 0px 0px;
    }
    :last-child {
      border-radius: 0px 0px 10px 10px;
    }
  }
  .leaflet-right {
    ${(props: StyledMapProps) =>
      props.isHelpDrawerOpen &&
      css`
        right: 28vw;
        -webkit-transition: all 0.2s ease;
      `};
  }
`;

const StyledHelpIcon = styled.button`
  height: 40px;
  width: 40px;
  font-size: 26px;
  font-weight: 500;
  margin-bottom: 8px;
  border: none;
  background-color: ${colors.white};
  border-radius: 10px;
  box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.1);
  &:hover {
    cursor: pointer;
    color: ${colors.primaryDark1};
  }
  &:focus {
    outline: 0;
    font-weight: 600;
    color: ${colors.primaryDark1};
    border: 2px solid ${colors.primaryDark1};
  }
`;

const MapContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledLogo = styled.div`
  background-image: url(${ShoeLogo});
  width: 87px;
  height: 87px;
  padding-left: 42px;
  padding-bottom: 30px;
  left: 36px;
`;

export const ShoeMap: React.FC = () => {
  const zoom = 4;
  const minZoom = 4;
  const maxZoom = 12;
  const currentLocation = { lat: 53.655697, lng: -100.13316 };
  const { data: tokens, error: tokens_error } = useSWR<Tokens>(
    "/api/client_tokens"
  );
  const { data, error } = useSWR<Story[]>("/api/stories");

  const [filteredCountries, setFilteredCountries] = useState([]);
  function onTagsChange(_, options: string[]) {
    setFilteredCountries(options);
  }
  const stories =
    !data || filteredCountries.length === 0
      ? data
      : data.filter((story) =>
          filteredCountries.includes(story.author_country)
        );

  const storyPostitions = stories.map(story => {
    return { lat: story.latitude, lng: story.longitude}
  })

  const [story, setStory] = React.useState<Story | undefined>(undefined);
  const handleOpenDrawer = (s: Story) => () => setStory(s);
  const handleCloseDrawer = () => setStory(undefined);
  const [isTutorialOpen, setIsTutorialOpen] = useState(
    isTimestampExpired(TIMEOUT_SECONDS)
      ? TutorialState.First
      : TutorialState.Closed
  );
  const [isHelpDrawerOpen, setIsHelpDrawerOpen] = useState(
    HelpDrawerState.Closed
  );
  const mapRef = useRef(null);
  const [mapBounds, setMapBounds] = useState(null as LatLngBounds);
  const [center, setCenter] = useState(null as LatLng);

  const setMoveAndZoomListeners = () => {
    console.log("here");
    if(mapRef && mapRef.current){
      console.log(mapRef.current)
      const onMoveOrZoom = (event) => {
        if(mapRef && mapRef.current && mapRef.current.leafletElement){
        setMapBounds(mapRef.current.leafletElement.getBounds());
        setCenter(mapRef.current.leafletElement.getCenter());
        console.log("set")
        }
      };
      mapRef.current.leafletElement.on('moveend', onMoveOrZoom);
      mapRef.current.leafletElement.on('zoomend', onMoveOrZoom);
    }
  };

  return (
    <React.Fragment>
      <MapContainer>
        <Filter onChange={onTagsChange} />
        <StyledMap
          center={currentLocation}
          zoom={zoom}
          minZoom={minZoom}
          maxZoom={maxZoom}
          zoomControl={false}
          attributionControl={false}
          isHelpDrawerOpen={isHelpDrawerOpen === HelpDrawerState.Open}
          ref={mapRef}
          onViewportChanged={setMoveAndZoomListeners}
        >
          {tokens && !tokens_error && (
            <TileLayer
              url={`https://api.mapbox.com/styles/v1/hanlinc27/ckhjy5wat2dvz1aplv4tkaghb/tiles/{z}/{x}/{y}?access_token=${tokens.mapbox}`}
            />
          )}
          {stories && !error && (
            <React.Fragment>
            <PinCluster stories={stories} openDrawer={handleOpenDrawer} />
            <EdgePins
            pinPositions={storyPostitions}
            currPosition={center}
            mapBounds={mapBounds}
          />
          </React.Fragment>
          )}
          <ZoomControl position="bottomright" />
          <AttributionControl position="topright" />
          <Control position="bottomright">
            <StyledHelpIcon
              onClick={() => setIsHelpDrawerOpen(HelpDrawerState.Open)}
            >
              ?
            </StyledHelpIcon>
          </Control>
          <Control position="bottomleft">
            <StyledLogo></StyledLogo>
          </Control>
        </StyledMap>
      </MapContainer>
      <StoryDrawer story={story} onClose={handleCloseDrawer} />
      <WelcomeTutorial state={isTutorialOpen} setState={setIsTutorialOpen} />
      <HelpDrawer
        state={isHelpDrawerOpen}
        setIsHelpDrawerOpen={setIsHelpDrawerOpen}
        setIsTutorialOpen={setIsTutorialOpen}
      />
    </React.Fragment>
  );
};
