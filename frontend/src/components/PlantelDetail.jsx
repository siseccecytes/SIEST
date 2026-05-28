import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const PlantelDetail = ({ plantel }) => {
  return (
    <div className="plantel-detail">
      <div className="detail-header">
        <h2>{plantel.nombre}</h2>
        <span className="clave">{plantel.clave}</span>
      </div>

      <div className="detail-map">
        <MapContainer 
          center={[plantel.latitud, plantel.longitud]} 
          zoom={15} 
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          <Marker position={[plantel.latitud, plantel.longitud]}>
            <Popup>{plantel.nombre}</Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="detail-info">
        <div className="info-section">
          <h3>Ubicación</h3>
          <p><strong>Estado:</strong> {plantel.estadoNombre}</p>
          <p><strong>Municipio:</strong> {plantel.municipioNombre}</p>
          <p><strong>Dirección:</strong> {plantel.direccion}</p>
        </div>

        <div className="info-section">
          <h3>Contacto</h3>
          <p><strong>Teléfono:</strong> {plantel.telefono}</p>
          <p><strong>Email:</strong> {plantel.email}</p>
        </div>

        <div className="info-section">
          <h3>Información General</h3>
          <p><strong>Director:</strong> {plantel.director}</p>
          <p><strong>Turno:</strong> {plantel.turno}</p>
          <p><strong>Total de Alumnos:</strong> {plantel.totalAlumnos}</p>
          <p><strong>Total de Docentes:</strong> {plantel.totalDocentes}</p>
        </div>
      </div>
    </div>
  );
};

export default PlantelDetail;
