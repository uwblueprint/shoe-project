import * as React from "react";
import L from "leaflet";
import { Marker } from "react-leaflet";
import resting from "../assets/resting.svg";
import unfocused from "../assets/unfocused.svg";

export enum PinState {
  Resting,
  Selected,
  Unfocused,
}

export interface PinProps {
  state?: PinState;
  position: [number, number];
}

export function Pin({ state = PinState.Resting, position }: PinProps) {
  const icon = new L.Icon({
    iconUrl: state === PinState.Unfocused ? unfocused : resting,
    iconRetinaUrl: state === PinState.Unfocused ? unfocused : resting,
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize:
      state === PinState.Selected ? new L.Point(58, 70) : new L.Point(50, 61),
  });
  return <Marker position={position} icon={icon} />;
}
