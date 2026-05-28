import { useEffect, useState } from 'react';
import { mapaService } from '../services/api';

const DocentesPorEstado = () => {
  const [datos, setDatos] = useState([]);
  const [estado, setEstado] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mapaService.getDocentesPorEstado()
      .then(res => setDatos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const estados = [...new Set(datos.map(d => d.estado).filter(Boolean))].sort();

  const datosFiltrados = estado
    ? datos.filter(d => d.estado === estado)
    : datos;

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="tbl-page">
      <div className="tbl-topbar">
        <div className="tbl-title-area">
          <h2>👨‍🏫 Docentes por Estado</h2>
          <span className="tbl-badge">{datosFiltrados.length} registros</span>
        </div>
        <div className="tbl-filters">
          <div className="tbl-filter-group">
            <label>🗺️ Estado</label>
            <select value={estado} onChange={e => setEstado(e.target.value)}>
              <option value="">Todos</option>
              {estados.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          {estado && (
            <button className="tbl-clear-btn" onClick={() => setEstado('')}>✕ Limpiar</button>
          )}
        </div>
      </div>

      <div className="tbl-wrapper">
        <table className="tbl-main">
          <thead>
            <tr>
              <th rowSpan={2}>Estado</th>
              <th rowSpan={2}>Total Planteles con Captura</th>
            
            </tr>
            <tr>
              <th>Total de Docentes</th>
              <th>Total de Docentes Hombres</th>
              <th>Total de Docentes Mujeres</th>
              <th>Total de Horas</th>
              <th>Total de Horas Hombres</th>
              <th>Toral de Horas Mujeres</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={8} className="tbl-empty">No se encontraron resultados</td>
              </tr>
            ) : (
              datosFiltrados.map(row => (
                <tr key={row.id}>
                  <td className="tbl-col-colegio">{row.estado}</td>
                  <td className="tbl-num">{row.totalPlantelesConCaptura ?? '—'}</td>
                  <td className="tbl-num tbl-subtotal">{row.totalDocentes ?? '—'}</td>
                  <td className="tbl-num">{row.totalDocentesHombres ?? '—'}</td>
                  <td className="tbl-num">{row.totalDocentesMujeres ?? '—'}</td>
                  <td className="tbl-num tbl-subtotal">{row.totalHoras ?? '—'}</td>
                  <td className="tbl-num">{row.totalHorasHombres ?? '—'}</td>
                  <td className="tbl-num">{row.totalHorasMujeres ?? '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocentesPorEstado;
