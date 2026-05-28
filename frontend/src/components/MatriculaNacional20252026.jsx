import { useEffect, useState } from 'react';
import { mapaService } from '../services/api';

const MatriculaNacional20252026 = () => {
  const [datos, setDatos] = useState([]);
  const [colegio, setColegio] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mapaService.getMatriculaNacional20252026()
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
          <h2>📊 Matrícula Nacional 2025-2026</h2>
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
              <th rowSpan={2}>Colegio</th>
              <th rowSpan={2}>Hombres</th>
              <th rowSpan={2}>Mujeres</th>
              <th rowSpan={2}>Total </th>
              <th rowSpan={2}>Hombres</th>
              <th rowSpan={2}>Mujeres</th>
              <th rowSpan={2}>Total</th>
              <th rowSpan={2}>Matricula CECyTE</th>
              <th rowSpan={2}>Matricula EMSAD</th>
              <th rowSpan={2}>Total Matricula</th>
              <th rowSpan={2}>Semestre 1</th>
              <th rowSpan={2}>Semestre 3</th>
              <th rowSpan={2}>Semestre 5</th>
              <th rowSpan={2}>Total</th>
            </tr>
            <tr></tr>
          </thead>
          <tbody>
            {datosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={14} className="tbl-empty">No se encontraron resultados</td>
              </tr>
            ) : (
              datosFiltrados.map(row => (
                <tr key={row.id}>
                  <td className="tbl-col-colegio">{row.colegio}</td>
                  <td className="tbl-num">{row.hombres1 ?? '—'}</td>
                  <td className="tbl-num">{row.mujeres1 ?? '—'}</td>
                  <td className="tbl-num tbl-subtotal">{row.totalC ?? '—'}</td>
                  <td className="tbl-num">{row.hombres2 ?? '—'}</td>
                  <td className="tbl-num">{row.mujeres2 ?? '—'}</td>
                  <td className="tbl-num tbl-subtotal">{row.totalE ?? '—'}</td>
                  <td className="tbl-num">{row.matriculaCecyte ?? '—'}</td>
                  <td className="tbl-num">{row.matriculaEmsad ?? '—'}</td>
                  <td className="tbl-num tbl-subtotal">{row.totalMatricula1 ?? '—'}</td>
                  <td className="tbl-num">{row.semestre1 ?? '—'}</td>
                  <td className="tbl-num">{row.semestre3 ?? '—'}</td>
                  <td className="tbl-num">{row.semestre5 ?? '—'}</td>
                  <td className="tbl-num tbl-total">{row.totalMatricula2 ?? '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MatriculaNacional20252026;
