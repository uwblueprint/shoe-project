import L from "leaflet";
import * as React from "react";
import { Marker, Point, Popup } from "react-leaflet";
import styled from "styled-components";

import resting from "../assets/resting.svg";
import unfocused from "../assets/unfocused.svg";
import { device } from "../styles/device";
import { Story } from "../types";
import { PinPreview } from "./PinPreview";

const StyledPopup = styled(Popup)`
  width: 392px;
  height: 467px;
  box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.2);
  @media ${device.mobile} {
    width: fit-content;
    height: fit-content;
    border-radius: 1.5em;
  }

  .leaflet-popup-content {
    width: auto !important;
    margin: 0px;
    border-radius: 10px;
  }

  .leaflet-popup-content-wrapper {
    padding: 0px;
    @media ${device.mobile} {
      border-radius: 1.5em;
    }
  }

  .leaflet-popup-tip {
    display: none;
  }

  .leaflet-popup-close-button {
    @media ${device.mobile} {
      font-size: 5em !important;
      right: 0.7em !important;
      top: 0.3em !important;
    }
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
  pinPaddingPoints: { left: Point; right: Point };
}

export function Pin({
  state = PinState.Resting,
  story,
  onPopupClick,
  pinPaddingPoints,
}: PinProps): JSX.Element {
  const icon = new L.Icon({
    iconUrl: state === PinState.Unfocused ? unfocused : resting,
    iconRetinaUrl: state === PinState.Unfocused ? unfocused : resting,
    iconAnchor: state === PinState.Selected ? [24, 57] : [19.5, 48],
    popupAnchor: [234, -100],
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize:
      state === PinState.Selected ? new L.Point(48, 57) : new L.Point(39, 48),
  });

  return (
    <Marker position={[story.latitude, story.longitude]} icon={icon}>
      <StyledPopup
        autoPanPaddingTopLeft={pinPaddingPoints.left}
        autoPanPaddingBottomRight={pinPaddingPoints.right}
      >
        <PinPreview
          shoeImage={story.image_url}
          title={story.title}
          description={story.summary}
          author={`${story.author_first_name} ${story.author_last_name}`}
          date={story.year.toString()}
          country={story.author_country}
          onClick={onPopupClick}
        />
      </StyledPopup>
    </Marker>
  );
}
