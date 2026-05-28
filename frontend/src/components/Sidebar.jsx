import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const menus = [
  {
    icon: '📊',
    label: 'Estadísticas',
    items: [
      { icon: '🏫', label: 'Planteles',               ruta: '/estadisticas/planteles' },
      { icon: '📊', label: 'Matrícula Nacional 2024-2025', ruta: '/estadisticas/matricula-nacional' },
      { icon: '📊', label: 'Matrícula Nacional 2025-2026', ruta: '/estadisticas/matricula-nacional-2025-2026' },
      { icon: '👥', label: 'Matrícula por Plantel',    ruta: '/estadisticas/matricula' },
      { icon: '📈', label: 'Indicadores Nacionales',   ruta: '/estadisticas/indicadores-nacionales' },
      { icon: '📊', label: 'Indicadores por Plantel',  ruta: '/estadisticas/indicadores' },
      { icon: '👨🏫', label: 'Docentes por Estado',   ruta: '/estadisticas/docentes-estado' },
      { icon: '👨🏫', label: 'Docentes por Plantel',  ruta: '/estadisticas/docentes' },
    ]
  },
  {
    icon: '📋',
    label: 'Anexos de Ejecución',
    items: [
      { icon: '📄', label: 'Anexos de Ejecución', ruta: '/anexos/programa-anual' },
    ]
  },
  {
    icon: '📚',
    label: 'Oferta Educativa',
    items: [
      { icon: '📚', label: 'Oferta Nacional',    ruta: '/oferta/estado' },
      { icon: '🏫', label: 'Oferta por Plantel', ruta: '/oferta/plantel' },
    ]
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const nombre = localStorage.getItem('nombre') || 'Usuario';
  const [abiertos, setAbiertos] = useState(() => {
    const idx = menus.findIndex(m => m.items.some(i => location.pathname.startsWith(i.ruta)));
    return idx >= 0 ? [idx] : [0];
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleGrupo = (idx) => {
    setAbiertos(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleNavegar = (ruta) => {
    navigate(ruta);
    setMobileOpen(false);
  };

  return (
    <>
      <button className="sidebar-hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Menú">
        {mobileOpen ? '✕' : '☰'}
      </button>
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
        <div className="sidebar-logo" onClick={() => { navigate('/dashboard'); setMobileOpen(false); }}>
          <img src="/logo_cecyte.png" alt="CECyTE" className="sidebar-logo-img" />
          <div className="sidebar-logo-divider" />
          <img src="/educacion.png" alt="SEP" className="sidebar-edu-img" />
        </div>

        <nav className="sidebar-nav">
          {menus.map((grupo, idx) => (
            <div key={idx} className="sidebar-grupo">
              <div
                className={`sidebar-grupo-header ${abiertos.includes(idx) ? 'abierto' : ''}`}
                onClick={() => toggleGrupo(idx)}
              >
                <span className="sidebar-icon">{grupo.icon}</span>
                <span className="sidebar-label">{grupo.label}</span>
                <span className="sidebar-arrow">{abiertos.includes(idx) ? '▼' : '▶'}</span>
              </div>
              {abiertos.includes(idx) && (
                <div className="sidebar-subitems">
                  {grupo.items.map((item) => (
                    <div
                      key={item.ruta}
                      className={`sidebar-subitem ${location.pathname === item.ruta ? 'active' : ''}`}
                      onClick={() => handleNavegar(item.ruta)}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <span>👤</span>
            <span>{nombre}</span>
          </div>
          <button className="sidebar-logout" onClick={handleLogout}>
            🚪 Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
