import * as React from "react";
import L from "leaflet";
import resting from "../assets/resting.svg";
import { Pin, PinState } from "./Pin";
import "react-leaflet-markercluster/dist/styles.min.css";
import "leaflet.markercluster";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import { Story } from "../types";

const createClusterCustomIcon = function () {
  return new L.Icon({
    iconUrl: resting,
    iconRetinaUrl: resting,
  });
};

export interface PinClusterProps {
  stories: Story[];
  openDrawer: (story: Story) => () => void;
}

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

export const PinCluster = React.memo(function PinCluster({
  stories,
  openDrawer,
}: PinClusterProps): JSX.Element {
  const [selectedPin, setSelectedPin] = React.useState("");

  return (
    <MarkerClusterGroup
      showCoverageOnHover={false}
      spiderLegPolylineOptions={{ opacity: 0 }}
      iconCreateFunction={createClusterCustomIcon}
    >
      {stories.map((story) => {
        return (
          <Pin
            id={story.ID.toString()}
            key={story.ID}
            story={story}
            state={getPinState(story.ID.toString(), selectedPin)}
            onPopupClick={openDrawer(story)}
            setSelectedPin={setSelectedPin}
          />
        );
      })}
    </MarkerClusterGroup>
  );
});
