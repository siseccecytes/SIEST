import { useEffect, useState } from 'react';
import { mapaService } from '../services/api';

const IndicadoresNacionales = () => {
  const [datos, setDatos] = useState([]);
  const [colegio, setColegio] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mapaService.getIndicadoresNacionales()
      .then(res => setDatos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const colegios = [...new Set(datos.map(d => d.colegio).filter(Boolean))].sort();

  const datosFiltrados = colegio
    ? datos.filter(d => d.colegio === colegio)
    : datos;

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="tbl-page">
      <div className="tbl-topbar">
        <div className="tbl-title-area">
          <h2>📈 Indicadores Nacionales</h2>
          <span className="tbl-badge">{datosFiltrados.length} registros</span>
        </div>
        <div className="tbl-filters">
          <div className="tbl-filter-group">
            <label>🎓 Colegio</label>
            <select value={colegio} onChange={e => setColegio(e.target.value)}>
              <option value="">Todos</option>
              {colegios.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {colegio && (
            <button className="tbl-clear-btn" onClick={() => setColegio('')}>✕ Limpiar</button>
          )}
        </div>
      </div>

      <div className="tbl-wrapper">
        <table className="tbl-main">
          <thead>
            <tr>
              <th>Colegio</th>
              <th>Eficiencia Terminal</th>
              <th>Aprobación</th>
              <th>Deserción</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={4} className="tbl-empty">No se encontraron resultados</td>
              </tr>
            ) : (
              datosFiltrados.map(row => (
                <tr key={row.id}>
                  <td className="tbl-col-colegio">{row.colegio}</td>
                  <td className="tbl-num">{row.eficienciaTerminal ?? '—'}</td>
                  <td className="tbl-num">{row.aprobacion ?? '—'}</td>
                  <td className="tbl-num">{row.desercion ?? '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IndicadoresNacionales;
