import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Area
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

const esTotalGeneral = (e) => !e || /total|general|nacional/i.test(e);

const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="grafica-tooltip">
      <p className="grafica-tooltip-titulo">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color ?? p.stroke }}>
          {p.name}: <strong>{Number(p.value).toLocaleString('es-MX')}</strong>
        </p>
      ))}
    </div>
  );
};

const GraficaDocentesPorEstado = () => {
  const navigate = useNavigate();
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mapaService.getDocentesPorEstado()
      .then(res => setDatos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalGeneral = useMemo(() => datos.find(d => esTotalGeneral(d.estado)), [datos]);

  const datosGrafica = useMemo(() =>
    datos
      .filter(d => d.estado && !esTotalGeneral(d.estado))
      .map(d => ({
        estado: d.estado.length > 11 ? d.estado.slice(0, 11) + '…' : d.estado,
        estadoFull: d.estado,
        Hombres: parsear(d.totalDocentesHombres),
        Mujeres: parsear(d.totalDocentesMujeres),
        Total: parsear(d.totalDocentes),
      }))
      .sort((a, b) => b.Total - a.Total)
  , [datos]);

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="grafica-page">
      <div className="grafica-topbar">
        <div className="grafica-title-area">
          <button className="grafica-back-btn" onClick={() => navigate('/estadisticas/docentes-estado')}>← Tabla</button>
          <h2>👨🏫 Docentes por Estado</h2>
        </div>
      </div>

      {totalGeneral && (
        <div className="grafica-resumen-bar">
          <div className="grafica-resumen-item">
            <span className="grafica-resumen-label">Total Nacional Docentes</span>
            <span className="grafica-resumen-valor">{parsear(totalGeneral.totalDocentes).toLocaleString('es-MX')}</span>
          </div>
          <div className="grafica-resumen-item">
            <span className="grafica-resumen-label">Hombres Nacional</span>
            <span className="grafica-resumen-valor" style={{ color: '#7b1c2e' }}>{parsear(totalGeneral.totalDocentesHombres).toLocaleString('es-MX')}</span>
          </div>
          <div className="grafica-resumen-item">
            <span className="grafica-resumen-label">Mujeres Nacional</span>
            <span className="grafica-resumen-valor" style={{ color: '#5b3a8e' }}>{parsear(totalGeneral.totalDocentesMujeres).toLocaleString('es-MX')}</span>
          </div>
        </div>
      )}

      <div className="grafica-card">
        <p className="grafica-descripcion">
          Barras apiladas de hombres y mujeres por estado. La línea muestra el total de docentes.
        </p>
        <ResponsiveContainer width="100%" height={440}>
          <ComposedChart data={datosGrafica} margin={{ top: 10, right: 40, left: 20, bottom: 90 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="estado" angle={-40} textAnchor="end" tick={{ fontSize: 11 }} interval={0} />
            <YAxis yAxisId="left" tickFormatter={v => v.toLocaleString('es-MX')} tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={v => v.toLocaleString('es-MX')} tick={{ fontSize: 11 }} />
            <Tooltip content={<TT />} />
            <Legend wrapperStyle={{ paddingTop: 16 }} />
            <Bar yAxisId="left" dataKey="Hombres" stackId="a" fill="#7b1c2e" radius={[0,0,0,0]} animationDuration={700} />
            <Bar yAxisId="left" dataKey="Mujeres" stackId="a" fill="#5b3a8e" radius={[4,4,0,0]} animationDuration={700} />
            <Line yAxisId="right" type="monotone" dataKey="Total" stroke="#e67e22"
              strokeWidth={3} dot={{ r: 4, fill: '#e67e22' }} activeDot={{ r: 7 }} animationDuration={900} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficaDocentesPorEstado;
