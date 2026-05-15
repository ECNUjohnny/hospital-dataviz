import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useState } from 'react'
import 'leaflet/dist/leaflet.css'
import './App.css'

const CITY_CONFIGS = {
  tokyo: {
    center: [35.6895, 139.6917],

    bounds: [[35.50, 139.50], [35.85, 140.00]]
  },
  shanghai: {
    center: [31.2304, 121.4737],

    bounds: [[30.90, 121.10], [31.50, 121.80]]
  }
}

function ChangeView({config}) {

  const map = useMap();

  map.setView(config.center, 12);

  map.setMaxBounds(config.bounds);

  return null;
}

function App() {
  const [city, setcity] = useState('tokyo');
  
  return (
    <div style = {{padding: '40px', fontFamily: 'sans-serif', maxWidth: '2000px', margin: '0 auto'}}>
      <h1>Hospitals and Nursehouses</h1>
      <p></p>

      <div style = {{marginBottom: '20px'}}>
        <button 
          onClick = {() => setcity('tokyo')}
          style = {{marginRight: '10px', padding: '10px 20px', cursor: 'pointer', backgroundColor: city === 'tokyo' ? '#3b82f6' : '#e2e8f0', color: city === 'tokyo' ? 'white' : 'black', border: 'none', borderRadius: '4px'}}  
        >
          🗼Tokyo
        </button>

        <button 
          onClick = {() => setcity('shanghai')}
          style = {{marginRight: '10px', padding: '10px 20px', cursor: 'pointer', backgroundColor: city === 'tokyo' ? '#3b82f6' : '#e2e8f0', color: city === 'tokyo' ? 'white' : 'black', border: 'none', borderRadius: '4px'}}  
        >
          🏬Shanghai
        </button>
      </div>

      <div style = {{border: '2px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden'}}>
        <MapContainer
          center={CITY_CONFIGS[city].center} 
          zoom={12} 
          minZoom={10} 
          maxBounds={CITY_CONFIGS[city].bounds} 
          maxBoundsViscosity={1.0} 
          style={{ height: '600px', width: '100%' }}
        >
          <ChangeView config = {CITY_CONFIGS[city]} />

          <TileLayer 
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        </MapContainer>
      </div>
    </div>
  )
}

export default App