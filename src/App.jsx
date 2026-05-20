import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import L, { latLng } from 'leaflet';
import Microlink from '@microlink/react';
import { DistrictChart } from './DistrictChart';
import nearestPointOnLine from '@turf/nearest-point-on-line';
import { point, featureCollection } from '@turf/helpers';

import { hospitalIcon, clinicIcon, doctorsIcon } from './mapIcon';
import { MapIcon } from 'lucide-react';
import { useCityData } from './useCityData';
import { onEachFeature, pointToLayer } from './OnEachFeature';
import { HeatmapLayer } from './HeatmapLayer';
import { ChangeView } from './ChangeView';
import { useRoute } from './useRoute';

const CITY_CONFIGS = {
  tokyo: { center: [35.6895, 139.6917], bounds: [[35.00, 139.20], [36.00, 140.50]] },
  shanghai: { center: [31.2304, 121.4737], bounds: [[30.20, 120.50], [31.90, 122.30]] }
};

function App() {

  const [activeCity, setActiveCity] = useState('shanghai');

  const {geoData, polygonCenters, districtData, road} = useCityData(activeCity);

  const [showHeatmap, setShowHeatmap] = useState(false);

  const [showDistrict, setShowDistrict] = useState(false);

  const [showRoad, setShowRoad] = useState(false);

  // const [activeRoute, setActiveRoute] = useState(null);
  
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
        
        {/* 更多控制选项 */}
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#64748b'}}>
          <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '1px' }}>panel</p>
        
          <button onClick = {() => setShowHeatmap(!showHeatmap)} style = {{
            padding: '12px', borderRadius: '8px', border: '1px solid', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s',
            backgroundColor: showHeatmap ? '#ef4444' : 'transparent', 
            borderColor: showHeatmap ? '#ef4444' : '#334155',
            color: 'white'
          }}>
            Open the Heatmap
          </button >

          <button onClick = {() => setShowDistrict(!showDistrict)} style = {{
            padding: '12px', borderRadius: '8px', border: '1px solid', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s',
            backgroundColor: showDistrict ? '#2c6adf' : 'transparent', 
            borderColor: showDistrict ? '#342bdb' : '#334155',
            color: 'white', textAlign: 'left', marginTop: '12px'
          }}>
            Show the district
          </button>

          <button onClick = {() => setShowRoad(!showRoad)} style = {{
            padding: '12px', borderRadius: '8px', border: '1px solid', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s',
            backgroundColor: showRoad ? '#139297' : 'transparent', 
            borderColor: showRoad ? '#1ca0a7' : '#334155',
            color: 'white', textAlign: 'left', marginTop: '12px'
          }}>
            Show the road net
          </button>
        </div>
      </div>

      {/* 右侧：主展示区 (划分为上地图、下数据) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateRows: '60% 40%', 
        height: '100%' 
      }}>
        
        {/* 区域 1：地图基座 */}
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <MapContainer 
            center={CITY_CONFIGS[activeCity].center} 
            preferCanvas={true}
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

            {showRoad && road && (
              <GeoJSON
                data = {road}
                style = {{
                  color: '#4f1cbc', 
                  weight: 1.5,
                  opacity: 0.6
                }}
              />
            )}

            {geoData && (
              <>

              {showHeatmap && <HeatmapLayer points={polygonCenters} />}

              {showDistrict && districtData && (
                <GeoJSON
                  key={`district-boundary-${activeCity}`}
                  data={districtData} 
                  style={{
                    color: '#3b82f6',       
                    weight: 2,              
                    opacity: 0.8,           
                    fillColor: '#1e3a8a',   
                    fillOpacity: 0.1,       
                    dashArray: '5, 5'       
                  }}
                />
              )}

              {1 && (
               <GeoJSON 
                data = {geoData} 
                key = {`${activeCity}-${geoData.features.length}`}
                pointToLayer = {pointToLayer}
                // style = {getPolygonStyle}
                onEachFeature = {onEachFeature}
              /> 
              )}
              
              {polygonCenters.map(marker => {
                
                // if (showRoad) return null;
                
                if (marker.isPoint) return null;
                 
                let currentIcon = doctorsIcon;
                if (marker.type === 'hospital') currentIcon = hospitalIcon;
                else if (marker.type === 'clinic') currentIcon = clinicIcon;

                return(
                  <Marker
                    key = {marker.id}
                    position = {marker.position}
                    icon = {currentIcon}
                  >
                    <Popup>
                      <div style={{ minWidth: '180px', fontFamily: 'sans-serif' }}>
                        <h3 style={{ margin: '0 0 8px 0', color: '#3b82f6', fontSize: '16px', borderBottom: '1px solid #cbd5e1', paddingBottom: '6px' }}>
                          {marker.name}
                        </h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <p style={{ margin: 0, fontSize: '13px', color: '#1e293b' }}>
                            <b>type: </b>{marker.type === 'hospital' ? '🏥 hospital' : '🩺 clinic'}
                          </p>
                          <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                            📍 {marker.street}
                          </p>
                          <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                            🚪 {marker.housenumber} number
                          </p>
                          <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                            📭 {marker.postcode} 
                          </p>
                          <p style={{ margin: 0, fontSize: '12px', color: '#475569' }}>
                            🌐 {marker.website}
                          </p>
        
                        </div>
                        
                        {marker.website !== "no web available" && (
                          <div style={{ marginTop: '10px' }}>
                            <Microlink 
                              url={marker.website} 
                              size="large" // 卡片大小
                              style={{ width: '100%', borderRadius: '8px' }}
                            />
                          </div>
                        )}

                      </div>
                    </Popup>
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

        {/* 区域 2：图表展示区 */}
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
            <DistrictChart data={polygonCenters} cityName={activeCity}/>
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