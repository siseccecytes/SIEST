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
