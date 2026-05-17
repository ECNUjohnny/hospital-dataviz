import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

export const HeatmapLayer = ({ points }) => {

  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;


    const heatData = points.map(p => {
      
      const intensity = p.type === 'hospital' ? 1.0 : 0.4;
      return [p.position[0], p.position[1], intensity];
    });

    const heatLayer = L.heatLayer(heatData, {
      radius: 40,     
      blur: 55,       
      maxZoom: 12,    
      max: 1.5,
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [points]); 

  return null; 
};