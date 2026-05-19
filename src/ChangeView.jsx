import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON, Marker, Popup } from 'react-leaflet';

export const ChangeView = ({ config }) => {
  const map = useMap();
  
  useEffect(() => {
    if (config) {
      map.setView(config.center, 12);
      map.setMaxBounds(config.bounds);
    }
  }, [config]);

  return null;
}