import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
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

const esTotalGeneral = (colegio) =>
  !colegio || /total/i.test(colegio) || /general/i.test(colegio) || /nacional/i.test(colegio);

const COLORES = ['#7b1c2e', '#8b2d3e', '#9b3d4e', '#5b3a8e', '#6b4a9e', '#7b5aae'];

const TooltipPersonalizado = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="grafica-tooltip">
      <p className="grafica-tooltip-titulo">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.fill ?? p.color }}>
          Total: <strong>{Number(p.value).toLocaleString('es-MX')}</strong>
        </p>
      ))}
    </div>
  );
};

const GraficaRankingEstados = () => {
  const navigate = useNavigate();
  const [datos2425, setDatos2425] = useState([]);
  const [datos2526, setDatos2526] = useState([]);
  const [ciclo, setCiclo] = useState('2025-2026');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      mapaService.getMatriculaNacional(),
      mapaService.getMatriculaNacional20252026()
    ]).then(([r1, r2]) => {
      setDatos2425(r1.data);
      setDatos2526(r2.data);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalGeneral = useMemo(() => {
    const fuente = ciclo === '2024-2025' ? datos2425 : datos2526;
    return fuente.find(d => esTotalGeneral(d.colegio));
  }, [datos2425, datos2526, ciclo]);

  const datosGrafica = useMemo(() => {
    const fuente = ciclo === '2024-2025' ? datos2425 : datos2526;
    return fuente
      .filter(d => d.colegio && !esTotalGeneral(d.colegio))
      .map(d => ({
        estado: d.colegio.length > 14 ? d.colegio.slice(0, 14) + '…' : d.colegio,
        estadoFull: d.colegio,
        'Total Matrícula': parsear(d.totalMatricula2 ?? d.totalMatricula1),
      }))
      .filter(d => d['Total Matrícula'] > 0)
      .sort((a, b) => b['Total Matrícula'] - a['Total Matrícula']);
  }, [datos2425, datos2526, ciclo]);

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="grafica-page">
      <div className="grafica-topbar">
        <div className="grafica-title-area">
          <button className="grafica-back-btn" onClick={() => navigate('/estadisticas/matricula-nacional')}>
            ← Tabla
          </button>
          <h2>🏅 Ranking de Estados por Matrícula</h2>
        </div>
        <div className="grafica-controles">
          <label>Ciclo escolar</label>
          <select value={ciclo} onChange={e => setCiclo(e.target.value)}>
            <option value="2024-2025">2024-2025</option>
            <option value="2025-2026">2025-2026</option>
          </select>
        </div>
      </div>

      {totalGeneral && (
        <div className="grafica-resumen-bar">
          <div className="grafica-resumen-item">
            <span className="grafica-resumen-label">Total Nacional {ciclo}</span>
            <span className="grafica-resumen-valor">
              {parsear(totalGeneral.totalMatricula2 ?? totalGeneral.totalMatricula1).toLocaleString('es-MX')}
            </span>
          </div>
        </div>
      )}

      <div className="grafica-card">
        <p className="grafica-descripcion">
          Todos los estados ordenados de mayor a menor matrícula.
        </p>
        <ResponsiveContainer width="100%" height={Math.max(420, datosGrafica.length * 32)}>
          <BarChart data={datosGrafica} layout="vertical" margin={{ top: 10, right: 80, left: 140, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tickFormatter={v => v.toLocaleString('es-MX')} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="estado" tick={{ fontSize: 11 }} width={135} />
            <Tooltip content={<TooltipPersonalizado />} />
            <Bar dataKey="Total Matrícula" radius={[0, 4, 4, 0]} animationDuration={800}>
              {datosGrafica.map((_, i) => (
                <Cell key={i} fill={COLORES[i % COLORES.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficaRankingEstados;
