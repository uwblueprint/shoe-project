import * as React from "react";
import L, { LatLng } from "leaflet";
import resting from "../assets/resting.svg";
import { Pin, PinState } from "./Pin";
import "react-leaflet-markercluster/dist/styles.min.css";
import "leaflet.markercluster";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import { EdgePin, getAnchor } from "./EdgePin";
import { EdgeType } from "./EdgePins";
import { arrow } from "./Arrow";

const createClusterCustomIcon = function (edgeType: EdgeType) {
  var icon;
  switch(edgeType){
    case EdgeType.Right:
      icon = arrow(0);
      break;
    case EdgeType.Bottom:
      icon = arrow(90);
      break;
    case EdgeType.Top:
      icon = arrow(270);
      break;
    case EdgeType.Left:
      icon = arrow(180);
      break;
  }

  return new L.Icon({
    iconUrl: icon,
    iconRetinaUrl: icon,
    iconAnchor: getAnchor(edgeType),
    popupAnchor: [-234, 200],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(50, 60),
    });
};

const createClusterBookmarkIcon = function () {
  return new L.Icon({
    iconUrl: resting,
    iconRetinaUrl: resting,
  });
};

export interface EdgePinClusterProps {
  clusterData: { pos: LatLng; angle: number; edgeType: EdgeType; }[];
}

export function EdgePinCluster({
  clusterData,
}: EdgePinClusterProps): JSX.Element {
  const rightCluster = clusterData.filter(data => data.edgeType === EdgeType.Right);
  const leftCluster = clusterData.filter(data => data.edgeType === EdgeType.Left);
  const topCluster = clusterData.filter(data => data.edgeType === EdgeType.Top);
  const bottomCluster = clusterData.filter(data => data.edgeType === EdgeType.Bottom);
  return (
    <React.Fragment>
      <MarkerClusterGroup
        showCoverageOnHover={false}
        spiderLegPolylineOptions={{ opacity: 0 }}
        iconCreateFunction={() => createClusterCustomIcon(EdgeType.Right)}
      >
        {rightCluster.map((marker, key) => {
          return (
            <EdgePin
              key={key}
              position={marker.pos}
              angle={marker.angle}
              edgeType={marker.edgeType}
            />
          );
        })}
      </MarkerClusterGroup>
      <MarkerClusterGroup
        showCoverageOnHover={false}
        spiderLegPolylineOptions={{ opacity: 0 }}
        iconCreateFunction={() => createClusterCustomIcon(EdgeType.Left)}
      >
        {leftCluster.map((marker, key) => {
          return (
            <EdgePin
              key={key}
              position={marker.pos}
              angle={marker.angle}
              edgeType={marker.edgeType}
            />
          );
        })}
      </MarkerClusterGroup>
      <MarkerClusterGroup
        showCoverageOnHover={false}
        spiderLegPolylineOptions={{ opacity: 0 }}
        iconCreateFunction={() => createClusterCustomIcon(EdgeType.Top)}
      >
        {topCluster.map((marker, key) => {
          return (
            <EdgePin
              key={key}
              position={marker.pos}
              angle={marker.angle}
              edgeType={marker.edgeType}
            />
          );
        })}
      </MarkerClusterGroup>
      <MarkerClusterGroup
        showCoverageOnHover={false}
        spiderLegPolylineOptions={{ opacity: 0 }}
        iconCreateFunction={() => createClusterCustomIcon(EdgeType.Bottom)}
      >
        {bottomCluster.map((marker, key) => {
          return (
            <EdgePin
              key={key}
              position={marker.pos}
              angle={marker.angle}
              edgeType={marker.edgeType}
            />
          );
        })}
      </MarkerClusterGroup>
      <MarkerClusterGroup
        showCoverageOnHover={false}
        spiderLegPolylineOptions={{ opacity: 0 }}
        iconCreateFunction={createClusterBookmarkIcon}
      >
        {rightCluster.map((marker, key) => {
          return (
            <EdgePin
              key={key}
              position={marker.pos}
              edgeType={marker.edgeType}
            />
          );
        })}
      </MarkerClusterGroup>
      <MarkerClusterGroup
        showCoverageOnHover={false}
        spiderLegPolylineOptions={{ opacity: 0 }}
        iconCreateFunction={createClusterBookmarkIcon}
      >
        {leftCluster.map((marker, key) => {
          return (
            <EdgePin
              key={key}
              position={marker.pos}
              edgeType={marker.edgeType}
            />
          );
        })}
      </MarkerClusterGroup>
      <MarkerClusterGroup
        showCoverageOnHover={false}
        spiderLegPolylineOptions={{ opacity: 0 }}
        iconCreateFunction={createClusterBookmarkIcon}
      >
        {topCluster.map((marker, key) => {
          return (
            <EdgePin
              key={key}
              position={marker.pos}
              edgeType={marker.edgeType}
            />
          );
        })}
      </MarkerClusterGroup>
      <MarkerClusterGroup
        showCoverageOnHover={false}
        spiderLegPolylineOptions={{ opacity: 0 }}
        iconCreateFunction={createClusterBookmarkIcon}
      >
        {bottomCluster.map((marker, key) => {
          return (
            <EdgePin
              key={key}
              position={marker.pos}
              edgeType={marker.edgeType}
            />
          );
        })}
      </MarkerClusterGroup>
    </React.Fragment>
  );
}
