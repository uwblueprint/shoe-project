import L, { LatLng, LatLngBounds } from "leaflet";
import * as React from "react";
import "react-leaflet-markercluster/dist/styles.min.css";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";
import { EdgePinCluster } from "./EdgePinCluster";

export enum EdgeType {
  Bottom = 0,
  Right,
  Top,
  Left,
}

function intersects(a, b, c, d, p, q, r, s) {
  // compute determinant
  const det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    // return false if the lines are parallel or non-distinct
    return false;
  } else {
    // calculate the value we multiply by if our points are 
    // p1 = (x1, y1) and p2 = (x2, y2) and our equations for the 
    // point of intersection are x1 + lambda * (x2 - x1) and 
    // y1 + lambda * (y2 - y1), then check if this is valid
    const lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    const gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
  }
}

function getPointOfIntersection(a, b, c, d, p, q, r, s) {
  const det = (c - a) * (s - q) - (r - p) * (d - b);
  const lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;

  return L.latLng(a + lambda * (c - a), b + lambda * (d - b));
}

function angleFromCoordinate(lat1, long1, lat2, long2) {
  const dLon = long2 - long1;

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  const brng = (Math.atan2(y, x) * 180) / Math.PI;

  return brng - 80;
}

function getPOIInfo(pin: LatLng, corners: LatLng[], currPosition: LatLng, edgePinsInfo: { pos: LatLng; angle: number; edgeType: EdgeType }[]) {
  // iterate through the 4 sides of our current map view and find the point
  // of intersection between the line from the center of the map view to pin
  // and the side we are currently looking at
  for (let i = 0; i < 4; i++) {
    const j = i + 1 < 4 ? i + 1 : 0;
    // check if we have an intersection
    if (
      intersects(
        corners[i].lat,
        corners[i].lng,
        corners[j].lat,
        corners[j].lng,
        currPosition.lat,
        currPosition.lng,
        pin.lat,
        pin.lng
      )
    ) {
      // get the point of intersection
      const position = getPointOfIntersection(
        corners[i].lat,
        corners[i].lng,
        corners[j].lat,
        corners[j].lng,
        currPosition.lat,
        currPosition.lng,
        pin.lat,
        pin.lng
      );
      // determine the angle of rotation for the arrow pin
      const angle = angleFromCoordinate(
        (currPosition.lat * Math.PI) / 180,
        (currPosition.lng * Math.PI) / 180,
        (pin.lat * Math.PI) / 180,
        (pin.lng * Math.PI) / 180
      );
      const pinInfo = {
        pos: position,
        angle: angle,
        edgeType: i,
      };
      edgePinsInfo.push(pinInfo);
      break;
    }
  }
}

export interface EdgePinsProps {
  stories: { lat: number; lng: number }[];
  currPosition: LatLng;
  mapBounds: LatLngBounds;
}

export function EdgePins({
  stories,
  currPosition,
  mapBounds,
}: EdgePinsProps): JSX.Element {
  // determine if the current view has markers
  if (!mapBounds || !currPosition) return null;

  const pinPositions = stories.map((story) => {
    return { lat: story.lat, lng: story.lng };
  });

  const isVisible = !pinPositions.some((pos) => mapBounds.contains(L.latLng(pos.lat, pos.lng)));

  // do not display the edge pins if there are markers in view
  if (!isVisible) return null;

  // determine the distance from the center to each of the markers
  const distanceToPos: { [distance: number]: LatLng } = {};
  pinPositions.forEach((pos) => {
    const posLatLng = L.latLng(pos.lat, pos.lng);
    distanceToPos[currPosition.distanceTo(posLatLng)] = posLatLng;
  });

  //sort the distances and take the first one
  const distances = Object.keys(distanceToPos).sort().slice(0, 1);

  // get the closest three pins
  const closestPins: LatLng[] = distances.map((distance) => {
     return distanceToPos[distance];
  });

  const edgePinsInfo: { pos: LatLng; angle: number; edgeType: EdgeType }[] = [];

  // calculate intersection of the line from the center to the pin
  // store that point of intersection and the angle of the direction vector in edgePinsInfo
  const corners = [
    mapBounds.getSouthWest(),
    mapBounds.getSouthEast(),
    mapBounds.getNorthEast(),
    mapBounds.getNorthWest(),
  ];

  closestPins.forEach((pin) => {
    getPOIInfo(pin, corners, currPosition, edgePinsInfo);
  });

  return <EdgePinCluster clusterData={edgePinsInfo} />;
}
