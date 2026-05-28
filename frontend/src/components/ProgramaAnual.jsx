import { useEffect, useState } from 'react';
import { mapaService } from '../services/api';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

const ProgramaAnual = () => {
  const [datos, setDatos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mapaService.getAnexos()
      .then(res => setDatos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const datosFiltrados = datos.filter(d =>
    d.colegios?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirPdf = (colegio) => {
    const url = `${BASE}/anexos/pdf/${encodeURIComponent(colegio)}`;
    window.open(url, '_blank');
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="tbl-page">
      <div className="tbl-topbar">
        <div className="tbl-title-area">
          <h2>📋 Anexos de Ejecución — Avances por Estado</h2>
          <span className="tbl-badge">{datosFiltrados.length} registros</span>
        </div>
        <div className="tbl-filters">
          <div className="tbl-filter-group">
            <label>🎓 Colegio</label>
            <input
              type="text"
              placeholder="Buscar colegio..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>
          {busqueda && (
            <button className="tbl-clear-btn" onClick={() => setBusqueda('')}>✕ Limpiar</button>
          )}
        </div>
      </div>

      <div className="tbl-wrapper">
        <table className="tbl-main">
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Colegios</th>
              <th>Anexos 2024</th>
              <th>Anexos de Ejecución</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={3} className="tbl-empty">No se encontraron resultados</td>
              </tr>
            ) : (
              datosFiltrados.map(row => (
                <tr key={row.id}>
                  <td className="tbl-col-colegio">{row.colegios}</td>
                  <td className="tbl-num">{row.anexos2024 ?? '—'}</td>
                  <td className="tbl-num">
                    <button
                      className="anexo-btn-abrir"
                      onClick={() => abrirPdf(row.colegios)}
                    >
                      📄 Ver PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgramaAnual;
