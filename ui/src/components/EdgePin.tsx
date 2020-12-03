import L, { LatLng, Point } from "leaflet";
import * as React from "react";
import { Marker } from "react-leaflet";
import { EdgeType } from "./EdgePins";
import { arrow } from "./Arrow";

export interface EdgePinProps {
  position: LatLng;
  angle: number;
  edgeType: EdgeType;
}

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
    iconUrl: arrow(angle),
    iconRetinaUrl: arrow(angle),
    iconAnchor: getAnchor(edgeType),
    popupAnchor: [-234, 200],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(60, 70),
  });

  return (
    <React.Fragment>
      <Marker position={position} icon={arrowIcon} />
    </React.Fragment>
  );
}
