import { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMapEvents } from 'react-leaflet';


export const MapClickHandler = ({ onMapClick }) => {

    useMapEvents({

        click: (e) => {
            onMapClick([e.latlng.lng, e.latlng.lat]);
        },

    });

    return null;

};

export const handleMapClick = ({ 
    startPt,
    setStartPt,
    endPt,
    setEndPt,
    coords, 
    shortestPath,
    pathEngine,
    roadData,
    handleRouting
}) => {

    if (!shortestPath) return;

    if (!roadData || !pathEngine) return;

    if (!startPt || (startPt && endPt)) {

        setStartPt(coords);
        setEndPt(null);

    }
    else if (startPt && !endPt) {

        setEndPt(coords);
        handleRouting(startPt, coords);

    }

}