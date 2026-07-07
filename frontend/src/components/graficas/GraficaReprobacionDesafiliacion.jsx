import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Label, ZAxis
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

const TT = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="grafica-tooltip">
      <p className="grafica-tooltip-titulo">{d?.nombre}</p>
      <p style={{ color: '#27ae60' }}>Aprobación: <strong>{d?.x}%</strong></p>
      <p style={{ color: '#c0392b' }}>Deserción: <strong>{d?.y}%</strong></p>
    </div>
  );
};

const GraficaReprobacionDesafiliacion = () => {
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
      .map(d => ({
        nombre: d.colegio,
        x: parsear(d.aprobacion) ?? 0,
        y: parsear(d.desercion) ?? 0,
      }))
      .filter(d => d.x > 0 || d.y > 0)
  , [datos]);

  const promedioApro = useMemo(() =>
    datosGrafica.length ? datosGrafica.reduce((s, d) => s + d.x, 0) / datosGrafica.length : 0
  , [datosGrafica]);

  const promedioDes = useMemo(() =>
    datosGrafica.length ? datosGrafica.reduce((s, d) => s + d.y, 0) / datosGrafica.length : 0
  , [datosGrafica]);

  if (loading) return <div className="loading">Cargando...</div>;
  if (!datosGrafica.length) return <div className="loading">Sin datos disponibles</div>;

  return (
    <div className="grafica-page">
      <div className="grafica-topbar">
        <div className="grafica-title-area">
          <button className="grafica-back-btn" onClick={() => navigate('/estadisticas/indicadores-nacionales')}>← Tabla</button>
          <h2>⚠️ Aprobación vs Deserción por Estado</h2>
        </div>
      </div>

      {totalGeneral && (
        <div className="grafica-resumen-bar">
          <div className="grafica-resumen-item">
            <span className="grafica-resumen-label">Aprobación Nacional</span>
            <span className="grafica-resumen-valor" style={{ color: '#27ae60' }}>{totalGeneral.aprobacion ?? '—'}</span>
          </div>
          <div className="grafica-resumen-item">
            <span className="grafica-resumen-label">Deserción Nacional</span>
            <span className="grafica-resumen-valor" style={{ color: '#c0392b' }}>{totalGeneral.desercion ?? '—'}</span>
          </div>
          <div className="grafica-resumen-item">
            <span className="grafica-resumen-label">Eficiencia Terminal Nacional</span>
            <span className="grafica-resumen-valor">{totalGeneral.eficienciaTerminal ?? '—'}</span>
          </div>
        </div>
      )}

      <div className="grafica-card">
        <p className="grafica-descripcion">
          Cada punto es un estado. Eje X = Aprobación, Eje Y = Deserción. Los estados ideales están en la esquina inferior derecha (alta aprobación, baja deserción).
        </p>
        <ResponsiveContainer width="100%" height={460}>
          <ScatterChart margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" dataKey="x" domain={[0, 100]} tick={{ fontSize: 11 }}
              tickFormatter={v => `${v}%`} name="Aprobación">
              <Label value="Aprobación (%)" offset={-10} position="insideBottom" style={{ fontSize: 12, fill: '#27ae60' }} />
            </XAxis>
            <YAxis type="number" dataKey="y" domain={[0, 100]} tick={{ fontSize: 11 }}
              tickFormatter={v => `${v}%`} name="Deserción">
              <Label value="Deserción (%)" angle={-90} position="insideLeft" style={{ fontSize: 12, fill: '#c0392b' }} />
            </YAxis>
            <ZAxis range={[80, 80]} />
            <Tooltip content={<TT />} cursor={{ strokeDasharray: '3 3' }} />
            <ReferenceLine x={promedioApro} stroke="#27ae60" strokeDasharray="5 3"
              label={{ value: `Prom. Apro. ${promedioApro.toFixed(1)}%`, position: 'top', fontSize: 9, fill: '#27ae60' }} />
            <ReferenceLine y={promedioDes} stroke="#c0392b" strokeDasharray="5 3"
              label={{ value: `Prom. Des. ${promedioDes.toFixed(1)}%`, position: 'right', fontSize: 9, fill: '#c0392b' }} />
            <Scatter data={datosGrafica} fill="#5b3a8e" fillOpacity={0.8} />
          </ScatterChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem', fontSize: 11, color: '#666' }}>
          {datosGrafica.map((d, i) => (
            <span key={i} style={{ background: '#f5f5f5', padding: '2px 8px', borderRadius: 4 }}>
              {d.nombre}: {d.x}% / {d.y}%
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GraficaReprobacionDesafiliacion;
