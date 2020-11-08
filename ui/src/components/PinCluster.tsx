import * as React from "react";
import styled from "styled-components";
import L from "leaflet";
// import 'leaflet';
import L1 from 'leaflet.markercluster';

import resting from "../assets/resting.svg";
import { Pin, PinState } from "./Pin";
import 'react-leaflet-markercluster/dist/styles.min.css';
import 'leaflet.markercluster';
import MarkerClusterGroup from "react-leaflet-markercluster";
import {
    Map,
    TileLayer,
    Marker,
    Popup,
  } from 'react-leaflet';
  import 'leaflet/dist/leaflet.css';
  import 'react-leaflet-markercluster/dist/styles.min.css'; 



interface PinClusterProps{
    // markerlist: typeof Pin[]
    name?: any
  }
  const currentLocation = { lat: 43.4723, lng: -80.5449 };

  const createClusterCustomIcon = function (cluster) {
    return new L.Icon({
        iconUrl: resting,
        iconRetinaUrl: resting
    //   html: `<span>${cluster.getChildCount()}</span>`,
    //   className: 'marker-cluster-custom',
    //   iconSize: L.point(40, 40, true),
    });
  }
   
  export function PinCluster(props:any){
    return (
        <MarkerClusterGroup iconCreateFunction = {createClusterCustomIcon}>
            {/* TODO: Pass in array of pins as prop and then map it */}
             <Pin
          position={[currentLocation.lat, currentLocation.lng]}
          state={PinState.Resting}
        />
         <Pin
          position={[currentLocation.lat+0.02, currentLocation.lng+0.01]}
          state={PinState.Resting}
        />
         <Pin
          position={[currentLocation.lat-0.02, currentLocation.lng-0.01]}
          state={PinState.Resting}
        />
        </MarkerClusterGroup>
    );
  }
  
