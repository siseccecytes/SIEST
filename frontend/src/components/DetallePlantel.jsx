const DetallePlantel = ({ plantel }) => {
  if (!plantel) return null;

  return (
    <div className="detalle-plantel">
      <h3>Información del Plantel</h3>
      <table className="tabla-detalle">
        <tbody>
          <tr>
            <td className="label">Colegio:</td>
            <td className="value">{plantel.colegio}</td>
          </tr>
          <tr>
            <td className="label">CCT:</td>
            <td className="value">{plantel.cct}</td>
          </tr>
          <tr>
            <td className="label">Tipo:</td>
            <td className="value">{plantel.tipo}</td>
          </tr>
          <tr>
            <td className="label">Nombre del Plantel:</td>
            <td className="value">{plantel.nombreDelPlantel}</td>
          </tr>
          {plantel.direccion && (
            <tr>
              <td className="label">Dirección:</td>
              <td className="value">{plantel.direccion}</td>
            </tr>
          )}
          <tr>
            <td className="label">Eficiencia Terminal 2024-2025:</td>
            <td className="value">{plantel.eficienciaTerminal}%</td>
          </tr>
          <tr>
            <td className="label">Desafiliación Escolar 2024-2025:</td>
            <td className="value">{plantel.desafiliacionEscolar}%</td>
          </tr>
          <tr>
            <td className="label">Reprobación 2024-2025:</td>
            <td className="value">{plantel.reprobacion}%</td>
          </tr>
          <tr>
            <td className="label">Matrícula 2025-2026:</td>
            <td className="value">{plantel.matricula}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DetallePlantel;
