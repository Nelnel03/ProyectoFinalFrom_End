import React, { useState } from 'react';
import { MapContainer, TileLayer, ZoomControl, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/CorridorMap.css';

// ── Página principal del mapa ──────────────────────────────────────────────
const CorridorMap = () => {
    // Estado principal de la aplicación
    const [center]                      = useState([9.9875, -84.7950]); // Coordenadas iniciales del centro del mapa
    const mapRef = React.useRef(null); // Referencia al objeto principal del mapa de Leaflet

    return (
        <div className="map-wrapper">
            
            {/* 1. Mapa Principal a pantalla completa */}
            <div className="map-container-main">
                <MapContainer
                    center={center}
                    zoom={15}
                    className="leaflet-container-full"
                    zoomControl={false}
                    ref={mapRef}
                >
                    <ZoomControl position="bottomright" />
                    
                    <LayersControl position="topright">
                        {/* Satélite (Por defecto) sugerencia para naturaleza */}
                        <LayersControl.BaseLayer checked name="Satélite (Esri World Imagery)">
                            <TileLayer
                                attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            />
                        </LayersControl.BaseLayer>
                        
                        {/* Satélite + Etiquetas (Google Maps Hybrid) */}
                        <LayersControl.BaseLayer name="Satélite y Calles (Google)">
                            <TileLayer
                                attribution="&copy; Google Maps"
                                url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                            />
                        </LayersControl.BaseLayer>

                        {/* Mapa Cartográfico Clásico (OpenStreetMap Voyager) */}
                        <LayersControl.BaseLayer name="Estándar">
                            <TileLayer
                                attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
                                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            />
                        </LayersControl.BaseLayer>
                    </LayersControl>

                    {/* Botón de Google Maps Flotante */}
                    <div className="map-floating-overlay">
                        <div className="map-info-card">
                            <h2 className="map-info-title">Mapa Biológico</h2>
                            <p className="map-info-subtitle">Puntarenas (Chacarita - Porto Bello)</p>
                            
                            <a 
                                href="https://www.google.com/maps/@9.9875,-84.795,15z/data=!3m1!1e3" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="google-maps-btn"
                            >
                                <span className="btn-icon">📍</span> Ver en Google Maps
                            </a>
                        </div>
                    </div>
                </MapContainer>
            </div>
        </div>
    );
};

export default CorridorMap;
