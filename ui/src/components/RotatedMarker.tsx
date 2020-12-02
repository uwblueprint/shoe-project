import L, { LatLng, Marker } from "leaflet-rotatedmarker";
import { withLeaflet } from "react-leaflet";

export interface RotatedMarkerProps {
    position: LatLng;
    rotation: number;
}

class RotatedMarker extends Marker {
  
    createLeafletElement({position, rotation}:RotatedMarkerProps) {
      return L.marker(position, {rotationAngle: rotation});
    }
  
  }

export default withLeaflet(RotatedMarker);