import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMapEvents } from 'react-leaflet';


export const MapClipHandler = ({ onMapClick }) => {

    useMapEvents({

        click: (e) => {
            onMapClick([e.latlng.lng, e.latlng.lat]);
        },

    });

    return null;

};

export const handleMapClick = ({
    setStartPt, 
    startPt,
    setEndPt,
    endPt,  
    coords, 
    flag,
    pathEngine,
    roadData,
    handleRouting
}) => {

    if (!flag) return;

    if (!roadData || !pathEngine) return;

    if (!startPt || (startPt && endPt)) {

        setStartPt(coords);
        setEndPt(null);

    }
    else if (startPt && !endPt) {

        setEndPt(coords);
        handleRouting(startPt, endPt);

    }

}