import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const iconoAzul = new L.Icon({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const iconoRojo = new L.Icon({
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

function MapController({ plantelSeleccionado }) {
  const map = useMap();
  useEffect(() => {
    if (plantelSeleccionado?.latitud && plantelSeleccionado?.longitud) {
      setTimeout(() => map.flyTo([plantelSeleccionado.latitud, plantelSeleccionado.longitud], 16, { duration: 1.5 }), 100);
    }
  }, [plantelSeleccionado, map]);
  return null;
}

function StreetView({ plantel, onBack }) {
  const lat = plantel.latitud;
  const lng = plantel.longitud;

  // Mapa satelital embed — funciona sin API key
  const mapaEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=18&t=k&output=embed`;

  return (
    <div className="streetview-container">
      <div className="streetview-header">
        <span className="sv-coords">📍 {lat.toFixed(5)}, {lng.toFixed(5)}</span>
        {onBack && (
          <button className="sv-btn sv-back" onClick={onBack}>← Regresar al mapa</button>
        )}
        <a
          className="sv-btn"
          href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          🚶 Abrir Street View
        </a>
        <a
          className="sv-btn"
          href={`https://www.google.com/maps?q=${lat},${lng}&z=18&t=k`}
          target="_blank"
          rel="noopener noreferrer"
        >
          🗺️ Ver satélite
        </a>
      </div>
      <iframe
        title={plantel.nombreDelPlantel}
        src={mapaEmbedUrl}
        className="streetview-iframe"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

const MapView = ({ estados, planteles, onEstadoHover, onEstadoClick, onPlantelClick, onBack, center = [23.6345, -102.5528], zoom = 5, plantelSeleccionado }) => {

  if (plantelSeleccionado?.latitud && plantelSeleccionado?.longitud) {
    return <StreetView plantel={plantelSeleccionado} onBack={onBack} />;
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '600px', width: '100%' }}
      key={`map-${center[0]}-${center[1]}`}
    >
      <MapController plantelSeleccionado={plantelSeleccionado} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {estados && estados.map((estado, index) => (
        <Marker
          key={index}
          position={[estado.latitud, estado.longitud]}
          eventHandlers={{
            mouseover: () => onEstadoHover && onEstadoHover(estado.nombre),
            mouseout: () => onEstadoHover && onEstadoHover(null),
            click: () => onEstadoClick && onEstadoClick(estado)
          }}
        >
          <Popup>
            <div className="popup-content">
              <h3>{estado.nombre}</h3>
              <p className="click-hint">Clic para ver planteles</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {planteles && planteles.map((plantel) => {
        const esSeleccionado = plantelSeleccionado && plantel.id === plantelSeleccionado.id;
        return (
          <Marker
            key={plantel.id}
            position={[plantel.latitud, plantel.longitud]}
            icon={esSeleccionado ? iconoRojo : iconoAzul}
            eventHandlers={{ click: () => onPlantelClick && onPlantelClick(plantel) }}
          >
            <Popup>
              <div className="popup-content">
                <h3>{plantel.nombreDelPlantel}</h3>
                <p><strong>CCT:</strong> {plantel.cct}</p>
                <p><strong>Tipo:</strong> {plantel.tipo}</p>
                {plantel.direccion && <p><strong>Dirección:</strong> {plantel.direccion}</p>}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapView;
