import fs from 'fs';

const inputFile = './public/tokyo_road.geojson'; 
const outputFile = './public/tokyo_road_min.geojson';

console.log('开始读取文件...');
const rawData = fs.readFileSync(inputFile, 'utf8');
const geojson = JSON.parse(rawData);

console.log(`原数据包含 ${geojson.features.length} 条道路`);

function roundCoordinate(coords) {
    
    if (typeof coords[0] === 'number') {
        return [Number(coords[0].toFixed(5)), Number(coords[1].toFixed(5))];
    }

    return coords.map(roundCoordinate);
}

geojson.features = geojson.features.map(feature => {
    return {
        type: "Feature",

        properties: {
            highway: feature.properties.highway, 
            name: feature.properties.name || ""
        },

        geometry: {
            type: feature.geometry.type,
            coordinates: roundCoordinate(feature.geometry.coordinates)
        }
    };
});

fs.writeFileSync(outputFile, JSON.stringify(geojson));

const oldSize = (fs.statSync(inputFile).size / (1024 * 1024)).toFixed(2);
const newSize = (fs.statSync(outputFile).size / (1024 * 1024)).toFixed(2);
const ratio = (((oldSize - newSize) / oldSize) * 100).toFixed(1);

console.log(`文件体积: ${oldSize} MB   ${newSize} MB (减少了 ${ratio}%)`);