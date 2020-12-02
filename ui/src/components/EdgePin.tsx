import L, { LatLng } from "leaflet";
import * as React from "react";
import RotatedMarker from 'leaflet-rotatedmarker';
import { Pin, PinState } from "./Pin";
import { CircleMarker, Marker } from "react-leaflet";

import resting from "../assets/resting.svg";
import { EdgeType } from "./EdgePins";
import styled from "styled-components";
import { arrow } from "./Arrow";

export interface EdgePinProps {
    position: LatLng;
    angle?: number;
    edgeType: EdgeType
}

export function getAnchor(edgeType: EdgeType){
  switch(edgeType){
    case EdgeType.Top:
      return new L.Point(0, -40);
    case EdgeType.Bottom:
      return new L.Point(0, 120)
    case EdgeType.Left:
      return new L.Point(-30, 0)
    case EdgeType.Right:
      return new L.Point(80, 0)
  }
}

export function EdgePin({
  position,
  angle,
  edgeType
}: EdgePinProps): JSX.Element {
  const icon = new L.Icon({
    iconUrl: angle? arrow(angle) : resting,
    iconRetinaUrl: angle?  arrow(angle): resting,
    iconAnchor: getAnchor(edgeType),
    popupAnchor: [-234, 200],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: angle? new L.Point(60, 70): new L.Point(50, 60),
  });

  return (
    <Marker position={position} icon={icon} />
  );
}