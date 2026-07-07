import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
  LineChart, Line, AreaChart, Area,
  BarChart, Bar, Cell,
  ScatterChart, Scatter, ZAxis, Label,
  RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { mapaService } from '../services/api';

const VINO    = '#7b1c2e';
const MORADO  = '#5b3a8e';
const VERDE   = '#27ae60';
const ROJO    = '#c0392b';
const NARANJA = '#e67e22';
const AZUL    = '#2980b9';
const COLORES = [VINO, MORADO, NARANJA, VERDE, AZUL, ROJO, '#8e44ad', '#16a085'];

const p = (val) => {
  if (val == null) return 0;
  const n = Number(String(val).trim().replace(/%/g, '').replace(/,/g, ''));
  return isNaN(n) ? 0 : n;
};

const esTotalGeneral = (s) => !s || /total|general|nacional/i.test(s);
const fmt  = (n) => Number(n).toLocaleString('es-MX');
const same = (a, b) => String(a ?? '').trim().toUpperCase() === String(b ?? '').trim().toUpperCase();

const TT = ({ active, payload, label, sufijo = '' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="grafica-tooltip">
      <p className="grafica-tooltip-titulo">{label}</p>
      {payload.map(e => (
        <p key={e.name} style={{ color: e.color ?? e.stroke }}>
          {e.name}: <strong>{fmt(e.value)}{sufijo}</strong>
        </p>
      ))}
    </div>
  );
};

const KPI = ({ icon, label, valor, sub, color = VINO }) => (
  <div className="dash-kpi">
    <span className="dash-kpi-icon">{icon}</span>
    <div>
      <div className="dash-kpi-label">{label}</div>
      <div className="dash-kpi-valor" style={{ color }}>{valor}</div>
      {sub && <div className="dash-kpi-sub">{sub}</div>}
    </div>
  </div>
);

const Card = ({ titulo, children }) => (
  <div className="dash-ind-card">
    <div className="dash-ind-card-header"><span>{titulo}</span></div>
    {children}
  </div>
);

const CardWide = ({ titulo, children }) => (
  <div className="dash-ind-card dash-ind-card--wide">
    <div className="dash-ind-card-header"><span>{titulo}</span></div>
    {children}
  </div>
);

export default function DashboardIndicadores() {
  const navigate = useNavigate();

  const [mat2425,     setMat2425]     = useState([]);
  const [mat2526,     setMat2526]     = useState([]);
  const [indicadores, setIndicadores] = useState([]);
  const [docentes,    setDocentes]    = useState([]);
  const [estado,      setEstado]      = useState('');
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      mapaService.getMatriculaNacional(),
      mapaService.getMatriculaNacional20252026(),
      mapaService.getIndicadoresNacionales(),
      mapaService.getDocentesPorEstado(),
    ]).then(([r1, r2, r3, r4]) => {
      setMat2425(r1.data);
      setMat2526(r2.data);
      setIndicadores(r3.data);
      setDocentes(r4.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const estados = useMemo(() =>
    [...new Set(mat2425.filter(d => !esTotalGeneral(d.colegio)).map(d => d.colegio))].sort()
  , [mat2425]);

  // ── Registros del contexto seleccionado ──
  const reg2425 = useMemo(() =>
    estado ? mat2425.find(d => same(d.colegio, estado))
           : mat2425.find(d => esTotalGeneral(d.colegio))
  , [mat2425, estado]);

  const reg2526 = useMemo(() =>
    estado ? mat2526.find(d => same(d.colegio, estado))
           : mat2526.find(d => esTotalGeneral(d.colegio))
  , [mat2526, estado]);

  const regInd = useMemo(() => {
    if (estado) return indicadores.find(d => same(d.colegio, estado));
    const fila = indicadores.find(d => esTotalGeneral(d.colegio));
    if (fila) return fila;
    const rows = indicadores.filter(d => !esTotalGeneral(d.colegio));
    if (!rows.length) return null;
    const avg = (key) => (rows.reduce((s, d) => s + p(d[key]), 0) / rows.length).toFixed(1) + '%';
    return { eficienciaTerminal: avg('eficienciaTerminal'), aprobacion: avg('aprobacion'), desercion: avg('desercion') };
  }, [indicadores, estado]);

  const regDoc = useMemo(() => {
    if (estado) return docentes.find(d => same(d.estado, estado));
    const fila = docentes.find(d => esTotalGeneral(d.estado));
    if (fila) return fila;
    const rows = docentes.filter(d => !esTotalGeneral(d.estado));
    if (!rows.length) return null;
    const sum = (key) => rows.reduce((s, d) => s + p(d[key]), 0);
    return {
      totalDocentes: sum('totalDocentes'), totalDocentesHombres: sum('totalDocentesHombres'),
      totalDocentesMujeres: sum('totalDocentesMujeres'),
    };
  }, [docentes, estado]);

  // ── KPIs ──
  const m2425 = p(reg2425?.totalMatricula2 ?? reg2425?.totalMatricula1);
  const m2526 = p(reg2526?.totalMatricula2 ?? reg2526?.totalMatricula1);
  const crec  = m2425 > 0 ? (((m2526 - m2425) / m2425) * 100).toFixed(1) : null;

  // ── Gráfica 1: Matrícula — LineChart comparativo ──
  const datosMatricula = useMemo(() => {
    const base = estado
      ? mat2425.filter(d => same(d.colegio, estado))
      : mat2425.filter(d => !esTotalGeneral(d.colegio));
    return base.map(d => {
      const d2 = mat2526.find(x => same(x.colegio, d.colegio));
      return {
        n: d.colegio?.length > 10 ? d.colegio.slice(0, 10) + '…' : d.colegio,
        '2024-2025': p(d.totalMatricula2 ?? d.totalMatricula1),
        '2025-2026': d2 ? p(d2.totalMatricula2 ?? d2.totalMatricula1) : 0,
      };
    }).sort((a, b) => b['2025-2026'] - a['2025-2026']);
  }, [mat2425, mat2526, estado]);

  // ── Gráfica 2: Semestres — AreaChart ──
  const datosSemestres = useMemo(() => [
    { s: '1er Sem', '2024-2025': p(reg2425?.semestre1), '2025-2026': p(reg2526?.semestre1) },
    { s: '3er Sem', '2024-2025': p(reg2425?.semestre3), '2025-2026': p(reg2526?.semestre3) },
    { s: '5to Sem', '2024-2025': p(reg2425?.semestre5), '2025-2026': p(reg2526?.semestre5) },
  ], [reg2425, reg2526]);

  // ── Gráfica 3: Eficiencia Terminal ──
  const datosET = useMemo(() => {
    const base = estado
      ? indicadores.filter(d => same(d.colegio, estado))
      : indicadores.filter(d => !esTotalGeneral(d.colegio));
    return base
      .map(d => ({ n: d.colegio?.length > 12 ? d.colegio.slice(0, 12) + '…' : d.colegio, v: p(d.eficienciaTerminal) }))
      .filter(d => d.v > 0)
      .sort((a, b) => b.v - a.v);
  }, [indicadores, estado]);

  // ── Gráfica 4a: Aprobación ──
  const datosAprobacion = useMemo(() => {
    const base = estado
      ? indicadores.filter(d => same(d.colegio, estado))
      : indicadores.filter(d => !esTotalGeneral(d.colegio));
    return base
      .map(d => ({ n: d.colegio?.length > 12 ? d.colegio.slice(0, 12) + '…' : d.colegio, v: p(d.aprobacion) }))
      .filter(d => d.v > 0)
      .sort((a, b) => b.v - a.v);
  }, [indicadores, estado]);

  // ── Gráfica 4b: Deserción ──
  const datosDesercion = useMemo(() => {
    const base = estado
      ? indicadores.filter(d => same(d.colegio, estado))
      : indicadores.filter(d => !esTotalGeneral(d.colegio));
    return base
      .map(d => ({ n: d.colegio?.length > 12 ? d.colegio.slice(0, 12) + '…' : d.colegio, v: p(d.desercion) }))
      .filter(d => d.v > 0)
      .sort((a, b) => b.v - a.v);
  }, [indicadores, estado]);

  // ── Gráfica 5: Docentes — ScatterChart (Hombres vs Mujeres) ──
  const datosDocentes = useMemo(() => {
    if (estado && regDoc) {
      return [
        { indicador: 'Total',   valor: p(regDoc.totalDocentes) },
        { indicador: 'Hombres', valor: p(regDoc.totalDocentesHombres) },
        { indicador: 'Mujeres', valor: p(regDoc.totalDocentesMujeres) },
      ];
    }
    return docentes
      .filter(d => !esTotalGeneral(d.estado))
      .map(d => ({
        nombre: d.estado,
        x: p(d.totalDocentesHombres),
        y: p(d.totalDocentesMujeres),
        z: p(d.totalDocentes),
      }))
      .sort((a, b) => b.z - a.z);
  }, [docentes, estado, regDoc]);

  const ctx = estado || 'Nacional';

  if (loading) return <div className="loading">Cargando indicadores...</div>;

  return (
    <div className="dash-ind-page">

      {/* ── Encabezado ── */}
      <div className="dash-ind-header">
        <div>
          <h2 className="dash-ind-titulo">📊 Dashboard — Indicadores Educativos</h2>
          <p className="dash-ind-subtitulo">CECyTE · Ciclos 2024-2025 y 2025-2026</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div className="tbl-filter-group" style={{ minWidth: 230 }}>
            <label>🗺️ Ver datos de</label>
            <select value={estado} onChange={e => setEstado(e.target.value)} className="dash-ind-select">
              <option value="">🌐 Nacional</option>
              {estados.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          {estado && <button className="tbl-clear-btn" onClick={() => setEstado('')}>✕ Nacional</button>}
          <button className="grafica-back-btn" onClick={() => navigate('/dashboard')}>← Inicio</button>
        </div>
      </div>

      <div className="dash-ind-contexto">
        {estado ? `📍 ${estado}` : '🌐 Nacional — todos los estados'}
      </div>

      {/* ── KPIs ── */}
      <div className="dash-kpi-grid">
        <KPI icon="🎓" label="Matrícula 2024-2025"  valor={fmt(m2425)} color={VINO} />
        <KPI icon="🎓" label="Matrícula 2025-2026"  valor={fmt(m2526)} color={MORADO}
          sub={crec ? `${crec > 0 ? '▲' : '▼'} ${crec}% vs ciclo anterior` : ''} />
        <KPI icon="👨🏫" label="Total Docentes"       valor={fmt(p(regDoc?.totalDocentes))}       color={VINO} />
        <KPI icon="📈"  label="Eficiencia Terminal"   valor={regInd?.eficienciaTerminal ?? '—'}   color={NARANJA} />
        <KPI icon="✅"  label="Aprobación"             valor={regInd?.aprobacion ?? '—'}           color={VERDE} />
        <KPI icon="⚠️"  label="Deserción"              valor={regInd?.desercion ?? '—'}            color={ROJO} />
        <KPI icon="👦"  label="Hombres 2025-2026"
          valor={fmt(p(reg2526?.hombres1) + p(reg2526?.hombres2))} color={VINO} />
        <KPI icon="👧"  label="Mujeres 2025-2026"
          valor={fmt(p(reg2526?.mujeres1) + p(reg2526?.mujeres2))} color={MORADO} />
      </div>

      {/* ── Fila 1: Matrícula LineChart + Semestres AreaChart ── */}
      <div className="dash-ind-row">
        <CardWide titulo={`📊 Matrícula Comparativa — ${ctx}`}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={datosMatricula} margin={{ top: 8, right: 20, left: 10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="n" angle={-40} textAnchor="end" tick={{ fontSize: 10 }} interval={0} />
              <YAxis tickFormatter={v => v.toLocaleString('es-MX')} tick={{ fontSize: 10 }} />
              <Tooltip content={<TT />} />
              <Legend wrapperStyle={{ paddingTop: 8 }} />
              <Line type="monotone" dataKey="2024-2025" stroke={VINO}   strokeWidth={3} dot={{ r: 4, fill: VINO }}   activeDot={{ r: 7 }} animationDuration={700} />
              <Line type="monotone" dataKey="2025-2026" stroke={MORADO} strokeWidth={3} dot={{ r: 4, fill: MORADO }} activeDot={{ r: 7 }} animationDuration={700} />
            </LineChart>
          </ResponsiveContainer>
        </CardWide>

        <Card titulo={`📅 Alumnos por Semestre — ${ctx}`}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={datosSemestres} margin={{ top: 8, right: 20, left: 10, bottom: 10 }}>
              <defs>
                <linearGradient id="g2425" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={VINO} stopOpacity={0.6} />
                  <stop offset="95%" stopColor={VINO} stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="g2526" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={MORADO} stopOpacity={0.6} />
                  <stop offset="95%" stopColor={MORADO} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="s" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={v => v.toLocaleString('es-MX')} tick={{ fontSize: 10 }} />
              <Tooltip content={<TT />} />
              <Legend />
              <Area type="monotone" dataKey="2024-2025" stroke={VINO}   fill="url(#g2425)" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
              <Area type="monotone" dataKey="2025-2026" stroke={MORADO} fill="url(#g2526)" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── Fila 2: Eficiencia Terminal barras horizontales ── */}
      <div className="dash-ind-row" style={{ gridTemplateColumns: '1fr' }}>
        <CardWide titulo={`📈 Eficiencia Terminal — ${ctx}`}>
          <p className="grafica-descripcion">Porcentaje de eficiencia terminal por estado, ordenado de mayor a menor.</p>
          <ResponsiveContainer width="100%" height={Math.max(260, datosET.length * 26)}>
            <BarChart data={datosET} layout="vertical" margin={{ top: 8, right: 60, left: 130, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tickFormatter={v => `${v}%`} tick={{ fontSize: 10 }} domain={[0, 100]} />
              <YAxis type="category" dataKey="n" tick={{ fontSize: 10 }} width={125} />
              <Tooltip content={<TT sufijo="%" />} />
              <ReferenceLine x={p(regInd?.eficienciaTerminal)} stroke={NARANJA} strokeDasharray="5 3"
                label={{ value: `Ref: ${regInd?.eficienciaTerminal ?? ''}`, position: 'top', fontSize: 9, fill: NARANJA }} />
              <Bar dataKey="v" name="Ef. Terminal" radius={[0,4,4,0]} animationDuration={700}>
                {datosET.map((d, i) => (
                  <Cell key={i} fill={d.v >= 80 ? VERDE : d.v >= 70 ? NARANJA : ROJO} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardWide>
      </div>

      {/* ── Fila 3a: Aprobación barras horizontales ── */}
      <div className="dash-ind-row" style={{ gridTemplateColumns: '1fr' }}>
        <CardWide titulo={`✅ Aprobación — ${ctx}`}>
          <p className="grafica-descripcion">Porcentaje de aprobación por estado, ordenado de mayor a menor.</p>
          <ResponsiveContainer width="100%" height={Math.max(260, datosAprobacion.length * 26)}>
            <BarChart data={datosAprobacion} layout="vertical" margin={{ top: 8, right: 60, left: 130, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tickFormatter={v => `${v}%`} tick={{ fontSize: 10 }} domain={[0, 100]} />
              <YAxis type="category" dataKey="n" tick={{ fontSize: 10 }} width={125} />
              <Tooltip content={<TT sufijo="%" />} />
              <ReferenceLine x={p(regInd?.aprobacion)} stroke={VERDE} strokeDasharray="5 3"
                label={{ value: `Ref: ${regInd?.aprobacion ?? ''}`, position: 'top', fontSize: 9, fill: VERDE }} />
              <Bar dataKey="v" name="Aprobación" fill={VERDE} radius={[0,4,4,0]} animationDuration={700} />
            </BarChart>
          </ResponsiveContainer>
        </CardWide>
      </div>

      {/* ── Fila 3b: Deserción barras horizontales ── */}
      <div className="dash-ind-row" style={{ gridTemplateColumns: '1fr' }}>
        <CardWide titulo={`⚠️ Deserción — ${ctx}`}>
          <p className="grafica-descripcion">Porcentaje de deserción por estado, ordenado de mayor a menor.</p>
          <ResponsiveContainer width="100%" height={Math.max(260, datosDesercion.length * 26)}>
            <BarChart data={datosDesercion} layout="vertical" margin={{ top: 8, right: 60, left: 130, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tickFormatter={v => `${v}%`} tick={{ fontSize: 10 }} domain={[0, 100]} />
              <YAxis type="category" dataKey="n" tick={{ fontSize: 10 }} width={125} />
              <Tooltip content={<TT sufijo="%" />} />
              <ReferenceLine x={p(regInd?.desercion)} stroke={ROJO} strokeDasharray="5 3"
                label={{ value: `Ref: ${regInd?.desercion ?? ''}`, position: 'top', fontSize: 9, fill: ROJO }} />
              <Bar dataKey="v" name="Deserción" fill={ROJO} radius={[0,4,4,0]} animationDuration={700} />
            </BarChart>
          </ResponsiveContainer>
        </CardWide>
      </div>

      {/* ── Fila 4: Docentes — Radar (estado) o ScatterChart Hombres vs Mujeres (nacional) ── */}
      <div className="dash-ind-row" style={{ gridTemplateColumns: '1fr' }}>
        <CardWide titulo={`👨🏫 Docentes — ${ctx}`}>
          {estado ? (
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={datosDocentes} margin={{ top: 10, right: 40, left: 40, bottom: 10 }}>
                <PolarGrid />
                <PolarAngleAxis dataKey="indicador" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fontSize: 9 }} />
                <Radar name={estado} dataKey="valor" stroke={VINO} fill={VINO} fillOpacity={0.5} />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <>
              <p className="grafica-descripcion">Cada punto es un estado. Eje X = Docentes Hombres, Eje Y = Docentes Mujeres. El tamaño del punto indica el total.</p>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" dataKey="x" tick={{ fontSize: 10 }} tickFormatter={v => v.toLocaleString('es-MX')} name="Hombres">
                    <Label value="Docentes Hombres" offset={-10} position="insideBottom" style={{ fontSize: 11, fill: VINO }} />
                  </XAxis>
                  <YAxis type="number" dataKey="y" tick={{ fontSize: 10 }} tickFormatter={v => v.toLocaleString('es-MX')} name="Mujeres">
                    <Label value="Docentes Mujeres" angle={-90} position="insideLeft" style={{ fontSize: 11, fill: MORADO }} />
                  </YAxis>
                  <ZAxis type="number" dataKey="z" range={[60, 400]} name="Total" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload;
                      return (
                        <div className="grafica-tooltip">
                          <p className="grafica-tooltip-titulo">{d?.nombre}</p>
                          <p style={{ color: VINO }}>Hombres: <strong>{d?.x?.toLocaleString('es-MX')}</strong></p>
                          <p style={{ color: MORADO }}>Mujeres: <strong>{d?.y?.toLocaleString('es-MX')}</strong></p>
                          <p style={{ color: NARANJA }}>Total: <strong>{d?.z?.toLocaleString('es-MX')}</strong></p>
                        </div>
                      );
                    }}
                  />
                  <Scatter data={datosDocentes} fill={VINO} fillOpacity={0.75} />
                </ScatterChart>
              </ResponsiveContainer>
            </>
          )}
        </CardWide>
      </div>

      {/* ── Accesos rápidos ── */}
      <div className="dash-ind-accesos">
        <span className="dash-ind-accesos-titulo">Accesos rápidos</span>
        {[
          { label: '📊 Matrícula Comparativa',  ruta: '/graficas/matricula-nacional' },
          { label: '🏅 Ranking Estados',         ruta: '/graficas/ranking-estados' },
          { label: '📈 Eficiencia Terminal',     ruta: '/graficas/eficiencia-terminal' },
          { label: '⚠️ Deserción y Aprobación',  ruta: '/graficas/reprobacion-desafiliacion' },
          { label: '👨🏫 Docentes por Estado',    ruta: '/graficas/docentes-estado' },
          { label: '📊 Matrícula por Plantel',   ruta: '/graficas/matricula-plantel' },
        ].map(a => (
          <button key={a.ruta} className="grafica-link-btn" onClick={() => navigate(a.ruta)}>
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
