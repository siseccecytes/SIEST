import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { mapaService } from '../../services/api';

const VINO   = '#7b1c2e';
const MORADO = '#5b3a8e';
const COLORES = [VINO, MORADO, '#9b3d4e', '#6b4a9e', '#c0392b', '#8e44ad', '#e67e22', '#27ae60', '#2980b9'];

const p = (val) => {
  if (val == null) return 0;
  const n = Number(String(val).trim().replace(/,/g, ''));
  return isNaN(n) ? 0 : n;
};

const cortar = (str, max = 14) =>
  str && str.length > max ? str.slice(0, max) + '…' : (str || '—');

// Ancho dinámico para etiquetas de YAxis según el texto más largo
const anchoY = (items, key) =>
  Math.min(320, Math.max(140, Math.max(...items.map(d => (d[key] || '').length)) * 7.2));

// Exportar datos actuales a CSV/Excel
const exportarCSV = (filas, columnas, nombre) => {
  const bom = '\uFEFF';
  const cabecera = columnas.join(',');
  const cuerpo = filas.map(f =>
    columnas.map(c => `"${String(f[c] ?? '').replace(/"/g, '""')}"`).join(',')
  ).join('\n');
  const blob = new Blob([bom + cabecera + '\n' + cuerpo], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `${nombre}.csv`; a.click();
  URL.revokeObjectURL(url);
};

const Tooltip1 = ({ active, payload, label, sufijo = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="grafica-tooltip">
      <p className="grafica-tooltip-titulo">{label}</p>
      {payload.map(e => (
        <p key={e.name} style={{ color: e.color ?? e.fill }}>
          {e.name}: <strong>{Number(e.value).toLocaleString('es-MX')}{sufijo}</strong>
        </p>
      ))}
    </div>
  );
};

const GRAFICAS = [
  { key: 'total',    label: '📦 Matrícula Total' },
  { key: 'estado',   label: '🗺️ Por Estado' },
  { key: 'carrera',  label: '📚 Por Carrera' },
  { key: 'turno',    label: '🕐 Por Turno' },
  { key: 'plantel',  label: '🏫 Por Plantel' },
  { key: 'grupo',    label: '👥 Por Grupo' },
  { key: 'genero',   label: '⚧ Por Género' },
  { key: 'semestre', label: '📅 Por Semestre' },
  { key: 'tipo',     label: '🏷️ Por Tipo' },
];

const GraficaMatriculaPlantel = () => {
  const navigate = useNavigate();
  const [datos, setDatos]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [vista, setVista]     = useState('total');

  // filtros por gráfica
  const [fEstado,  setFEstado]  = useState('');
  const [fTipo,    setFTipo]    = useState('');
  const [fPlantel, setFPlantel] = useState('');
  const [fCarrN,   setFCarrN]   = useState(15);

  useEffect(() => {
    mapaService.getMatriculaPorPlantel()
      .then(r => setDatos(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const estados  = useMemo(() => [...new Set(datos.map(d => d.colegio).filter(Boolean))].sort(), [datos]);
  const tipos    = useMemo(() => [...new Set(datos.map(d => d.tipo).filter(Boolean))].sort(), [datos]);
  const planteles = useMemo(() => {
    const base = fEstado ? datos.filter(d => d.colegio === fEstado) : datos;
    return [...new Set(base.map(d => d.plantel).filter(Boolean))].sort();
  }, [datos, fEstado]);

  // base filtrada según la gráfica activa
  const base = useMemo(() => {
    let d = datos;
    if (['estado','carrera','turno','plantel','grupo','genero','semestre','tipo'].includes(vista)) {
      if (fEstado) d = d.filter(r => r.colegio === fEstado);
      if (fTipo)   d = d.filter(r => r.tipo === fTipo);
    }
    if (vista === 'plantel' && fPlantel) d = d.filter(r => r.plantel === fPlantel);
    return d;
  }, [datos, vista, fEstado, fTipo, fPlantel]);

  /* ---- totales: usa matriculaCecyte + matriculaEmsad igual que la tabla nacional ---- */
  const totalCecyte  = useMemo(() => base.reduce((s, d) => s + p(d.matriculaCecyte ?? d.totalAlumnos), 0), [base]);
  const totalEmsad   = useMemo(() => base.reduce((s, d) => s + p(d.matriculaEmsad), 0), [base]);
  const totalAlumnos = useMemo(() => totalCecyte + totalEmsad || base.reduce((s,d) => s + p(d.totalAlumnos), 0), [base, totalCecyte, totalEmsad]);
  const totalGrupos  = useMemo(() => base.reduce((s, d) => s + p(d.totalGrupos), 0), [base]);

  /* ---- por estado ---- */
  const porEstado = useMemo(() => {
    const m = {};
    base.forEach(d => {
      const k = d.colegio || '—';
      m[k] = (m[k] || 0) + p(d.totalAlumnos);
    });
    return Object.entries(m)
      .map(([k, v]) => ({ estado: cortar(k), estadoFull: k, Alumnos: v }))
      .sort((a, b) => b.Alumnos - a.Alumnos);
  }, [base]);

  /* ---- por carrera ---- */
  const porCarrera = useMemo(() => {
    const m = {};
    base.forEach(d => {
      const k = d.carrera || '—';
      m[k] = (m[k] || 0) + p(d.totalAlumnos);
    });
    return Object.entries(m)
      .map(([k, v]) => ({ carrera: cortar(k, 22), carreraFull: k, Alumnos: v }))
      .sort((a, b) => b.Alumnos - a.Alumnos)
      .slice(0, fCarrN);
  }, [base, fCarrN]);

  /* ---- por turno ---- */
  const porTurno = useMemo(() => {
    const m = {};
    base.forEach(d => {
      const k = d.turno || 'Sin turno';
      m[k] = (m[k] || 0) + p(d.totalAlumnos);
    });
    return Object.entries(m).map(([k, v]) => ({ name: k, value: v }));
  }, [base]);

  /* ---- por plantel (top 20) — nombre completo sin cortar ---- */
  const porPlantel = useMemo(() => {
    const m = {};
    base.forEach(d => {
      const k = d.plantel || d.cct || '—';
      m[k] = (m[k] || 0) + p(d.totalAlumnos);
    });
    return Object.entries(m)
      .map(([k, v]) => ({ plantel: k, Alumnos: v }))
      .sort((a, b) => b.Alumnos - a.Alumnos)
      .slice(0, 20);
  }, [base]);

  /* ---- por grupo (1ro, 3ro, 5to) por estado ---- */
  const porGrupo = useMemo(() => {
    const m = {};
    base.forEach(d => {
      const k = d.colegio || '—';
      if (!m[k]) m[k] = { estado: cortar(k), '1er Semestre': 0, '3er Semestre': 0, '5to Semestre': 0 };
      m[k]['1er Semestre'] += p(d.grupos1ero);
      m[k]['3er Semestre'] += p(d.grupos3ero);
      m[k]['5to Semestre'] += p(d.grupos5to);
    });
    return Object.values(m).sort(
      (a, b) => (b['1er Semestre'] + b['3er Semestre'] + b['5to Semestre']) -
                (a['1er Semestre'] + a['3er Semestre'] + a['5to Semestre'])
    );
  }, [base]);

  /* ---- por género ---- */
  const porGenero = useMemo(() => {
    const m = {};
    base.forEach(d => {
      const k = d.colegio || '—';
      if (!m[k]) m[k] = { estado: cortar(k), Hombres: 0, Mujeres: 0 };
      const g = (d.genero || '').toUpperCase();
      // Usa alumnos1ero/3ero/5to por género si existe, sino totalAlumnos
      const hom = p(d.alumnos1ero) + p(d.alumnos3ero) + p(d.alumnos5to);
      const tot = hom > 0 ? hom : p(d.totalAlumnos);
      if (g === 'H' || g === 'HOMBRES' || g === 'MASCULINO') m[k].Hombres += tot;
      else if (g === 'M' || g === 'MUJERES' || g === 'FEMENINO') m[k].Mujeres += tot;
      else { m[k].Hombres += tot / 2; m[k].Mujeres += tot / 2; }
    });
    return Object.values(m).sort((a, b) => (b.Hombres + b.Mujeres) - (a.Hombres + a.Mujeres));
  }, [base]);

  /* ---- por semestre (alumnos 1ro, 3ro, 5to) por estado ---- */
  const porSemestre = useMemo(() => {
    const m = {};
    base.forEach(d => {
      const k = d.colegio || '—';
      if (!m[k]) m[k] = { estado: cortar(k), '1er Semestre': 0, '3er Semestre': 0, '5to Semestre': 0 };
      m[k]['1er Semestre'] += p(d.alumnos1ero);
      m[k]['3er Semestre'] += p(d.alumnos3ero);
      m[k]['5to Semestre'] += p(d.alumnos5to);
    });
    return Object.values(m).sort(
      (a, b) => (b['1er Semestre'] + b['3er Semestre'] + b['5to Semestre']) -
                (a['1er Semestre'] + a['3er Semestre'] + a['5to Semestre'])
    );
  }, [base]);

  /* ---- por tipo ---- */
  const porTipo = useMemo(() => {
    const m = {};
    base.forEach(d => {
      const k = d.tipo || 'Sin tipo';
      m[k] = (m[k] || 0) + p(d.totalAlumnos);
    });
    return Object.entries(m).map(([k, v]) => ({ name: k, value: v }));
  }, [base]);

  /* ---- exportar datos de la vista activa ---- */
  const exportar = useCallback(() => {
    const mapa = {
      total:    { filas: [
        { Concepto: 'Total Alumnos CECyTE', Cantidad: totalCecyte },
        { Concepto: 'Total Alumnos EMSAD',  Cantidad: totalEmsad  },
        { Concepto: 'Total Grupos',         Cantidad: totalGrupos },
      ], cols: ['Concepto','Cantidad'], nombre: 'matricula_total' },
      estado:   { filas: porEstado.map(d => ({ Estado: d.estadoFull ?? d.estado, Alumnos: d.Alumnos })),      cols: ['Estado','Alumnos'],                                               nombre: 'matricula_por_estado'   },
      carrera:  { filas: porCarrera.map(d => ({ Carrera: d.carreraFull ?? d.carrera, Alumnos: d.Alumnos })),  cols: ['Carrera','Alumnos'],                                              nombre: 'matricula_por_carrera'  },
      turno:    { filas: porTurno.map(d => ({ Turno: d.name, Alumnos: d.value })),                            cols: ['Turno','Alumnos'],                                                nombre: 'matricula_por_turno'    },
      plantel:  { filas: porPlantel.map(d => ({ Plantel: d.plantel, Alumnos: d.Alumnos })),                   cols: ['Plantel','Alumnos'],                                              nombre: 'matricula_por_plantel'  },
      grupo:    { filas: porGrupo,                                                                             cols: ['estado','1er Semestre','3er Semestre','5to Semestre'],             nombre: 'grupos_por_semestre'    },
      genero:   { filas: porGenero,                                                                            cols: ['estado','Hombres','Mujeres'],                                      nombre: 'matricula_por_genero'   },
      semestre: { filas: porSemestre,                                                                          cols: ['estado','1er Semestre','3er Semestre','5to Semestre'],             nombre: 'alumnos_por_semestre'   },
      tipo:     { filas: porTipo.map(d => ({ Tipo: d.name, Alumnos: d.value })),                              cols: ['Tipo','Alumnos'],                                                 nombre: 'matricula_por_tipo'     },
    };
    const { filas, cols, nombre } = mapa[vista];
    exportarCSV(filas, cols, nombre);
  }, [vista, porEstado, porCarrera, porTurno, porPlantel, porGrupo, porGenero, porSemestre, porTipo, totalCecyte, totalEmsad, totalGrupos]);

  if (loading) return <div className="loading">Cargando...</div>;

  const hayFiltros = vista !== 'total';

  return (
    <div className="grafica-page">
      {/* ── topbar ── */}
      <div className="grafica-topbar">
        <div className="grafica-title-area">
          <button className="grafica-back-btn" onClick={() => navigate('/estadisticas/matricula')}>
            ← Tabla
          </button>
          <h2>📊 Gráficas — Matrícula por Plantel</h2>
        </div>
        <div className="grafica-controles">
          <label>Gráfica</label>
          <select value={vista} onChange={e => { setVista(e.target.value); setFEstado(''); setFTipo(''); setFPlantel(''); }}>
            {GRAFICAS.map(g => <option key={g.key} value={g.key}>{g.label}</option>)}
          </select>
          <button className="grafica-link-btn" onClick={exportar} title="Descargar Excel/CSV">
            ⬇️ Excel
          </button>
        </div>
      </div>

      {/* ── tarjetas resumen ── */}
      <div className="grafica-resumen-bar">
        <div className="grafica-resumen-item">
          <span className="grafica-resumen-label">Alumnos CECyTE</span>
          <span className="grafica-resumen-valor">{totalCecyte.toLocaleString('es-MX')}</span>
        </div>
        <div className="grafica-resumen-item">
          <span className="grafica-resumen-label">Alumnos EMSAD</span>
          <span className="grafica-resumen-valor" style={{ color: MORADO }}>{totalEmsad.toLocaleString('es-MX')}</span>
        </div>
        <div className="grafica-resumen-item">
          <span className="grafica-resumen-label">Total Grupos</span>
          <span className="grafica-resumen-valor" style={{ color: '#e67e22' }}>{totalGrupos.toLocaleString('es-MX')}</span>
        </div>
        {fEstado && (
          <div className="grafica-resumen-item">
            <span className="grafica-resumen-label">Estado</span>
            <span className="grafica-resumen-valor" style={{ fontSize: '1rem' }}>{fEstado}</span>
          </div>
        )}
      </div>

      {/* ── filtros por gráfica ── */}
      {hayFiltros && (
        <div className="grafica-filtros-bar">
          {vista !== 'total' && (
            <div className="tbl-filter-group">
              <label>🎓 Estado / Colegio</label>
              <select value={fEstado} onChange={e => { setFEstado(e.target.value); setFPlantel(''); }}>
                <option value="">Todos</option>
                {estados.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          )}
          {['carrera','turno','plantel','grupo','genero','semestre'].includes(vista) && (
            <div className="tbl-filter-group">
              <label>🏷️ Tipo</label>
              <select value={fTipo} onChange={e => setFTipo(e.target.value)}>
                <option value="">Todos</option>
                {tipos.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}
          {vista === 'plantel' && (
            <div className="tbl-filter-group">
              <label>🏫 Plantel</label>
              <select value={fPlantel} onChange={e => setFPlantel(e.target.value)}>
                <option value="">Todos</option>
                {planteles.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          )}
          {vista === 'carrera' && (
            <div className="tbl-filter-group">
              <label>Top carreras</label>
              <select value={fCarrN} onChange={e => setFCarrN(Number(e.target.value))}>
                <option value={10}>Top 10</option>
                <option value={15}>Top 15</option>
                <option value={20}>Top 20</option>
                <option value={9999}>Todas</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* ── gráfica ── */}
      <div className="grafica-card">

        {/* TOTAL — usa matriculaCecyte y matriculaEmsad */}
        {vista === 'total' && (() => {
          const cecyteTotal  = base.reduce((s,d) => s + p(d.matriculaCecyte ?? d.totalAlumnos), 0);
          const emsadTotal   = base.reduce((s,d) => s + p(d.matriculaEmsad), 0);
          const cecyteGrupos = base.filter(d => (d.tipo||'').toUpperCase() === 'CECYTE').reduce((s,d) => s + p(d.totalGrupos), 0);
          const emsadGrupos  = base.filter(d => (d.tipo||'').toUpperCase() === 'EMSAD').reduce((s,d)  => s + p(d.totalGrupos), 0);
          const dataTotal = [
            { concepto: 'Matrícula CECyTE', Alumnos: cecyteTotal  },
            { concepto: 'Matrícula EMSAD',  Alumnos: emsadTotal   },
            { concepto: 'Grupos CECyTE',    Alumnos: cecyteGrupos },
            { concepto: 'Grupos EMSAD',     Alumnos: emsadGrupos  },
          ];
          return (
            <>
              <p className="grafica-descripcion">Matrícula CECyTE y EMSAD más grupos, tomados de los campos <em>Matricula_CECyTE</em> y <em>Matricula_EMSAD</em>.</p>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={dataTotal} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="concepto" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={v => v.toLocaleString('es-MX')} tick={{ fontSize: 11 }} />
                  <Tooltip content={<Tooltip1 />} />
                  <Bar dataKey="Alumnos" fill={VINO} radius={[4,4,0,0]} animationDuration={800}>
                    {dataTotal.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </>
          );
        })()}

        {/* POR ESTADO */}
        {vista === 'estado' && (
          <>
            <p className="grafica-descripcion">Total de alumnos por estado/colegio, ordenados de mayor a menor.</p>
            <ResponsiveContainer width="100%" height={Math.max(380, porEstado.length * 28)}>
              <BarChart data={porEstado} layout="vertical" margin={{ top: 10, right: 80, left: 140, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tickFormatter={v => v.toLocaleString('es-MX')} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="estado" tick={{ fontSize: 11 }} width={135} />
                <Tooltip content={<Tooltip1 />} />
                <Bar dataKey="Alumnos" fill={VINO} radius={[0,4,4,0]} animationDuration={800}>
                  {porEstado.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {/* POR CARRERA */}
        {vista === 'carrera' && (
          <>
            <p className="grafica-descripcion">Carreras con mayor número de alumnos, ordenadas de mayor a menor.</p>
            <ResponsiveContainer width="100%" height={Math.max(400, porCarrera.length * 30)}>
              <BarChart data={porCarrera} layout="vertical" margin={{ top: 10, right: 80, left: 200, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tickFormatter={v => v.toLocaleString('es-MX')} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="carrera" tick={{ fontSize: 10 }} width={195} />
                <Tooltip content={<Tooltip1 />} />
                <Bar dataKey="Alumnos" fill={MORADO} radius={[0,4,4,0]} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {/* POR TURNO */}
        {vista === 'turno' && (
          <>
            <p className="grafica-descripcion">Distribución total de alumnos por turno (barras y pastel).</p>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={porTurno} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={v => v.toLocaleString('es-MX')} tick={{ fontSize: 11 }} />
                    <Tooltip content={<Tooltip1 />} />
                    <Bar dataKey="value" name="Alumnos" fill={VINO} radius={[4,4,0,0]} animationDuration={800}>
                      {porTurno.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: '1 1 280px' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={porTurno} dataKey="value" nameKey="name" cx="50%" cy="50%"
                      outerRadius={110} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                      labelLine animationDuration={800}>
                      {porTurno.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
                    </Pie>
                    <Tooltip formatter={v => v.toLocaleString('es-MX')} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* POR PLANTEL — nombres completos, margen dinámico */}
        {vista === 'plantel' && (() => {
          const margenIzq = anchoY(porPlantel, 'plantel');
          return (
            <>
              <p className="grafica-descripcion">Top 20 planteles con mayor matrícula, ordenados de mayor a menor. Filtra por estado y plantel.</p>
              <ResponsiveContainer width="100%" height={Math.max(420, porPlantel.length * 32)}>
                <BarChart data={porPlantel} layout="vertical" margin={{ top: 10, right: 80, left: margenIzq, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tickFormatter={v => v.toLocaleString('es-MX')} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="plantel" tick={{ fontSize: 10 }} width={margenIzq - 8} />
                  <Tooltip content={<Tooltip1 />} />
                  <Bar dataKey="Alumnos" fill={VINO} radius={[0,4,4,0]} animationDuration={800}>
                    {porPlantel.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </>
          );
        })()}

        {/* POR GRUPO */}
        {vista === 'grupo' && (
          <>
            <p className="grafica-descripcion">Total de grupos por semestre (1ro, 3ro, 5to) agrupados por estado.</p>
            <ResponsiveContainer width="100%" height={Math.max(380, porGrupo.length * 26 + 80)}>
              <BarChart data={porGrupo} margin={{ top: 10, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="estado" angle={-40} textAnchor="end" tick={{ fontSize: 11 }} interval={0} />
                <YAxis tickFormatter={v => v.toLocaleString('es-MX')} tick={{ fontSize: 11 }} />
                <Tooltip content={<Tooltip1 />} />
                <Legend wrapperStyle={{ paddingTop: 16 }} />
                <Bar dataKey="1er Semestre" fill={VINO}          radius={[4,4,0,0]} animationDuration={800} />
                <Bar dataKey="3er Semestre" fill={MORADO}        radius={[4,4,0,0]} animationDuration={800} />
                <Bar dataKey="5to Semestre" fill="#e67e22"       radius={[4,4,0,0]} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {/* POR GÉNERO */}
        {vista === 'genero' && (
          <>
            <p className="grafica-descripcion">Distribución de alumnos hombres y mujeres por estado.</p>
            <ResponsiveContainer width="100%" height={Math.max(380, porGenero.length * 26 + 80)}>
              <BarChart data={porGenero} margin={{ top: 10, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="estado" angle={-40} textAnchor="end" tick={{ fontSize: 11 }} interval={0} />
                <YAxis tickFormatter={v => v.toLocaleString('es-MX')} tick={{ fontSize: 11 }} />
                <Tooltip content={<Tooltip1 />} />
                <Legend wrapperStyle={{ paddingTop: 16 }} />
                <Bar dataKey="Hombres" fill={VINO}   radius={[4,4,0,0]} animationDuration={800} />
                <Bar dataKey="Mujeres" fill={MORADO} radius={[4,4,0,0]} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {/* POR SEMESTRE */}
        {vista === 'semestre' && (
          <>
            <p className="grafica-descripcion">Alumnos matriculados por semestre (1ro, 3ro, 5to) agrupados por estado.</p>
            <ResponsiveContainer width="100%" height={Math.max(380, porSemestre.length * 26 + 80)}>
              <BarChart data={porSemestre} margin={{ top: 10, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="estado" angle={-40} textAnchor="end" tick={{ fontSize: 11 }} interval={0} />
                <YAxis tickFormatter={v => v.toLocaleString('es-MX')} tick={{ fontSize: 11 }} />
                <Tooltip content={<Tooltip1 />} />
                <Legend wrapperStyle={{ paddingTop: 16 }} />
                <Bar dataKey="1er Semestre" fill={VINO}    radius={[4,4,0,0]} animationDuration={800} />
                <Bar dataKey="3er Semestre" fill={MORADO}  radius={[4,4,0,0]} animationDuration={800} />
                <Bar dataKey="5to Semestre" fill="#e67e22" radius={[4,4,0,0]} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {/* POR TIPO */}
        {vista === 'tipo' && (
          <>
            <p className="grafica-descripcion">Distribución de alumnos entre CECyTE y EMSAD (barras y pastel).</p>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={porTipo} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                    <YAxis tickFormatter={v => v.toLocaleString('es-MX')} tick={{ fontSize: 11 }} />
                    <Tooltip content={<Tooltip1 />} />
                    <Bar dataKey="value" name="Alumnos" fill={VINO} radius={[4,4,0,0]} animationDuration={800}>
                      {porTipo.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: '1 1 280px' }}>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={porTipo} dataKey="value" nameKey="name" cx="50%" cy="50%"
                      outerRadius={110} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                      labelLine animationDuration={800}>
                      {porTipo.map((_, i) => <Cell key={i} fill={COLORES[i % COLORES.length]} />)}
                    </Pie>
                    <Tooltip formatter={v => v.toLocaleString('es-MX')} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default GraficaMatriculaPlantel;
