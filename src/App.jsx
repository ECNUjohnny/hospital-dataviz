import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import L, { latLng } from 'leaflet';

import {hospitalIcon, clinicIcon, doctorsIcon} from './mapIcon'
import { MapIcon } from 'lucide-react';

const CITY_CONFIGS = {
  tokyo: { center: [35.6895, 139.6917], bounds: [[35.50, 139.50], [35.85, 140.00]] },
  shanghai: { center: [31.2304, 121.4737], bounds: [[30.90, 121.10], [31.50, 121.80]] }
};

function ChangeView({ config }) {
  const map = useMap();
  map.setView(config.center, 12);
  map.setMaxBounds(config.bounds);
  return null;
}

function App() {

  const [activeCity, setActiveCity] = useState('shanghai');

  const [geoDat, setgeoDat] = useState(null);

  const [polygonCenters, setPolygonCenters] = useState([]);

  useEffect(() => {
    fetch('/Shanghai.geojson')
      .then(response => response.json())
        .then(data => {
          console.log("Successfully get the data!", data);
          setgeoDat(data);

          const centers = [];
          data.features.forEach((feature, index) => {
            
            let geoType = feature.geometry.type;
            
            if (geoType = "Polygon" || geoType == "multipolygon") {
              const tempLayer = L.geoJSON(feature);
              const center = tempLayer.getBounds().getCenter();

              centers.push({
                id: feature.id || `poly-${index}`,
                position: [center.lat, center.lng],
                type: feature.properties.amenity,
                name: feature.properties.name || "未知医疗机构"
              })
            }
          
            setPolygonCenters(centers);
              
          })

        })
        .catch(error => console.error("Failed to get the data", error));
  }, []);

  const pointToLayer = (feature, latlng) => {
    const type = feature.properties.amenity;

    if (type == 'hospital') return L.marker(latlng, {icon: hospitalIcon});
    else if (type == 'clinic') return L.marker(latlng, {icon: clinicIcon});
    else return L.marker(latlng, {icon: doctorsIcon})
  }
  
  return (
    // 最外层容器
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '280px 1fr', 
      height: '100vh', 
      width: '100vw', 
      backgroundColor: '#020305', 
      color: '#e2e8f0',
      overflow: 'hidden' 
    }}>

      {/* 左侧：控制台 (Sidebar) */}
      <div style={{ 
        padding: '24px', 
        backgroundColor: '#080c13', 
        borderRight: '1px solid #030507',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px' 
      }}>
        <div>
          <h1 style={{ fontSize: '24px', margin: '0 0 8px 0', color: '#f8fafc' }}>🏥Public Hygiene and Sanitary</h1>
          
        </div>

        {/* 控制按钮组 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
          <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '1px' }}>choose the city</p>
          
          <button onClick={() => setActiveCity('tokyo')} style={{ 
            padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s',
            backgroundColor: activeCity === 'tokyo' ? '#3b82f6' : '#334155', color: 'white'
          }}>🗼 Tokyo</button>
          
          <button onClick={() => setActiveCity('shanghai')} style={{ 
            padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s',
            backgroundColor: activeCity === 'shanghai' ? '#3b82f6' : '#334155', color: 'white'
          }}>🏬 Shanghai</button>
        </div>
        
        {/* 这里以后可以放更多的控件，比如：显示热力图开关、医院等级筛选等 */}
        <div style={{ marginTop: 'auto', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
          
        </div>
      </div>

      {/* 右侧：主展示区 (划分为上地图、下数据) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateRows: '80% 20%', 
        height: '100%' 
      }}>
        
        {/* 区域 1：地图基座 */}
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <MapContainer 
            center={CITY_CONFIGS[activeCity].center} 
            zoom={12} 
            minZoom={10} 
            maxBounds={CITY_CONFIGS[activeCity].bounds} 
            maxBoundsViscosity={1.0} 
            zoomControl={false}
            style={{ height: '100%', width: '100%' }}
          >
            <ChangeView config={CITY_CONFIGS[activeCity]} />
            <TileLayer
              attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            />

            {geoDat && activeCity === 'shanghai' && (
              <>
              <GeoJSON 
                data = {geoDat} 
                pointToLayer = {pointToLayer}
                // style = {getPolygonStyle}
                // onEachFeature = {onEachFeature}
              />
              
              {polygonCenters.map(marker => {
                let currentIcon = doctorsIcon;
                if (marker.type === 'hospital') currentIcon = hospitalIcon;
                else if (marker.type === 'clinic') currentIcon = clinicIcon;

                return(
                  <Marker
                    key = {marker.id}
                    position = {marker.position}
                    icon = {currentIcon}
                  >

                  </Marker>
                )
              })}

              </>
            )}
          </MapContainer>
          
          {/* 地图上的悬浮标题 */}
          <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000, backgroundColor: 'rgba(30, 41, 59, 0.85)', padding: '10px 20px', borderRadius: '8px', backdropFilter: 'blur(8px)', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
            <h2 style={{ margin: 0, fontSize: '16px' }}>当前视图: {activeCity === 'tokyo' ? '东京核心区' : '上海核心区'}</h2>
          </div>
        </div>

        {/* 区域 2：图表展示区 (下方数据面板) */}
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#070b14',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px',
          overflowY: 'auto'
        }}>
          {/* 左侧图表占位 */}
          <div style={{ backgroundColor: '#060b12', borderRadius: '12px', border: '1px solid #334155', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#64748b' }}>📊 [图表位 1] 等待 ECharts 接入...</span>
          </div>
          
          {/* 右侧图表占位 */}
          <div style={{ backgroundColor: '#04070b', borderRadius: '12px', border: '1px solid #334155', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#64748b' }}>📈 [图表位 2] 等待 ECharts 接入...</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;