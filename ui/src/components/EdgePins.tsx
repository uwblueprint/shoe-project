import L, { LatLng, LatLngBounds } from "leaflet";
import * as React from "react";
import { EdgePin } from "./EdgePin";
import resting from "../assets/resting.svg";
import { Pin, PinState } from "./Pin";
import "react-leaflet-markercluster/dist/styles.min.css";
import "leaflet.markercluster";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import { PinCluster } from "./PinCluster";
import { EdgePinCluster } from "./EdgePinCluster";

export enum EdgeType {
  Bottom,
  Right,
  Top,
  Left
}

function getEdgeType(index){
  switch(index){
    case 0:
      return EdgeType.Bottom;
    case 1:
      return EdgeType.Right;
    case 2: 
      return EdgeType.Top;
    default:
      return EdgeType.Left;
  }
}


function intersects(a,b,c,d,p,q,r,s) {
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
      return false;
    } else {
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
};

function getPointOfIntersection (a,b,c,d,p,q,r,s) {
    var det, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    
    return L.latLng(a + lambda * (c-a), b + lambda * (d-b));
}

function angleFromCoordinate(lat1, long1, lat2,long2) {

  const dLon = (long2 - long1);

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1)
        * Math.cos(lat2) * Math.cos(dLon);

  const brng = Math.atan2(y, x) * 180 / Math.PI;
  console.log(brng)

  return 90 - brng;
}


export interface EdgePinsProps {
    pinPositions: { lat: number; lng: number }[];
    currPosition: LatLng;
    mapBounds: LatLngBounds;
}
  

  export function EdgePins({
    pinPositions,
    currPosition,
    mapBounds
  }: EdgePinsProps): JSX.Element {  
    // determine if the current view has markers
    if(!mapBounds  || !currPosition) return null;
    var isVisible = true;

    pinPositions.forEach(pos => {
        if(mapBounds.contains(L.latLng(pos.lat, pos.lng))){
            isVisible = false;
        }
    });

    // do not display the edge pins if there are markers in view
    if(!isVisible) return null;

    // determine the distance from the center to each of the markers
    const distanceToPos: { [distance: number] : LatLng; } = {};
    pinPositions.forEach(pos => {
        const posLatLng = L.latLng(pos.lat, pos.lng);
        distanceToPos[currPosition.distanceTo(posLatLng)] = posLatLng;
    });

    //sort the distances and take the first 3
    const distances = Object.keys(distanceToPos);
    distances.sort().slice(0, 3);

    // get the closest three pins
    const closestPins = [];
    distances.forEach(distance => {
        closestPins.push(distanceToPos[distance]);
    });

    const edgePinsInfo : { pos: LatLng, angle: number, edgeType: EdgeType }[] = [];

    // calculate intersection of the line from the center to the pin
    // store that point of intersection and the angle of the direction vector in edgePinsInfo
    const corners = [mapBounds.getSouthWest(), mapBounds.getSouthEast(), mapBounds.getNorthEast(), mapBounds.getNorthWest()];

    closestPins.forEach(pin => {
        for(var i = 0; i < 4; i++){
            const j = i + 1 < 4 ? i + 1 : 0;
            if(intersects(corners[i].lat, corners[i].lng, corners[j].lat, corners[j].lng, currPosition.lat, currPosition.lng, pin.lat, pin.lng)){
                var position = getPointOfIntersection(corners[i].lat, corners[i].lng, corners[j].lat, corners[j].lng, currPosition.lat, currPosition.lng, pin.lat, pin.lng);
                const angle = angleFromCoordinate(currPosition.lat * Math.PI/180, currPosition.lng* Math.PI/180, pin.lat* Math.PI/180, pin.lng* Math.PI/180);
                const pinInfo = { pos: position, angle: angle, edgeType: getEdgeType(i) };
                edgePinsInfo.push(pinInfo);
                break;
            }
        }
    });

    return (
       <EdgePinCluster clusterData={edgePinsInfo}/>
    );
  }