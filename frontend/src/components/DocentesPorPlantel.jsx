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

const DocentesPorPlantel = () => {
  const [datos, setDatos] = useState([]);
  const [filtros, setFiltros] = useState({ colegio: '', plantel: '', cct: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mapaService.getDocentesPorPlantel()
      .then(res => setDatos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const colegios  = [...new Set(datos.map(d => d.colegio).filter(Boolean))].sort();
  const planteles = [...new Set(datos.map(d => d.plantel).filter(Boolean))].sort();
  const ccts      = [...new Set(datos.map(d => d.cct).filter(Boolean))].sort();

  const datosFiltrados = datos.filter(d => {
    const okColegio  = !filtros.colegio  || d.colegio === filtros.colegio;
    const okPlantel  = !filtros.plantel  || d.plantel === filtros.plantel;
    const okCct      = !filtros.cct      || d.cct?.toLowerCase().includes(filtros.cct.toLowerCase());
    return okColegio && okPlantel && okCct;
  });

  const hayFiltro = filtros.colegio || filtros.plantel || filtros.cct;
  const limpiar = () => setFiltros({ colegio: '', plantel: '', cct: '' });
  const set = (campo, val) => setFiltros(p => ({ ...p, [campo]: val }));

  const plantelesFiltrados = filtros.colegio
    ? [...new Set(datos.filter(d => d.colegio === filtros.colegio).map(d => d.plantel).filter(Boolean))].sort()
    : planteles;

  const { paginados, pagina, setPagina, totalPaginas, inicio } = usePaginacion(datosFiltrados);

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="tbl-page">
      <div className="tbl-topbar">
        <div className="tbl-title-area">
          <h2>👨🏫 Docentes por Plantel</h2>
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
            <label>🏫 Plantel</label>
            <select value={filtros.plantel} onChange={e => set('plantel', e.target.value)}>
              <option value="">Todos</option>
              {plantelesFiltrados.map(p => <option key={p} value={p}>{p}</option>)}
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
              <th>CCT</th>
              <th>Plantel</th>
              <th>Nombre del Docente</th>
              <th>Clave Carrera</th>
              <th>Carrera</th>
              <th>Horas Asignadas</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} className="tbl-empty">No se encontraron resultados</td>
              </tr>
            ) : (
              paginados.map(row => (
                <tr key={row.id}>
                  <td className="tbl-col-colegio">{row.colegio}</td>
                  <td className="tbl-mono">{row.cct}</td>
                  <td>{row.plantel}</td>
                  <td>{row.nombreDelDocente}</td>
                  <td className="tbl-mono">{row.claveCarrera}</td>
                  <td>{row.carrera}</td>
                  <td className="tbl-num tbl-subtotal">{row.horasAsignadas ?? '—'}</td>
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

export default DocentesPorPlantel;
