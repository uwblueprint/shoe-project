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
  openDrawer: () => void;
}

export function PinCluster({
  stories,
  openDrawer,
}: PinClusterProps): JSX.Element {
  return (
    <MarkerClusterGroup
      showCoverageOnHover={false}
      spiderLegPolylineOptions={{ opacity: 0 }}
      iconCreateFunction={createClusterCustomIcon}
    >
      {stories.map((story, key) => {
        return (
          <Pin
            key={key}
            story={story}
            state={PinState.Resting}
            openDrawer={openDrawer}
          />
        );
      })}
    </MarkerClusterGroup>
  );
}
