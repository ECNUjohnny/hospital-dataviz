import { useEffect, useState, useRef } from 'react';
import { CITY_CONFIGS } from './App';
import L from 'leaflet';
import * as turf from '@turf/turf';
import PathFinder from 'geojson-path-finder';

import { handleGeoData } from './handleGeoData';

/** 
 * @param {function} setActiveCity
 * @param {function} setUploadCities
 * 
 * 
 * 
 * 
 * 
*/


export const handleFile = async (
    event, 
    setActiveCity, 
    setUploadCities, 
    uploadCities,

) => {

    const files = Array.from(event.target.files);

    if (files.length === 0) return;

    if (files.length != 3) {

        alert("Please hold ctrl/shift to choose three files: road, district and medical agencies");

        return;

    }

    const readJsonFile = (file) => {

        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const jsonData = JSON.parse(e.target.result);

                    resolve({fileName: file.name, data: jsonData});
                }
                catch(error) {
                    reject(`something went wrong while parsing ${file.name}`);
                }
            };

            reader.readAsText(file);
        });

    };

    let customGeoData = null;
    let customDistrictData = null;
    let customRoadData = null;

    try {

        const parsedFiles = await Promise.all(files.map(readJsonFile));

        parsedFiles.forEach(fileObj => {

            const name = fileObj.fileName.toLowerCase();

            if (name.includes('road') || name.includes('way') || name.includes('路')) {
                customRoadData = fileObj.data;
            }
            else if (name.includes('district') || name.includes('boundary') || name.includes('区')) {
                customDistrictData = fileObj.data;
            }
            else {
                customGeoData = fileObj.data;
            }
        })
    }
    catch (error) {

        alert(error);
        console.log(error);

    }

    let centers = [];

    customGeoData.features.forEach((feature, index) => {
                    
        handleGeoData(feature, index, centers, customDistrictData);
                    
    });

    const cityName = window.prompt(`Set your own city ${uploadCities.length + 1}'s name`);

    if (!cityName) return;

    const newCityId = `custom_${Date.now()}`;

    const newCity = {
        id: newCityId,
        name: cityName,
        geoData: customGeoData,
        roadData: customRoadData,
        districtData: customDistrictData,
        polygonCenters: centers,
        center: customGeoData?.features[0]?.geometry?.coordinates[0][0]?.slice().reverse() || [31.2304, 121.4737],
    };

    CITY_CONFIGS[newCityId] = {
        center: customGeoData?.features[0]?.geometry?.coordinates[0][0]?.slice().reverse() || [31.2304, 121.4737],
        bounds: null
    };

    console.log("Run to here");

    setUploadCities([...uploadCities, newCity]);
    setActiveCity(newCityId);

}