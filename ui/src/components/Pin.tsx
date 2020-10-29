import * as React from "react";
import styled from "styled-components";
import L from "leaflet";
import { Marker } from "react-leaflet";
import resting from "../assets/resting.svg";
import unfocused from "../assets/unfocused.svg";

const iconResting = new L.Icon({
  iconUrl: resting,
  iconRetinaUrl: resting,
  iconAnchor: null,
  popupAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(50, 61),
  className: 'leaflet-div-icon'
});

export interface PinProps {
  focused: boolean;
  disabled: boolean;
  position: [number,number];
}

export function Pin(props: PinProps) {
  return (
    <Marker position={props.position} icon={iconResting}></Marker>
  );
}
