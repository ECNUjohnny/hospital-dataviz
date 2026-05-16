import { useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// ... (这里保留你之前的 CITY_CONFIGS 和 ChangeView 组件代码) ...
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
  const [activeCity, setActiveCity] = useState('tokyo');

  return (
    // 最外层容器：铺满全屏，使用 CSS Grid 将屏幕分为左右两列
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '280px 1fr', // 左侧固定 280px，右侧占据剩余全部空间 (1fr)
      height: '100vh', // 高度为 100% 屏幕高度
      width: '100vw', 
      backgroundColor: '#0f172a', // 整体采用深邃的微软/苹果暗黑风背景
      color: '#e2e8f0',
      overflow: 'hidden' // 防止页面出现滚动条
    }}>

      {/* 🟢 左侧：控制台 (Sidebar) */}
      <div style={{ 
        padding: '24px', 
        backgroundColor: '#1e293b', 
        borderRight: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px' // 子元素之间的间距
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

      {/* 🟢 右侧：主展示区 (划分为上地图、下数据) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateRows: '80% 20%', // 上方地图占 60% 高度，下方图表占 40%
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
            style={{ height: '100%', width: '100%' }} // 高度 100% 撑满当前网格
          >
            <ChangeView config={CITY_CONFIGS[activeCity]} />
            <TileLayer
              attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            />
          </MapContainer>
          
          {/* 地图上的悬浮标题 (类似 Google 风格的卡片) */}
          <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000, backgroundColor: 'rgba(30, 41, 59, 0.85)', padding: '10px 20px', borderRadius: '8px', backdropFilter: 'blur(8px)', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
            <h2 style={{ margin: 0, fontSize: '16px' }}>当前视图: {activeCity === 'tokyo' ? '东京核心区' : '上海核心区'}</h2>
          </div>
        </div>

        {/* 区域 2：图表展示区 (下方数据面板) */}
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#0f172a',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr', // 下方再横向切分成两个图表位
          gap: '20px',
          overflowY: 'auto'
        }}>
          {/* 左侧图表占位 */}
          <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#64748b' }}>📊 [图表位 1] 等待 ECharts 接入...</span>
          </div>
          
          {/* 右侧图表占位 */}
          <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#64748b' }}>📈 [图表位 2] 等待 ECharts 接入...</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;