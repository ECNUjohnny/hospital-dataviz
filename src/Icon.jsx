import L from 'leaflet';

export const Icon = L.divIcon({
  html: `<div style="
    width: 16px; height: 16px; 
    background-color: #10b981; 
    border: 3px solid white; 
    border-radius: 50%; 
    box-shadow: 0 0 10px #10b981;
  "></div>`,
  className: 'custom-start-marker', // 消除默认的背景阴影
  iconSize: [22, 22],
  iconAnchor: [11, 11] // 让圆心对准点击位置
});

export const districtIcon = L.divIcon({
  html: `<div style="
    width: 12px; height: 12px; 
    background-color: #3b82f6; 
    border: 2px solid white; 
    border-radius: 50%; 
    box-shadow: 0 0 10px #3b82f6;
  "></div>`,
  className: 'custom-district-marker',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});