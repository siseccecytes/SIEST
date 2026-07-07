import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Dot
} from 'recharts';
import { mapaService } from '../../services/api';

const parsear = (val) => {
  if (val == null) return 0;
  const s = String(val).trim().replace(/%/g, '');
  const parteDecimal = s.split(',').pop();
  const n = s.includes(',') && parteDecimal.length !== 3
    ? Number(s.replace(',', '.'))
    : Number(s.replace(/,/g, ''));
  return isNaN(n) ? 0 : n;
};

const esTotalGeneral = (c) => !c || /total|general|nacional/i.test(c);

const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="grafica-tooltip">
      <p className="grafica-tooltip-titulo">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>{Number(p.value).toLocaleString('es-MX')}</strong>
        </p>
      ))}
    </div>
  );
};

const GraficaMatriculaNacional = () => {
  const navigate = useNavigate();
  const [datos2425, setDatos2425] = useState([]);
  const [datos2526, setDatos2526] = useState([]);
  const [ciclo, setCiclo] = useState('ambos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      mapaService.getMatriculaNacional(),
      mapaService.getMatriculaNacional20252026()
    ]).then(([r1, r2]) => {
      setDatos2425(r1.data);
      setDatos2526(r2.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const total2425 = useMemo(() => datos2425.find(d => esTotalGeneral(d.colegio)), [datos2425]);
  const total2526 = useMemo(() => datos2526.find(d => esTotalGeneral(d.colegio)), [datos2526]);

  const datosGrafica = useMemo(() => {
    const colegios = [...new Set([
      ...datos2425.filter(d => !esTotalGeneral(d.colegio)).map(d => d.colegio),
      ...datos2526.filter(d => !esTotalGeneral(d.colegio)).map(d => d.colegio),
    ].filter(Boolean))].sort();

    return colegios.map(col => {
      const d1 = datos2425.find(d => d.colegio === col);
      const d2 = datos2526.find(d => d.colegio === col);
      return {
        colegio: col.length > 11 ? col.slice(0, 11) + '…' : col,
        colegioFull: col,
        '2024-2025': d1 ? parsear(d1.totalMatricula2 ?? d1.totalMatricula1) : 0,
        '2025-2026': d2 ? parsear(d2.totalMatricula2 ?? d2.totalMatricula1) : 0,
      };
    }).sort((a, b) => b['2025-2026'] - a['2025-2026']);
  }, [datos2425, datos2526]);

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="grafica-page">
      <div className="grafica-topbar">
        <div className="grafica-title-area">
          <button className="grafica-back-btn" onClick={() => navigate('/estadisticas/matricula-nacional')}>← Tabla</button>
          <h2>📊 Matrícula Nacional — Comparativa por Estado</h2>
        </div>
        <div className="grafica-controles">
          <label>Ciclo escolar</label>
          <select value={ciclo} onChange={e => setCiclo(e.target.value)}>
            <option value="ambos">Comparar ambos</option>
            <option value="2024-2025">2024-2025</option>
            <option value="2025-2026">2025-2026</option>
          </select>
        </div>
      </div>

      <div className="grafica-resumen-bar">
        {total2425 && (
          <div className="grafica-resumen-item">
            <span className="grafica-resumen-label">Total Nacional 2024-2025</span>
            <span className="grafica-resumen-valor" style={{ color: '#7b1c2e' }}>
              {parsear(total2425.totalMatricula2 ?? total2425.totalMatricula1).toLocaleString('es-MX')}
            </span>
          </div>
        )}
        {total2526 && (
          <div className="grafica-resumen-item">
            <span className="grafica-resumen-label">Total Nacional 2025-2026</span>
            <span className="grafica-resumen-valor" style={{ color: '#5b3a8e' }}>
              {parsear(total2526.totalMatricula2 ?? total2526.totalMatricula1).toLocaleString('es-MX')}
            </span>
          </div>
        )}
      </div>

      <div className="grafica-card">
        <p className="grafica-descripcion">
          Evolución de matrícula por estado entre ciclos. Los puntos resaltan variaciones significativas.
        </p>
        <ResponsiveContainer width="100%" height={440}>
          <LineChart data={datosGrafica} margin={{ top: 10, right: 30, left: 20, bottom: 90 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="colegio" angle={-40} textAnchor="end" tick={{ fontSize: 11 }} interval={0} />
            <YAxis tickFormatter={v => v.toLocaleString('es-MX')} tick={{ fontSize: 11 }} />
            <Tooltip content={<TT />} />
            <Legend wrapperStyle={{ paddingTop: 16 }} />
            {(ciclo === 'ambos' || ciclo === '2024-2025') && (
              <Line type="monotone" dataKey="2024-2025" stroke="#7b1c2e" strokeWidth={3}
                dot={<Dot r={5} fill="#7b1c2e" />} activeDot={{ r: 8 }} animationDuration={800} />
            )}
            {(ciclo === 'ambos' || ciclo === '2025-2026') && (
              <Line type="monotone" dataKey="2025-2026" stroke="#5b3a8e" strokeWidth={3}
                dot={<Dot r={5} fill="#5b3a8e" />} activeDot={{ r: 8 }} animationDuration={800} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficaMatriculaNacional;
