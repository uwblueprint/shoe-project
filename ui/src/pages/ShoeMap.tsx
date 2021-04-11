import "leaflet/dist/leaflet.css";

import L from "leaflet";
import * as React from "react";
import { useState } from "react";
import { AttributionControl, Map, TileLayer, ZoomControl } from "react-leaflet";
import Control from "react-leaflet-control";
import styled, { css } from "styled-components";
import useSWR from "swr";

// @ts-ignore svg
import ShoeLogo from "../assets/images/shoeproject-logo.svg";
import {
  Filter,
  HelpDrawer,
  HelpDrawerState,
  PinCluster,
  StoryDrawer,
  TutorialState,
  WelcomeTutorial,
} from "../components";
import { colors } from "../styles";
import { device } from "../styles/device";
import { Story, Tokens } from "../types";
import { isTimestampExpired } from "../util/timestamp";

const TIMEOUT_SECONDS = 1728000000;
const SHOE_PROJECT_URL = "https://theshoeproject.online/our-stories";

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
    @media ${device.mobile} {
      display: none;
    }
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
  @media ${device.mobile} {
    height: 6vh;
    width: 6vh;
    font-size: 80px;
    border-radius: 30px;
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
  cursor: pointer;
  @media ${device.mobile} {
    padding-bottom: 3vh;
    margin-left: 2vw;
    width: 110px;
    transform: scale(1.5);
  }
`;

export const ShoeMap: React.FC = () => {
  const zoom = 4;
  const minZoom = 4;
  const maxZoom = 12;
  const currentLocation = { lat: 53.655697, lng: -100.13316 };
  const southWest = L.latLng(40.712, -50.227);
  const northEast = L.latLng(70.774, -150.125);
  const mapBounds = L.latLngBounds(southWest, northEast);

  const { data: tokens, error: tokens_error } = useSWR<Tokens>(
    "/api/client_tokens"
  );
  const { data, error } = useSWR<Story[]>("/api/stories?visibility=true");

  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  function onTagsChange(_, options: string[]) {
    setFilteredCountries(options);
  }
  const stories =
    !data || filteredCountries.length === 0
      ? data
      : data.filter((story) =>
          filteredCountries.includes(story.author_country)
        );

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

  return (
    <React.Fragment>
      <MapContainer>
        <Filter onChange={onTagsChange} tags={filteredCountries} />
        <StyledMap
          maxBounds={mapBounds}
          center={currentLocation}
          zoom={zoom}
          minZoom={minZoom}
          maxZoom={maxZoom}
          zoomControl={false}
          attributionControl={false}
          isHelpDrawerOpen={isHelpDrawerOpen === HelpDrawerState.Open}
        >
          {tokens && !tokens_error && (
            <TileLayer
              url={`https://api.mapbox.com/styles/v1/hanlinc27/ckhjy5wat2dvz1aplv4tkaghb/tiles/{z}/{x}/{y}?access_token=${tokens.mapbox}`}
            />
          )}
          {stories && !error && (
            <PinCluster stories={stories} openDrawer={handleOpenDrawer} />
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
            <a href={SHOE_PROJECT_URL} target="_blank" rel="noreferrer">
              <StyledLogo />
            </a>
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
