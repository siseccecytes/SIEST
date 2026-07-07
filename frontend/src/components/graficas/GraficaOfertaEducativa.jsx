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
          {p.name}: <strong>{p.value} planteles</strong>
        </p>
      ))}
    </div>
  );
};

const GraficaOfertaEducativa = () => {
  const navigate = useNavigate();
  const [datos, setDatos] = useState([]);
  const [colegio, setColegio] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mapaService.getOfertaPorPlantel()
      .then(res => setDatos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const colegios = useMemo(() =>
    [...new Set(datos.map(d => d.colegio).filter(Boolean))].sort()
  , [datos]);

  const datosGrafica = useMemo(() => {
    const fuente = colegio ? datos.filter(d => d.colegio === colegio) : datos;
    const conteo = {};
    fuente.forEach(d => {
      const carrera = d.carrera;
      if (!carrera) return;
      conteo[carrera] = (conteo[carrera] ?? 0) + 1;
    });
    return Object.entries(conteo)
      .map(([carrera, count]) => ({
        carrera: carrera.length > 22 ? carrera.slice(0, 22) + '…' : carrera,
        carreraFull: carrera,
        'Planteles': count,
      }))
      .sort((a, b) => b['Planteles'] - a['Planteles'])
      .slice(0, 15);
  }, [datos, colegio]);

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="grafica-page">
      <div className="grafica-topbar">
        <div className="grafica-title-area">
          <button className="grafica-back-btn" onClick={() => navigate('/oferta/plantel')}>
            ← Tabla
          </button>
          <h2> Carreras con Mayor Precencia en Planteles </h2>
        </div>
        <div className="grafica-controles">
          <label>Colegio / Estado</label>
          <select value={colegio} onChange={e => setColegio(e.target.value)}>
            <option value="">Nacional</option>
            {colegios.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grafica-card">
        <p className="grafica-descripcion">
          Top 15 carreras con mayor número de planteles que las ofrecen.
        </p>
        <ResponsiveContainer width="100%" height={460}>
          <BarChart data={datosGrafica} layout="vertical" margin={{ top: 10, right: 60, left: 180, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
            <YAxis type="category" dataKey="carrera" tick={{ fontSize: 10 }} width={175} />
            <Tooltip content={<TooltipPersonalizado />} />
            <Legend />
            <Bar dataKey="Planteles" fill="#5b3a8e" radius={[0, 4, 4, 0]} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficaOfertaEducativa;
