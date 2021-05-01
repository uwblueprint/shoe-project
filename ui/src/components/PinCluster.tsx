import "react-leaflet-markercluster/dist/styles.min.css";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import * as React from "react";
import MarkerClusterGroup from "react-leaflet-markercluster";

import resting from "../assets/resting.svg";
import { device } from "../styles/device";
import { Story } from "../types";
import { Pin, PinState } from "./Pin";

//padding points for pin preview
const LEFT_PADDING_POINT = L.point(500, 75);
const RIGHT_PADDING_POINT = L.point(100, 400);
type PaddingState =
  | { left: L.Point; right: L.Point }
  | { left: null; right: null };

const createClusterCustomIcon = function () {
  return new L.Icon({
    iconUrl: resting,
    iconRetinaUrl: resting,
    iconAnchor: [24, 57],
    iconSize: new L.Point(48, 57),
  });
};

export interface PinClusterProps {
  stories: Story[];
  openDrawer: (story: Story) => () => void;
}

export const PinCluster = React.memo(function PinCluster({
  stories,
  openDrawer,
}: PinClusterProps): JSX.Element {
  const [paddingPoints, setPaddingPoints] = React.useState<PaddingState>({
    left: LEFT_PADDING_POINT,
    right: RIGHT_PADDING_POINT,
  });

  React.useLayoutEffect(() => {
    function updateSize() {
      if (window.screen.height <= parseInt(device.mobile)) {
        setPaddingPoints({ left: null, right: null });
      } else {
        setPaddingPoints({
          left: LEFT_PADDING_POINT,
          right: RIGHT_PADDING_POINT,
        });
      }
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <MarkerClusterGroup
      showCoverageOnHover={false}
      spiderLegPolylineOptions={{ opacity: 0 }}
      iconCreateFunction={createClusterCustomIcon}
      zoomToBoundsOnClick
    >
      {stories.map((story) => {
        return (
          <Pin
            id={story.ID.toString()}
            key={story.ID}
            story={story}
            state={PinState.Resting}
            onPopupClick={openDrawer(story)}
            pinPaddingPoints={paddingPoints}
          />
        );
      })}
    </MarkerClusterGroup>
  );
});
