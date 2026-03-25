import React, { useState } from 'react';
import { MapContainer, TileLayer, ZoomControl, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// ── Página principal del mapa ──────────────────────────────────────────────
const CorridorMap = () => {
    // Estado principal de la aplicación
    const [center]                      = useState([9.9875, -84.7950]); // Coordenadas iniciales del centro del mapa
    const mapRef = React.useRef(null); // Referencia al objeto principal del mapa de Leaflet

    return (
        <div style={{ height: 'calc(100vh - 4rem)', position: 'relative', overflow: 'hidden', display: 'flex' }}>
            
            {/* 1. Mapa Principal a pantalla completa */}
            <div style={{ flex: 1, height: '100%', position: 'relative' }}>
                <MapContainer
                    center={center}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
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
                    <div style={{ 
                        position: 'absolute', 
                        top: '20px', 
                        left: '20px', 
                        zIndex: 1000,
                        pointerEvents: 'auto'
                    }}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            padding: '15px 20px',
                            borderRadius: '16px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            maxWidth: '300px'
                        }}>
                            <h2 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: '#1a4332' }}>Mapa Biológico</h2>
                            <p style={{ margin: '0 0 15px 0', fontSize: '0.85rem', color: '#666' }}>Puntarenas (Chacarita - Porto Bello)</p>
                            
                            <a 
                                href="https://www.google.com/maps/@9.9875,-84.795,15z/data=!3m1!1e3" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    padding: '10px 15px',
                                    background: '#1a73e8',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '10px',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 4px 12px rgba(26, 115, 232, 0.3)'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>📍</span> Ver en Google Maps
                            </a>
                        </div>
                    </div>
                </MapContainer>
            </div>

            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(-100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .custom-marker { 
                    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3)); 
                }
                .custom-marker:hover > div {
                    transform: rotate(-45deg) scale(1.1) !important;
                    box-shadow: 0 8px 18px rgba(0,0,0,0.5) !important;
                }
            `}</style>
        </div>
    );
};

export default CorridorMap;
