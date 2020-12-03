import * as React from "react";
import styled from "styled-components";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import resting from "../assets/resting.svg";
import unfocused from "../assets/unfocused.svg";
import { PinPreview } from "./PinPreview";
import { Story } from "../types";

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
  state?: PinState;
  story: Story;
  onPopupClick?: () => void;
}

export function Pin({
  state = PinState.Resting,
  story,
  onPopupClick,
}: PinProps): JSX.Element {
  const icon = new L.Icon({
    iconUrl: state === PinState.Unfocused ? unfocused : resting,
    iconRetinaUrl: state === PinState.Unfocused ? unfocused : resting,
    iconAnchor: state === PinState.Selected ? [29, 70] : [25, 61],
    popupAnchor: [-234, 200],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize:
      state === PinState.Selected ? new L.Point(58, 70) : new L.Point(50, 61),
  });

  return (
    <Marker position={[story.latitude, story.longitude]} icon={icon}>
      <StyledPopup>
        <PinPreview
          title={story.title}
          description={story.summary}
          author={`${story.author_first_name} ${story.author_last_name}`}
          date={story.CreatedAt}
          country={story.author_country}
          onClick={onPopupClick}
        />
      </StyledPopup>
    </Marker>
  );
}
