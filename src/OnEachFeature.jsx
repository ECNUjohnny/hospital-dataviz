import L from 'leaflet';
import { hospitalIcon, clinicIcon, doctorsIcon } from './mapIcon';

export const pointToLayer = (feature, latlng) => {
    const type = feature.properties.amenity;
    
    if (type === 'hospital') return L.marker(latlng, {icon: hospitalIcon});
    else if (type === 'clinic') return L.marker(latlng, {icon: clinicIcon});
    else return L.marker(latlng, {icon: doctorsIcon})
}

export const onEachFeature = (feature, layer) => {
    if (feature.properties) {
        
        const name = feature.properties.name;
    
        let type = '🏥hospital';
        if (feature.properties.amenity === 'clinic') type = '🩺clinic';
        else if (feature.properties.amenity === 'doctors') type = '💉doctors';
        
        const housenumber =  feature.properties["addr:housenumber"] ?? "unregistered";
        const postcode = feature.properties["addr:postcode"] ?? "unregistered";
        const street = feature.properties["addr:street"] ?? "unregistered";
        const website = feature.properties["website"] ?? "no web available";

        layer.bindPopup(`
            <div style="min-width: 180px; font-family: sans-serif;">
                <h3 style="margin: 0 0 8px 0; color: #16a34a; font-size: 16px; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">
                    ${name}
                </h3>
                <p style="margin: 0 0 4px 0; font-size: 13px; color: #1e293b;">
                    <b>type: </b>${type}
                </p>
                <p style="margin: 2px 0; font-size: 12px; color: #475569;">📍 ${street}</p>
                <p style="margin: 2px 0; font-size: 12px; color: #475569;">🚪 ${housenumber}</p>
                <p style="margin: 2px 0; font-size: 12px; color: #475569;">📭 ${postcode}</p>
                <p style="margin: 2px 0; font-size: 12px; color: #475569;">🌐 ${website}</p>
            </div>    
        
        `)
    }
}