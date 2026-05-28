const InfoFederal = ({ datos }) => {
  if (!datos || datos.length === 0) return null;

  return (
    <div className="info-federal">
      <h2>Datos Nacionales CECYTES</h2>
      <table className="tabla-federal">
        <thead>
          <tr>
            <th>Indicador</th>
            <th>Aprobación 2024-2025</th>
            <th>Desafiliación 2024-2025</th>
            <th>Eficiencia Terminal 2024-2025</th>
            <th>Docentes 2025-2026</th>
            <th>Matrícula</th>
            <th>Carreras</th>
            <th>Titular</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((dato, index) => (
            <tr key={index}>
              <td>{dato.indicador}</td>
              <td>{dato.aprobacion}%</td>
              <td>{dato.desafiliacion}%</td>
              <td>{dato.eficienciaTerminal}%</td>
              <td>{dato.docentes}</td>
              <td>{dato.matricula?.toLocaleString()}</td>
              <td>{dato.carreras}</td>
              <td>{dato.titular}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InfoFederal;
