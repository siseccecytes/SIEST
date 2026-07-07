import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RadialBarChart, RadialBar, Legend, ResponsiveContainer, Tooltip
} from 'recharts';
import { mapaService } from '../../services/api';

const parsear = (val) => {
  if (val == null) return null;
  const s = String(val).trim().replace(/%/g, '');
  const parteDecimal = s.split(',').pop();
  const n = s.includes(',') && parteDecimal.length !== 3
    ? Number(s.replace(',', '.'))
    : Number(s.replace(/,/g, ''));
  return isNaN(n) ? null : n;
};

const esTotalGeneral = (c) => !c || /total|general|nacional/i.test(c);

const COLORES = [
  '#7b1c2e','#8b2d3e','#9b3d4e','#ab4d5e','#5b3a8e','#6b4a9e',
  '#7b5aae','#27ae60','#2ecc71','#e67e22','#e74c3c','#3498db',
  '#9b59b6','#1abc9c','#f39c12','#d35400','#c0392b','#2980b9',
  '#8e44ad','#16a085','#2c3e50','#7f8c8d','#27ae60','#e74c3c',
  '#3498db','#9b59b6','#f1c40f','#e67e22','#1abc9c','#95a5a6',
  '#34495e','#bdc3c7',
];

const TT = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="grafica-tooltip">
      <p className="grafica-tooltip-titulo">{d.colegioFull}</p>
      <p style={{ color: d.fill }}>Eficiencia Terminal: <strong>{d.value}%</strong></p>
    </div>
  );
};

const GraficaEficienciaTerminal = () => {
  const navigate = useNavigate();
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mapaService.getIndicadoresNacionales()
      .then(res => setDatos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalGeneral = useMemo(() => datos.find(d => esTotalGeneral(d.colegio)), [datos]);

  const datosGrafica = useMemo(() =>
    datos
      .filter(d => d.colegio && !esTotalGeneral(d.colegio))
      .map((d, i) => ({
        name: d.colegio.length > 12 ? d.colegio.slice(0, 12) + '…' : d.colegio,
        colegioFull: d.colegio,
        value: parsear(d.eficienciaTerminal) ?? 0,
        fill: COLORES[i % COLORES.length],
      }))
      .filter(d => d.value > 0)
      .sort((a, b) => b.value - a.value)
  , [datos]);

  if (loading) return <div className="loading">Cargando...</div>;
  if (!datosGrafica.length) return <div className="loading">Sin datos disponibles</div>;

  return (
    <div className="grafica-page">
      <div className="grafica-topbar">
        <div className="grafica-title-area">
          <button className="grafica-back-btn" onClick={() => navigate('/estadisticas/indicadores-nacionales')}>← Tabla</button>
          <h2>📈 Eficiencia Terminal por Estado</h2>
        </div>
      </div>

      {totalGeneral && (
        <div className="grafica-resumen-bar">
          <div className="grafica-resumen-item">
            <span className="grafica-resumen-label">Eficiencia Terminal Nacional</span>
            <span className="grafica-resumen-valor">{totalGeneral.eficienciaTerminal ?? '—'}</span>
          </div>
          <div className="grafica-resumen-item">
            <span className="grafica-resumen-label">Aprobación Nacional</span>
            <span className="grafica-resumen-valor">{totalGeneral.aprobacion ?? '—'}</span>
          </div>
          <div className="grafica-resumen-item">
            <span className="grafica-resumen-label">Deserción Nacional</span>
            <span className="grafica-resumen-valor">{totalGeneral.desercion ?? '—'}</span>
          </div>
        </div>
      )}

      <div className="grafica-card">
        <p className="grafica-descripcion">
          Cada arco representa un estado. A mayor longitud del arco, mayor eficiencia terminal (escala 0–100%).
        </p>
        <ResponsiveContainer width="100%" height={520}>
          <RadialBarChart
            cx="50%" cy="50%"
            innerRadius="10%" outerRadius="90%"
            data={datosGrafica}
            startAngle={180} endAngle={-180}
          >
            <RadialBar
              minAngle={3}
              background={{ fill: '#f5f5f5' }}
              clockWise
              dataKey="value"
              label={{ position: 'insideStart', fill: '#fff', fontSize: 9 }}
            />
            <Tooltip content={<TT />} />
            <Legend
              iconSize={10}
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{ fontSize: 10, maxHeight: 480, overflowY: 'auto' }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficaEficienciaTerminal;
