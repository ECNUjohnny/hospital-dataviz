import L from 'leaflet'
import { renderToString } from 'react-dom/server';
import { Hospital, Stethoscope, UserRound } from 'lucide-react';

export const hospitalIcon = L.divIcon({
    html: renderToString(
        <div style = {{padding: '6px', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px rgba(255, 71, 87, 0.8)'}}>
            <Hospital color = "white" size = {18}/>
        </div>
    ),
    className: 'custom-leaflet-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
})

export const clinicIcon = L.divIcon({
    html: renderToString(
        <div style = {{padding: '5px', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px rgba(255, 165, 2, 0.8)'}}>
            <Stethoscope color="white" size={14} />
        </div>

    ),
    className: 'custom-leaflet-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
})

export const doctorsIcon = L.divIcon({
    html: renderToString(
        <div style = {{padding: '6px', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 10px rgba(46, 213, 115, 0.8)'}}>
            <UserRound color="white" size={10} />
        </div>

    ),
    className: 'custom-leaflet-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
})
