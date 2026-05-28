const InfoEstatal = ({ datos, estadoNombre }) => {
  if (!datos) return null;

  return (
    <div className="info-estatal-hover">
      <h3>{estadoNombre}</h3>
      <div className="info-grid">
        {datos.titular && (
          <div className="info-item">
            <span className="label">Titular:</span>
            <span className="value">{datos.titular}</span>
          </div>
        )}
        <div className="info-item">
          <span className="label">Matrícula 2025-2026:</span>
          <span className="value">{datos.matricula}</span>
        </div>
        <div className="info-item">
          <span className="label">Eficiencia Terminal:</span>
          <span className="value">{datos.eficienciaTerminal}</span>
        </div>
        <div className="info-item">
          <span className="label">Desafiliación Escolar:</span>
          <span className="value">{datos.desafiliacionEscolar}</span>
        </div>
        <div className="info-item">
          <span className="label">Aprobación:</span>
          <span className="value">{datos.aprobacion}</span>
        </div>
        {datos.docentesA && (
          <div className="info-item">
            <span className="label">Docentes A:</span>
            <span className="value">{datos.docentesA}</span>
          </div>
        )}
        {datos.docentesB && (
          <div className="info-item">
            <span className="label">Docentes B:</span>
            <span className="value">{datos.docentesB}</span>
          </div>
        )}
        {datos.aulas && (
          <div className="info-item">
            <span className="label">Aulas:</span>
            <span className="value">{datos.aulas}</span>
          </div>
        )}
        {datos.presupuesto && (
          <div className="info-item">
            <span className="label">Presupuesto:</span>
            
            <span className="value">${datos.presupuesto.toLocaleString('es-MX')}</span>
          </div>
        )}
        {datos.direccion && (
          <div className="info-item">
            <span className="label">Dirección:</span>
            <span className="value">{datos.direccion}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoEstatal;
