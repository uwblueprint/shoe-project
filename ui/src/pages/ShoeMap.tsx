import * as React from "react";
import styled from "styled-components";
import useSWR from "swr";
import { AttributionControl, Map, TileLayer, ZoomControl } from "react-leaflet";
import Control from "react-leaflet-control";
import "leaflet/dist/leaflet.css";
import { PinCluster } from "../components/PinCluster";
import { StoryDrawer } from "../components/StoryDrawer";
import { WelcomeTutorial, TutorialState } from "../components/WelcomeTutorial";
import { useState } from "react";
import { colors } from "../styles";
import ShoeLogo from "../assets/images/shoeproject-logo.svg";
import { Filter } from "../components/Filter";
import { Story } from "../types";

const StyledMap = styled(Map)`
  height: 100vh;
  width: 100vw;
  .leaflet-control {
    border: none;
    margin: 0px 24px 24px 0px;
  }
  .leaflet-bar a {
    width: 48px;
    height: 48px;
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
`;

const StyledHelpIcon = styled.button`
  height: 48px;
  width: 48px;
  font-size: 26px;
  font-weight: 500;
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
  padding-left: 48px;
  padding-bottom: 43.21px;
`;

export const ShoeMap: React.FC = () => {
  const zoom = 12;
  const minZoom = 3;
  const maxZoom = 18;
  const currentLocation = { lat: 43.4723, lng: -80.5449 };

  const { data: stories, error } = useSWR<Story[]>("/api/stories");
  const [filteredStories, setFilteredStories] = useState([]);
  const [story, setStory] = React.useState<Story | undefined>(undefined);
  const handleOpenDrawer = (s: Story) => () => setStory(s);
  const handleCloseDrawer = () => setStory(undefined);
  const [isTutorialOpen, setIsTutorialOpen] = useState(TutorialState.First);

  return (
    <React.Fragment>
      <MapContainer>
        <Filter state={filteredStories} setState={setFilteredStories}/>
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
          {(() => {

            if(stories && filteredStories.length != 0){
              var filteredStoryArr= new Array<Story>();

              stories.forEach(function(story){
                filteredStories.forEach(function (country){
                  if(story.author_country == country){
                    filteredStoryArr.push(story);
                  }
                });
              });

              return (
              <PinCluster stories={filteredStoryArr} openDrawer={handleOpenDrawer} />
              )
            }

            else if(stories){
              return(
                <PinCluster stories={stories} openDrawer={handleOpenDrawer} />
              )
            }

          })()}
          <ZoomControl position="bottomright" />

          <AttributionControl position="topright" />
          <Control position="bottomright">
            <StyledHelpIcon>?</StyledHelpIcon>
          </Control>
          <Control position="bottomleft">
            <StyledLogo></StyledLogo>
          </Control>
        </StyledMap>
      </MapContainer>
      <StoryDrawer story={story} onClose={handleCloseDrawer} />
      <WelcomeTutorial state={isTutorialOpen} setState={setIsTutorialOpen} />
    </React.Fragment>
  );
};
