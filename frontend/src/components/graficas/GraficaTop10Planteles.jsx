import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { mapaService } from '../../services/api';

const TooltipPersonalizado = ({ active, payload, label }) => {
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

const GraficaTop10Planteles = () => {
  const navigate = useNavigate();
  const [datos, setDatos] = useState([]);
  const [colegio, setColegio] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mapaService.getMatriculaPorPlantel()
      .then(res => setDatos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const colegios = useMemo(() =>
    [...new Set(datos.map(d => d.colegio).filter(Boolean))].sort()
  , [datos]);

  const datosGrafica = useMemo(() => {
    const fuente = colegio ? datos.filter(d => d.colegio === colegio) : datos;
    const agrupado = {};
    fuente.forEach(d => {
      const key = d.plantel || d.cct;
      if (!agrupado[key]) agrupado[key] = { plantel: key, total: 0 };
      agrupado[key].total += Number(d.totalAlumnos ?? 0);
    });
    return Object.values(agrupado)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)
      .map(d => ({
        plantel: d.plantel.length > 20 ? d.plantel.slice(0, 20) + '…' : d.plantel,
        'Total Alumnos': d.total,
      }));
  }, [datos, colegio]);

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="grafica-page">
      <div className="grafica-topbar">
        <div className="grafica-title-area">
          <button className="grafica-back-btn" onClick={() => navigate('/estadisticas/matricula')}>
            ← Tabla
          </button>
          <h2> Top 10 Planteles Matrícula por Estado</h2>
        </div>
        <div className="grafica-controles">
          <label>Colegio / Estado</label>
          <select value={colegio} onChange={e => setColegio(e.target.value)}>
            <option value="">Todos</option>
            {colegios.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grafica-card">
        <p className="grafica-descripcion">
          Los 10 planteles con mayor número de alumnos por estado.
        </p>
        <ResponsiveContainer width="100%" height={420}>
          <BarChart data={datosGrafica} layout="vertical" margin={{ top: 10, right: 60, left: 160, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tickFormatter={v => v.toLocaleString('es-MX')} tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="plantel" tick={{ fontSize: 11 }} width={155} />
            <Tooltip content={<TooltipPersonalizado />} />
            <Legend />
            <Bar dataKey="Total Alumnos" fill="#7b1c2e" radius={[0, 4, 4, 0]} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficaTop10Planteles;
