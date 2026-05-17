import { useState, useEffect } from 'react';
import L from 'leaflet';

/** 
*
*   @param {string} cityName
*
*/

export const useCityData = (cityName) => {
    
    const [geoData, setGeoData] = useState(null);
    
    const [polygonCenters, setPolygonCenters] = useState([]);

    // console.log(cityName);

    useEffect(() => {
        
        if (!cityName) return;

        const url = `/${cityName}.geojson`;

        fetch(url)
         .then(response => response.json())
          .then(data => {
            setGeoData(data);

            console.log(data.features.length);

            const centers = [];

            data.features.forEach((feature, index) => {
                
                if (!feature.geometry || !feature.geometry.coordinates) return;

                const geoType = feature.geometry.type;

                if (geoType === 'Polygon' || geoType === 'MultiPolygon') {
                    const tempLayer = L.geoJSON(feature);

                    const center = tempLayer.getBounds().getCenter();

                    centers.push({
                        id: feature.id || `poly-${index}`,
                        isPoint: feature.geometry.type === 'Point',    
                        position: [center.lat, center.lng],
                        type: feature.properties.amenity,
                        name: feature.properties.name || "unknown agency",

                        housenumber: feature.properties["addr:housenumber"] ?? "unregistered",
                        postcode: feature.properties["addr:postcode"] ?? "unregistered",
                        street: feature.properties["addr:street"] ?? "unregistered",
                        website: feature.properties["website"] ?? "no web available"
                    })
                }
                else if (geoType === 'Point')
                {
                    centers.push({
                        id: feature.id || `point-${index}`,
                        isPoint: feature.geometry.type === 'Point',
                        position: [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
                        type: feature.properties.amenity,
                        name: feature.properties.name || "unknown agency",

                        housenumber: feature.properties["addr:housenumber"] ?? "unregistered",
                        postcode: feature.properties["addr:postcode"] ?? "unregistered",
                        street: feature.properties["addr:street"] ?? "unregistered",
                        website: feature.properties["website"] ?? "no web available"
                    })
                }
            });

            setPolygonCenters(centers);
          })
            .catch(error => console.error(`Failed to get the data for ${cityName}`, error));
    }, [cityName]);
      
    return { geoData, polygonCenters };
      
       
}