const PlantelList = ({ planteles }) => {
  return (
    <div className="plantel-list">
      <h2>Planteles ({planteles.length})</h2>
      <div className="planteles-grid">
        {planteles.map((plantel) => (
          <div key={plantel.id} className="plantel-card">
            <h3>{plantel.nombre}</h3>
            <p><strong>Clave:</strong> {plantel.clave}</p>
            <p><strong>Municipio:</strong> {plantel.municipioNombre}</p>
            <p><strong>Dirección:</strong> {plantel.direccion}</p>
            <p><strong>Teléfono:</strong> {plantel.telefono}</p>
            <p><strong>Alumnos:</strong> {plantel.totalAlumnos}</p>
            <p><strong>Docentes:</strong> {plantel.totalDocentes}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlantelList;
