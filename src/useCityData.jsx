import { useState, useEffect } from 'react';
import L from 'leaflet';
import * as turf from '@turf/turf';
import PathFinder from 'geojson-path-finder';

/** 
*
*   @param {string} cityName
*
*/

export const useCityData = (cityName) => {
    
    const [geoData, setGeoData] = useState(null);
    
    const [polygonCenters, setPolygonCenters] = useState([]);

    const [district, setDistrict] = useState(null);

    const [roadData, setRoadData] = useState(null);

    const [pathEngine, setPathEngine] = useState(null);

    const [isBuilding, setIsBuilding] = useState(false);
 
    // console.log(cityName);

    useEffect(() => {
        
        if (!cityName) return;

        const url = `/${cityName}.geojson`;

        const url_district = `/${cityName}_district.geojson`;

        const url_road = `/${cityName}_road.geojson`;

        // fetch(url_district).then(response => response.json()).then(data => {setDistrict(data)});

        // console.log(district.feature);

        


        Promise.all([
            fetch(url).then(res => res.json()),
            fetch(url_district).then(res => res.json()),
            fetch(url_road).then(res => res.json())
        ])
          .then(([data, districtData, roadData]) => {
            
            setGeoData(data);
            setDistrict(districtData);
            setRoadData(roadData);
            
            setIsBuilding(true);

            setTimeout(() => {

                try 
                {
                    const engine = new PathFinder(roadData, {precision: 1e-4});
                    setPathEngine(engine);
                }
                catch (e) 
                {
                    console.error("Something went wrong while initiating");


                }
                finally 
                {
                    setIsBuilding(false);
                }

            }, 150);

            // const engine = new PathFinder(roadData, {precision: 1e-4});

            // setPathEngine(engine);

            console.log(districtData.features.length);

            console.log(data.features.length);

            // console.log(district.features.length);

            const centers = [];

            data.features.forEach((feature, index) => {
                
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
            
                        district_name = matchZone.properties["name:es"];
                    }
                }

                if (geoType === 'Polygon' || geoType === 'MultiPolygon') {
                    // const tempLayer = L.geoJSON(feature);

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
                else if (geoType === 'Point')
                {
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
            });

            setPolygonCenters(centers);

            // console.log(centers);
          })
            .catch(error => console.error(`Failed to get the data for ${cityName}`, error));
    }, [cityName]);
      
    return { geoData, polygonCenters, districtData: district, roadData, pathEngine, isBuilding };
      
       
}