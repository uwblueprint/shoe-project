import * as React from "react";
import L, { LatLng } from "leaflet";
import "react-leaflet-markercluster/dist/styles.min.css";
import "leaflet.markercluster";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import { EdgePin, getAnchor } from "./EdgePin";
import { EdgeType } from "./EdgePins";
import { rotatedArrowSVG } from "./RotatedArrowSVG";

const createClusterCustomIcon = (edgeType: EdgeType) => {
  let icon;
  switch (edgeType) {
    case EdgeType.Right:
      icon = rotatedArrowSVG(0);
      break;
    case EdgeType.Bottom:
      icon = rotatedArrowSVG(90);
      break;
    case EdgeType.Top:
      icon = rotatedArrowSVG(270);
      break;
    case EdgeType.Left:
      icon = rotatedArrowSVG(180);
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
    iconSize: new L.Point(60, 70),
  });
};

export interface EdgePinClusterProps {
  clusterData: { pos: LatLng; angle: number; edgeType: EdgeType }[];
}

export function EdgePinCluster({
  clusterData,
}: EdgePinClusterProps): JSX.Element {
  const rightCluster = clusterData.filter(
    (data) => data.edgeType === EdgeType.Right
  );
  const leftCluster = clusterData.filter(
    (data) => data.edgeType === EdgeType.Left
  );
  const topCluster = clusterData.filter(
    (data) => data.edgeType === EdgeType.Top
  );
  const bottomCluster = clusterData.filter(
    (data) => data.edgeType === EdgeType.Bottom
  );
  const clustersByDirection = [bottomCluster, rightCluster, topCluster, leftCluster];
  return (
    <React.Fragment>
      {clustersByDirection.map((cluster, index)=> {
          <MarkerClusterGroup
          showCoverageOnHover={false}
          spiderLegPolylineOptions={{ opacity: 0 }}
          iconCreateFunction={() => createClusterCustomIcon(index)}
        >
          {cluster.map((marker, key) => {
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
      })}
    </React.Fragment>
  );
}
