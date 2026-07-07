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

const esTotalGeneral = (colegio) =>
  !colegio || /total/i.test(colegio) || /general/i.test(colegio) || /nacional/i.test(colegio);

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

const GraficaMatriculaGenero = () => {
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
        colegio: d.colegio.length > 12 ? d.colegio.slice(0, 12) + '…' : d.colegio,
        colegioFull: d.colegio,
        Hombres: parsear(d.hombres1) + parsear(d.hombres2),
        Mujeres: parsear(d.mujeres1) + parsear(d.mujeres2),
      }))
      .sort((a, b) => (b.Hombres + b.Mujeres) - (a.Hombres + a.Mujeres));
  }, [datos2425, datos2526, ciclo]);

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="grafica-page">
      <div className="grafica-topbar">
        <div className="grafica-title-area">
          <button className="grafica-back-btn" onClick={() => navigate('/estadisticas/matricula-nacional')}>
            ← Tabla
          </button>
          <h2>👥 Matrícula Nacional — Distribución por Género</h2>
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
            <span className="grafica-resumen-label">Total Hombres Nacional</span>
            <span className="grafica-resumen-valor" style={{ color: '#7b1c2e' }}>
              {(parsear(totalGeneral.hombres1) + parsear(totalGeneral.hombres2)).toLocaleString('es-MX')}
            </span>
          </div>
          <div className="grafica-resumen-item">
            <span className="grafica-resumen-label">Total Mujeres Nacional</span>
            <span className="grafica-resumen-valor" style={{ color: '#5b3a8e' }}>
              {(parsear(totalGeneral.mujeres1) + parsear(totalGeneral.mujeres2)).toLocaleString('es-MX')}
            </span>
          </div>
          <div className="grafica-resumen-item">
            <span className="grafica-resumen-label">Total General Nacional</span>
            <span className="grafica-resumen-valor">
              {parsear(totalGeneral.totalMatricula2 ?? totalGeneral.totalMatricula1).toLocaleString('es-MX')}
            </span>
          </div>
        </div>
      )}

      <div className="grafica-card">
        <p className="grafica-descripcion">
          Distribución de hombres y mujeres por estado.
        </p>
        <ResponsiveContainer width="100%" height={420}>
          <BarChart data={datosGrafica} margin={{ top: 10, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="colegio" angle={-40} textAnchor="end" tick={{ fontSize: 11 }} interval={0} />
            <YAxis tickFormatter={v => v.toLocaleString('es-MX')} tick={{ fontSize: 11 }} />
            <Tooltip content={<TooltipPersonalizado />} />
            <Legend wrapperStyle={{ paddingTop: 16 }} />
            <Bar dataKey="Hombres" fill="#7b1c2e" radius={[4, 4, 0, 0]} animationDuration={800} />
            <Bar dataKey="Mujeres" fill="#5b3a8e" radius={[4, 4, 0, 0]} animationDuration={800} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficaMatriculaGenero;
