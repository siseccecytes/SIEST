import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
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

const esTotalGeneral = (estado) =>
  !estado || /total/i.test(estado) || /general/i.test(estado) || /nacional/i.test(estado);

const TooltipPersonalizado = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="grafica-tooltip">
      <p className="grafica-tooltip-titulo">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>{Number(p.value).toLocaleString('es-MX')} hrs</strong>
        </p>
      ))}
    </div>
  );
};

const GraficaHorasDocentes = () => {
  const navigate = useNavigate();
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mapaService.getDocentesPorEstado()
      .then(res => setDatos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalGeneral = useMemo(() =>
    datos.find(d => esTotalGeneral(d.estado))
  , [datos]);

  const datosGrafica = useMemo(() =>
    datos
      .filter(d => d.estado && !esTotalGeneral(d.estado))
      .map(d => ({
        estado: d.estado.length > 12 ? d.estado.slice(0, 12) + '…' : d.estado,
        estadoFull: d.estado,
        'Horas Hombres': parsear(d.totalHorasHombres),
        'Horas Mujeres': parsear(d.totalHorasMujeres),
      }))
      .sort((a, b) =>
        (b['Horas Hombres'] + b['Horas Mujeres']) - (a['Horas Hombres'] + a['Horas Mujeres'])
      )
  , [datos]);

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="grafica-page">
      <div className="grafica-topbar">
        <div className="grafica-title-area">
          <button className="grafica-back-btn" onClick={() => navigate('/estadisticas/docentes-estado')}>
            ← Tabla
          </button>
          <h2>⏱️ Horas Asignadas por Estado</h2>
        </div>
      </div>

      {totalGeneral && (
        <div className="grafica-resumen-bar">
          <div className="grafica-resumen-item">
            <span className="grafica-resumen-label">Total Horas Nacional</span>
            <span className="grafica-resumen-valor">{parsear(totalGeneral.totalHoras).toLocaleString('es-MX')}</span>
          </div>
          <div className="grafica-resumen-item">
            <span className="grafica-resumen-label">Horas Hombres Nacional</span>
            <span className="grafica-resumen-valor" style={{ color: '#7b1c2e' }}>{parsear(totalGeneral.totalHorasHombres).toLocaleString('es-MX')}</span>
          </div>
          <div className="grafica-resumen-item">
            <span className="grafica-resumen-label">Horas Mujeres Nacional</span>
            <span className="grafica-resumen-valor" style={{ color: '#5b3a8e' }}>{parsear(totalGeneral.totalHorasMujeres).toLocaleString('es-MX')}</span>
          </div>
        </div>
      )}

      <div className="grafica-card">
        <p className="grafica-descripcion">
          Total de horas asignadas a docentes por estado, desglosado por género. Indica cobertura curricular y carga horaria del sistema.
        </p>
        <ResponsiveContainer width="100%" height={420}>
          <BarChart data={datosGrafica} margin={{ top: 10, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="estado" angle={-40} textAnchor="end" tick={{ fontSize: 11 }} interval={0} />
            <YAxis tickFormatter={v => v.toLocaleString('es-MX')} tick={{ fontSize: 11 }} />
            <Tooltip content={<TooltipPersonalizado />} />
            <Legend wrapperStyle={{ paddingTop: 16 }} />
            <Bar dataKey="Horas Hombres" fill="#7b1c2e" radius={[4, 4, 0, 0]} animationDuration={800} />
            <Bar dataKey="Horas Mujeres" fill="#5b3a8e" radius={[4, 4, 0, 0]} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficaHorasDocentes;
