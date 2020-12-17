import L, { LatLng, Point } from "leaflet";
import * as React from "react";
import { Marker } from "react-leaflet";
import { EdgeType } from "./EdgePins";
import { rotatedArrowSVG } from "./RotatedArrowSVG";

export interface EdgePinProps {
  position: LatLng;
  angle: number;
  edgeType: EdgeType;
}

// These numbers came from trial and error, and create a space
// between the pins and the edge of the map
export function getAnchor(edgeType: EdgeType): Point {
  switch (edgeType) {
    case EdgeType.Top:
      return new L.Point(0, -10);
    case EdgeType.Bottom:
      return new L.Point(0, 110);
    case EdgeType.Left:
      return new L.Point(-30, 0);
    default:
      return new L.Point(80, 0);
  }
}

export function EdgePin({
  position,
  angle,
  edgeType,
}: EdgePinProps): JSX.Element {
  const arrowIcon = new L.Icon({
    iconUrl: rotatedArrowSVG(angle),
    iconRetinaUrl:rotatedArrowSVG(angle),
    iconAnchor: getAnchor(edgeType),
    popupAnchor: [-234, 200],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(60, 70),
  });

  return (
    <Marker position={position} icon={arrowIcon} />
  );
}
