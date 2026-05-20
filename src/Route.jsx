import nearestPointOnLine from '@turf/nearest-point-on-line';
import { point, featureCollection } from '@turf/helpers';

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
        
        throw new error("Not ready");
    }

    const startPt = point(startCoords);
    const targetPt = point(endCoords);

    const snappedStart = nearestPointOnLine(roadsData, startPt);
    const snappedEnd = nearestPointOnLine(roadsData, targetPt);

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
        throw new error("Cannot find a right route");
    }
}