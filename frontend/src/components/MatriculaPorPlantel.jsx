import { useEffect, useState, useRef } from 'react';
import { mapaService } from '../services/api';
import { usePaginacion, Paginacion } from './Paginacion';

const AutocompleteCCT = ({ ccts, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const sugerencias = value
    ? ccts.filter(c => c.toLowerCase().includes(value.toLowerCase())).slice(0, 8)
    : [];

  useEffect(() => {
    const handler = e => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="autocomplete-wrap" ref={ref}>
      <input
        type="text"
        placeholder="Escribe un CCT..."
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => value && setOpen(true)}
      />
      {open && sugerencias.length > 0 && (
        <ul className="autocomplete-list">
          {sugerencias.map(s => (
            <li key={s} onMouseDown={() => { onChange(s); setOpen(false); }}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

const MatriculaPorPlantel = () => {
  const [datos, setDatos] = useState([]);
  const [filtros, setFiltros] = useState({ colegio: '', tipo: '', cct: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mapaService.getMatriculaPorPlantel()
      .then(res => setDatos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const colegios = [...new Set(datos.map(d => d.colegio).filter(Boolean))].sort();
  const tipos    = [...new Set(datos.map(d => d.tipo).filter(Boolean))].sort();
  const ccts     = [...new Set(datos.map(d => d.cct).filter(Boolean))].sort();

  const datosFiltrados = datos.filter(d => {
    const okColegio = !filtros.colegio || d.colegio === filtros.colegio;
    const okTipo    = !filtros.tipo    || d.tipo === filtros.tipo;
    const okCct     = !filtros.cct     || d.cct?.toLowerCase().includes(filtros.cct.toLowerCase());
    return okColegio && okTipo && okCct;
  });

  const hayFiltro = filtros.colegio || filtros.tipo || filtros.cct;
  const limpiar = () => setFiltros({ colegio: '', tipo: '', cct: '' });
  const set = (campo, val) => setFiltros(p => ({ ...p, [campo]: val }));

  const { paginados, pagina, setPagina, totalPaginas, inicio } = usePaginacion(datosFiltrados);

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="tbl-page">
      <div className="tbl-topbar">
        <div className="tbl-title-area">
          <h2>👥 Matrícula por Plantel</h2>
          <span className="tbl-badge">{datosFiltrados.length} registros</span>
        </div>
        <div className="tbl-filters">
          <div className="tbl-filter-group">
            <label>🎓 Colegio</label>
            <select value={filtros.colegio} onChange={e => set('colegio', e.target.value)}>
              <option value="">Todos</option>
              {colegios.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="tbl-filter-group">
            <label>🏷️ Tipo</label>
            <select value={filtros.tipo} onChange={e => set('tipo', e.target.value)}>
              <option value="">Todos</option>
              {tipos.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="tbl-filter-group">
            <label>🔑 CCT</label>
            <AutocompleteCCT ccts={ccts} value={filtros.cct} onChange={v => set('cct', v)} />
          </div>
          {hayFiltro && (
            <button className="tbl-clear-btn" onClick={limpiar}>✕ Limpiar</button>
          )}
        </div>
      </div>

      <div className="tbl-wrapper">
        <table className="tbl-main">
          <thead>
            <tr>
              <th>Colegio</th>
              <th>Tipo</th>
              <th>CCT</th>
              <th>Plantel</th>
              <th>Clave Carrera</th>
              <th>Carrera</th>
              <th>Turno</th>
              <th>Género</th>
              <th>Grupos 1ero</th>
              <th>Alumnos 1ero</th>
              <th>Grupos 3ero</th>
              <th>Alumnos 3ero</th>
              <th>Grupos 5to</th>
              <th>Alumnos 5to</th>
              <th>Total Grupos</th>
              <th>Total Alumnos</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={16} className="tbl-empty">No se encontraron resultados</td>
              </tr>
            ) : (
              paginados.map(row => (
                <tr key={row.id}>
                  <td>{row.colegio}</td>
                  <td><span className="tbl-tag">{row.tipo}</span></td>
                  <td className="tbl-mono">{row.cct}</td>
                  <td>{row.plantel}</td>
                  <td className="tbl-mono">{row.claveCarrera}</td>
                  <td>{row.carrera}</td>
                  <td>{row.turno}</td>
                  <td>{row.genero}</td>
                  <td className="tbl-num">{row.grupos1ero ?? '—'}</td>
                  <td className="tbl-num">{row.alumnos1ero ?? '—'}</td>
                  <td className="tbl-num">{row.grupos3ero ?? '—'}</td>
                  <td className="tbl-num">{row.alumnos3ero ?? '—'}</td>
                  <td className="tbl-num">{row.grupos5to ?? '—'}</td>
                  <td className="tbl-num">{row.alumnos5to ?? '—'}</td>
                  <td className="tbl-num tbl-subtotal">{row.totalGrupos ?? '—'}</td>
                  <td className="tbl-num tbl-total">{row.totalAlumnos ?? '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Paginacion pagina={pagina} totalPaginas={totalPaginas} setPagina={setPagina} total={datosFiltrados.length} inicio={inicio} />
    </div>
  );
};

export default MatriculaPorPlantel;
