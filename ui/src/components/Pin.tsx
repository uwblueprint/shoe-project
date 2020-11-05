import * as React from "react";
import styled from "styled-components";
import L, { PointTuple, PopupEvent } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import resting from "../assets/resting.svg";
import unfocused from "../assets/unfocused.svg";
import { PinPreview } from "./PinPreview";

const StyledPopup = styled(Popup)`
  width: 392px;
  height: 467px;
  box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.2);

  .leaflet-popup-content {
    width: auto !important;
    margin: 0px;
    border-radius: 10px;
  }

  .leaflet-popup-content-wrapper {
    padding: 0px;
  }

  .leaflet-popup-tip {
    display: none;
  }
`;

export enum PinState {
  Resting,
  Selected,
  Unfocused,
}

export interface PinProps {
  id: string;
  position: PointTuple;
  state?: PinState;
  onPopupOpen?: (id: string) => (event: PopupEvent) => void;
  onPopupClose?: (event: PopupEvent) => void;
}

// This is extremely jank
// TODO: Figure out how anchors actually work
function getAnchor(state: PinState): PointTuple {
  switch (state) {
    case PinState.Resting:
      return [25, 61];
    case PinState.Selected:
      return [29, 70];
    case PinState.Unfocused:
      return [22, 57];
  }
}

export function Pin({
  id,
  state = PinState.Resting,
  position,
  onPopupOpen,
  onPopupClose,
}: PinProps): JSX.Element {
  const icon = new L.Icon({
    iconUrl: state === PinState.Unfocused ? unfocused : resting,
    iconRetinaUrl: state === PinState.Unfocused ? unfocused : resting,
    iconAnchor: getAnchor(state),
    popupAnchor: [-234, 200],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize:
      state === PinState.Selected ? new L.Point(58, 70) : new L.Point(50, 61),
  });

  const initMarker = (ref) => {
    if (ref && state === PinState.Selected) {
      ref.leafletElement.openPopup();
    }
  };

  return (
    <Marker
      ref={initMarker}
      position={position}
      icon={icon}
      onpopupopen={onPopupOpen(id)}
      onpopupclose={onPopupClose}
    >
      <StyledPopup>
        <PinPreview
          title={"Story Title"}
          description={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis turpis facilisis risus dolor. Euismod morbi vel vitae massa risus, commodo sed in arcu. Cras ..."
          }
          author={"Jie Li"}
          date={"Dec 20, 2020"}
          country={"China"}
        />
      </StyledPopup>
    </Marker>
  );
}
