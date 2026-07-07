import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mapaService } from '../services/api';

const AutocompleteInput = ({ opciones, value, onChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const sugerencias = value
    ? opciones.filter(o => o.toLowerCase().includes(value.toLowerCase())).slice(0, 8)
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
        placeholder={placeholder}
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

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';
const API = () => (import.meta.env.VITE_API_URL || 'http://localhost:8081/api').trim();

const getColorFila = (modalidadPresencial) => {
  if (!modalidadPresencial) return '';
  const match = modalidadPresencial.match(/(\d{2})$/);
  if (!match) return '';
  const terminacion = match[1];
  if (terminacion === '13')                         return '#FF0000';
  if (terminacion === '16' || terminacion === '17') return '#FFC000';
  if (terminacion === '18')                         return '#FFFE00';
  if (terminacion === '22' ||terminacion === '23' || terminacion === '24') return '#92D050';
  if (terminacion === '25' || terminacion === '26') return '#00B050';
  return '';
};

const leyenda = [
  { color: '#FF0000', texto: 'Más de 10 años sin actualizar' },
  { color: '#FFC000', texto: '10 años sin actualizar' },
  { color: '#FFFE00', texto: 'De 5 a 8 años sin actualizar' },
  { color: '#92D050', texto: 'De 2 a 4 años actualizada' },
  { color: '#00B050', texto: '1 a 2 años actualizada' },
];

const OfertaEducativaNacional = () => {
  const navigate = useNavigate();
  const [datos, setDatos] = useState([]);
  const [filtros, setFiltros] = useState({ carrera: '' });
  const [loading, setLoading] = useState(true);

  const ordenPorAnio = (item) => {
    const match = (item.modalidadPresencial || item.modalidadDual || '').match(/(\d{2})$/);
    if (!match) return 99;
    const t = match[1];
    if (t === '25' || t === '26') return 1;
    if (t === '22' || t === '23' || t === '24') return 2;
    if (t === '18') return 3;
    if (t === '16' || t === '17') return 4;
    if (t === '13') return 5;
    return 99;
  };

  useEffect(() => {
    mapaService.getOfertaNacional()
      .then(res => setDatos([...res.data].sort((a, b) => ordenPorAnio(a) - ordenPorAnio(b))))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const carreras = useMemo(() => [...new Set(datos.map(d => d.carreras).filter(Boolean))].sort(), [datos]);

  const datosFiltrados = useMemo(() => datos.filter(d =>
    !filtros.carrera || d.carreras?.toLowerCase().includes(filtros.carrera.toLowerCase())
  ), [datos, filtros.carrera]);

  const abrirPdf = (carrera, tipo) => {
    window.open(`${API()}/oferta/pdf?carrera=${encodeURIComponent(carrera)}&tipo=${tipo}`, '_blank');
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="tbl-page">
      <div className="tbl-topbar">
        <div className="tbl-title-area">
          <h2>📚 Oferta Educativa Nacional</h2>
          <span className="tbl-badge">{datosFiltrados.length} registros</span>
        </div>
        <div className="tbl-filters">
          <div className="tbl-filter-group">
            <label>📖 Carrera</label>
            <AutocompleteInput
              opciones={carreras}
              value={filtros.carrera}
              onChange={v => setFiltros({ carrera: v })}
              placeholder="Buscar carrera..."
            />
          </div>
          {filtros.carrera && (
            <button className="tbl-clear-btn" onClick={() => setFiltros({ carrera: '' })}>✕ Limpiar</button>
          )}
          <button className="grafica-link-btn" onClick={() => navigate('/graficas/oferta-educativa')}>📊 Ver gráfica</button>
        </div>
      </div>

      {/* Leyenda de colores */}
      <div className="oferta-leyenda">
        <span className="oferta-leyenda-titulo">Actualización código de colores:</span>
        {leyenda.map(l => (
          <div key={l.color} className="oferta-leyenda-item">
            <span className="oferta-leyenda-color" style={{ background: l.color }} />
            <span>{l.texto}</span>
          </div>
        ))}
      </div>

      <div className="tbl-wrapper">
        <table className="tbl-main">
          <thead>
            <tr>
              <th rowSpan={2} style={{ verticalAlign: 'middle' }}>CARRERAS</th>
              <th colSpan={3}>CLAVES</th>
              <th rowSpan={2} style={{ verticalAlign: 'middle' }}>COMÚN / ESPECÍFICA</th>
            </tr>
            <tr>
              <th>MODALIDAD PRESENCIAL</th>
              <th>MODALIDAD DUAL</th>
              <th>MODALIDAD MIXTA</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5} className="tbl-empty">No se encontraron resultados</td>
              </tr>
            ) : (
              datosFiltrados.map(row => {
                const color = getColorFila(row.modalidadPresencial);
                const estilo = color ? { backgroundColor: color, color: '#000', fontWeight: 600 } : {};
                return (
                  <tr key={row.id} style={estilo}>
                    <td>{row.carreras}</td>
                    <td className="tbl-mono" style={{ textAlign: 'center' }}>
                      {row.modalidadPresencial
                        ? <span onClick={() => abrirPdf(row.carreras, 'presencial')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>{row.modalidadPresencial}</span>
                        : '—'}
                    </td>
                    <td className="tbl-mono" style={{ textAlign: 'center' }}>
                      {row.modalidadDual
                        ? <span onClick={() => abrirPdf(row.carreras, 'dual')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>{row.modalidadDual}</span>
                        : '—'}
                    </td>
                    <td className="tbl-mono" style={{ textAlign: 'center' }}>{row.modalidadMixta ?? '—'}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{row.comunEspecifica ?? '—'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfertaEducativaNacional;
