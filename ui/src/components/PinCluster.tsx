import * as React from "react";
import L from "leaflet";
import resting from "../assets/resting.svg";
import { Pin, PinState } from "./Pin";
import "react-leaflet-markercluster/dist/styles.min.css";
import "leaflet.markercluster";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";

const createClusterCustomIcon = function () {
  return new L.Icon({
    iconUrl: resting,
    iconRetinaUrl: resting,
  });
};

export interface PinClusterProps {
  clusterPositions: { lat: number; lng: number }[];
}

export function PinCluster({ clusterPositions }: PinClusterProps): JSX.Element {
  return (
    <MarkerClusterGroup
      showCoverageOnHover={false}
      spiderLegPolylineOptions={{ opacity: 0 }}
      iconCreateFunction={createClusterCustomIcon}
    >
      {clusterPositions.map((marker, key) => {
        return (
          <Pin
            key={key}
            position={[marker.lat, marker.lng]}
            state={PinState.Resting}
          />
        );
      })}
    </MarkerClusterGroup>
  );
}
