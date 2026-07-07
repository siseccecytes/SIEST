import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import MapaPage from './pages/MapaPage';
import MatriculaNacional from './components/MatriculaNacional';
import MatriculaNacional20252026 from './components/MatriculaNacional20252026';
import MatriculaPorPlantel from './components/MatriculaPorPlantel';
import IndicadoresNacionales from './components/IndicadoresNacionales';
import IndicadoresPorPlantel from './components/IndicadoresPorPlantel';
import DocentesPorEstado from './components/DocentesPorEstado';
import DocentesPorPlantel from './components/DocentesPorPlantel';
import OfertaEducativaNacional from './components/OfertaEducativaNacional';
import OfertaEducativaPorPlantel from './components/OfertaEducativaPorPlantel';
import ProgramaAnual from './components/ProgramaAnual';
import GraficaMatriculaNacional from './components/graficas/GraficaMatriculaNacional';
import GraficaMatriculaGenero from './components/graficas/GraficaMatriculaGenero';
import GraficaEficienciaTerminal from './components/graficas/GraficaEficienciaTerminal';
import GraficaReprobacionDesafiliacion from './components/graficas/GraficaReprobacionDesafiliacion';
import GraficaDocentesPorEstado from './components/graficas/GraficaDocentesPorEstado';
import GraficaHorasDocentes from './components/graficas/GraficaHorasDocentes';
import GraficaTop10Planteles from './components/graficas/GraficaTop10Planteles';
import GraficaOfertaEducativa from './components/graficas/GraficaOfertaEducativa';
import GraficaRankingEstados from './components/graficas/GraficaRankingEstados';
import GraficaMatriculaPlantel from './components/graficas/GraficaMatriculaPlantel';
import DashboardIndicadores from './components/DashboardIndicadores';
import './App.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const Proximamente = ({ titulo }) => (
  <div className="coming-soon">{titulo} — Próximamente</div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

        {/* Estadísticas */}
        <Route path="/estadisticas/planteles" element={<PrivateRoute><Layout><MapaPage /></Layout></PrivateRoute>} />
        <Route path="/estadisticas/matricula-nacional" element={<PrivateRoute><Layout><MatriculaNacional /></Layout></PrivateRoute>} />
        <Route path="/estadisticas/matricula-nacional-2025-2026" element={<PrivateRoute><Layout><MatriculaNacional20252026 /></Layout></PrivateRoute>} />
        <Route path="/estadisticas/matricula" element={<PrivateRoute><Layout><MatriculaPorPlantel /></Layout></PrivateRoute>} />
        <Route path="/estadisticas/indicadores-nacionales" element={<PrivateRoute><Layout><IndicadoresNacionales /></Layout></PrivateRoute>} />
        <Route path="/estadisticas/indicadores" element={<PrivateRoute><Layout><IndicadoresPorPlantel /></Layout></PrivateRoute>} />
        <Route path="/estadisticas/docentes-estado" element={<PrivateRoute><Layout><DocentesPorEstado /></Layout></PrivateRoute>} />
        <Route path="/estadisticas/docentes" element={<PrivateRoute><Layout><DocentesPorPlantel /></Layout></PrivateRoute>} />

        {/* Gráficas */}
        <Route path="/graficas/matricula-nacional" element={<PrivateRoute><Layout><GraficaMatriculaNacional /></Layout></PrivateRoute>} />
        <Route path="/graficas/matricula-genero" element={<PrivateRoute><Layout><GraficaMatriculaGenero /></Layout></PrivateRoute>} />
        <Route path="/graficas/eficiencia-terminal" element={<PrivateRoute><Layout><GraficaEficienciaTerminal /></Layout></PrivateRoute>} />
        <Route path="/graficas/reprobacion-desafiliacion" element={<PrivateRoute><Layout><GraficaReprobacionDesafiliacion /></Layout></PrivateRoute>} />
        <Route path="/graficas/docentes-estado" element={<PrivateRoute><Layout><GraficaDocentesPorEstado /></Layout></PrivateRoute>} />
        <Route path="/graficas/horas-docentes" element={<PrivateRoute><Layout><GraficaHorasDocentes /></Layout></PrivateRoute>} />
        <Route path="/graficas/top10-planteles" element={<PrivateRoute><Layout><GraficaTop10Planteles /></Layout></PrivateRoute>} />
        <Route path="/graficas/oferta-educativa" element={<PrivateRoute><Layout><GraficaOfertaEducativa /></Layout></PrivateRoute>} />

        <Route path="/graficas/ranking-estados" element={<PrivateRoute><Layout><GraficaRankingEstados /></Layout></PrivateRoute>} />
        <Route path="/graficas/matricula-plantel" element={<PrivateRoute><Layout><GraficaMatriculaPlantel /></Layout></PrivateRoute>} />
        <Route path="/dashboard/indicadores" element={<PrivateRoute><Layout><DashboardIndicadores /></Layout></PrivateRoute>} />

        {/* Anexos */}
        <Route path="/anexos/programa-anual" element={<PrivateRoute><Layout><ProgramaAnual /></Layout></PrivateRoute>} />

        {/* Oferta Educativa */}
        <Route path="/oferta/estado" element={<PrivateRoute><Layout><OfertaEducativaNacional /></Layout></PrivateRoute>} />
        <Route path="/oferta/plantel" element={<PrivateRoute><Layout><OfertaEducativaPorPlantel /></Layout></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
