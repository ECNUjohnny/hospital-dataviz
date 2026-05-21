import nearestPointOnLine from '@turf/nearest-point-on-line';
import { point, featureCollection } from '@turf/helpers';
import explode from '@turf/explode';
import nearestPoint from '@turf/nearest-point';


/**
 * 
 * @param {Object} pathEngine 
 * @param {Object} roadsData 
 * @param {Array} startCoords 
 * @param {Array} endCoords 
 * @returns {Object} 
 */

export const calculateRoute = (pathEngine, roadsData, startCoords, endCoords) => {

    if (!pathEngine || !roadsData) {
        
        throw new Error("not ready");
    }

    const startPt = point(startCoords);
    const targetPt = point(endCoords);

    const allNodes = explode(roadsData);
    

    const snappedStart = nearestPoint(startPt, allNodes);
    const snappedEnd = nearestPoint(targetPt, allNodes);

    const path = pathEngine.findPath(snappedStart, snappedEnd);

    if (path && path.path) {
        
        return {
            type: "Feature",
            properties: {
                weight: path.weight 
            },

            geometry: {
                type: "LineString",
                coordinates: path.path
            }
        };
    } 
    else {
        throw new Error("Cannot find a right route");
    }
}