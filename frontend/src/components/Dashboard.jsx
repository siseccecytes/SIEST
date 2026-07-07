import { useNavigate } from 'react-router-dom';

const menus = [
  {
    icon: '📊',
    titulo: 'Dashboard Indicadores',
    descripcion: 'Resumen ejecutivo nacional: matrícula, semestres, indicadores y docentes comparados entre ciclos',
    submenus: [
      { label: 'Ver Dashboard Nacional', ruta: '/dashboard/indicadores' },
    ]
  },
  {
    icon: '📊',
    titulo: 'Estadísticas',
    descripcion: 'Planteles, Matrícula, Indicadores y Docentes',
    submenus: [
      { label: 'Directorio Planteles',          ruta: '/estadisticas/planteles' },
      { label: 'Matrícula Nacional 2024-2025',   ruta: '/estadisticas/matricula-nacional' },
      { label: 'Matrícula Nacional 2025-2026',   ruta: '/estadisticas/matricula-nacional-2025-2026' },
      { label: 'Matrícula por Plantel',          ruta: '/estadisticas/matricula' },
      { label: 'Indicadores Nacionales',         ruta: '/estadisticas/indicadores-nacionales' },
      { label: 'Indicadores por Plantel',        ruta: '/estadisticas/indicadores' },
      { label: 'Docentes por Estado',            ruta: '/estadisticas/docentes-estado' },
      { label: 'Docentes por Plantel',           ruta: '/estadisticas/docentes' },
    ]
  },
  {
    icon: '📉',
    titulo: 'Gráficas',
    descripcion: 'Comparativas y análisis visual entre ciclos escolares',
    submenus: [
      { label: 'Matrícula Comparativa',          ruta: '/graficas/matricula-nacional' },
      { label: 'Matrícula por Género',           ruta: '/graficas/matricula-genero' },
      { label: 'Ranking de Estados',             ruta: '/graficas/ranking-estados' },
      { label: 'Eficiencia Terminal',            ruta: '/graficas/eficiencia-terminal' },
      { label: 'Deserción y Aprobación',         ruta: '/graficas/reprobacion-desafiliacion' },
      { label: 'Docentes por Estado',            ruta: '/graficas/docentes-estado' },
      { label: 'Horas Asignadas',                ruta: '/graficas/horas-docentes' },
      { label: 'Top 10 Planteles',               ruta: '/graficas/top10-planteles' },
      { label: 'Oferta Educativa',               ruta: '/graficas/oferta-educativa' },
    ]
  },
  {
    icon: '📋',
    titulo: 'Anexos de Ejecución',
    descripcion: 'Anexos de Ejecución y Avances por Estado',
    submenus: [
      { label: 'Anexos de Ejecución - Avances por Estado', ruta: '/anexos/programa-anual' },
    ]
  },
  {
    icon: '📚',
    titulo: 'Oferta Educativa',
    descripcion: 'Oferta por Estado y por Plantel',
    submenus: [
      { label: 'Oferta Educativa Nacional',      ruta: '/oferta/estado' },
      { label: 'Oferta Educativa por Plantel',   ruta: '/oferta/plantel' },
    ]
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const nombre = localStorage.getItem('nombre') || 'Usuario';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <img src="/logo_cecyte.png" alt="CECyTE" className="header-logo-cecyte" />
          <div className="header-divider" />
          <img src="/educacion.png" alt="SEP" className="header-logo-edu" />
        </div>
        <div className="dashboard-header-right">
          <span className="dashboard-user">👤 {nombre}</span>
          <button className="dashboard-logout" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </header>

      <main className="dashboard-main">
        <h2 className="dashboard-welcome">Sistema de Reportes Generales</h2>
        <p className="dashboard-subtitle">Selecciona una sección para continuar</p>
        <div className="dashboard-grid">
          {menus.map((menu) => (
            <div key={menu.titulo} className="dashboard-card">
              <span className="card-icon">{menu.icon}</span>
              <h3 className="card-titulo">{menu.titulo}</h3>
              <p className="card-descripcion">{menu.descripcion}</p>
              <ul className="card-submenus">
                {menu.submenus.map((sub) => (
                  <li key={sub.ruta} onClick={() => navigate(sub.ruta)}>
                    {sub.label}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
