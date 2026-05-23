import { useState, useEffect } from 'react';
import L from 'leaflet';
import * as turf from '@turf/turf';
import PathFinder from 'geojson-path-finder';

/**
 * 
 * 
 * 
 * 
 * 
 */

export const handleGeoData = (feature, index, centers, districtData) => {

    if (!feature.geometry || !feature.geometry.coordinates) return;
    
    const tempLayer = L.geoJSON(feature);

    const geoType = feature.geometry.type;

    let point;
                
    if (geoType === "Point") point = turf.point([feature.geometry.coordinates[0], feature.geometry.coordinates[1]]);

    else if (geoType === "Polygon" || geoType === 'MultiPolygon') {
        const center = tempLayer.getBounds().getCenter();
        point = turf.point([center.lng, center.lat]);
    }

    if (!point) return;

    let district_name = "unknown district";

    if (districtData && districtData.features) {
        
        const matchZone = districtData.features.find(districtFeature => {
            
            return turf.booleanPointInPolygon(point, districtFeature);
                    
        });

        if (matchZone) {
            
            district_name = matchZone.properties["name:en"] || matchZone.properties["name"];
        }
    }

    if (geoType === 'Polygon' || geoType === 'MultiPolygon') {

        const center = tempLayer.getBounds().getCenter();

        centers.push({
            id: feature.id || `poly-${index}`,
            isPoint: feature.geometry.type === 'Point',    
            position: [center.lat, center.lng],
            type: feature.properties.amenity,
            name: feature.properties.name || "unknown agency",
            district: district_name,

            housenumber: feature.properties["addr:housenumber"] ?? "unregistered",
            postcode: feature.properties["addr:postcode"] ?? "unregistered",
            street: feature.properties["addr:street"] ?? "unregistered",
            website: feature.properties["website"] ?? "no web available"
        })
    }

    else if (geoType === 'Point') {
        centers.push({
            id: feature.id || `point-${index}`,
            isPoint: feature.geometry.type === 'Point',
            position: [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
            type: feature.properties.amenity,
            name: feature.properties.name || "unknown agency",
            district: district_name,

            housenumber: feature.properties["addr:housenumber"] ?? "unregistered",
            postcode: feature.properties["addr:postcode"] ?? "unregistered",
            street: feature.properties["addr:street"] ?? "unregistered",
            website: feature.properties["website"] ?? "no web available"
        })
    }

}