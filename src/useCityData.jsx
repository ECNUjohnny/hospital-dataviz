import { useState, useEffect } from 'react';
import L from 'leaflet';
import * as turf from '@turf/turf';
import PathFinder from 'geojson-path-finder';
import { handleGeoData } from './handleGeoData';

/** 
*
*   @param {string} cityName
*
*/

export const useCityData = (
    cityName,
    geoData,
    setGeoData,
    district,
    setDistrict,
    polygonCenters,
    setPolygonCenters,
    roadData, 
    setRoadData,
    pathEngine, 
    setPathEngine,
    isBuilding, 
    setIsBuilding

) => {
    
    // console.log(cityName);

    useEffect(() => {
        
        if (!cityName) return;

        if (cityName.startsWith("custom")) return;

        const url = `/${cityName}.geojson`;

        const url_district = `/${cityName}_district.geojson`;

        const url_road = `/${cityName}_road_min.geojson`;

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

            }, 100);

            // const engine = new PathFinder(roadData, {precision: 1e-4});

            // setPathEngine(engine);

            // console.log(districtData.features.length);

            console.log(data.features.length);

            // console.log(district.features.length);

            const centers = [];

            data.features.forEach((feature, index) => {
                
                handleGeoData(feature, index, centers, districtData);
                
            });

            setPolygonCenters(centers);

            console.log(centers.length);

            // let centers_point = [];

            // centers_point = centers.filter((item) => item.isPoint === true);

            // console.log(centers_point.length);
          })
            .catch(error => console.error(`Failed to get the data for ${cityName}`, error));
    }, [cityName]);
      
    return;
      
       
}