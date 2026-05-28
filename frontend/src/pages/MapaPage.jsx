import { useState, useEffect } from 'react';
import MapView from '../components/MapView';
import InfoFederal from '../components/InfoFederal';
import InfoEstatal from '../components/InfoEstatal';
import DetallePlantel from '../components/DetallePlantel';
import { mapaService } from '../services/api';

const MapaPage = () => {
  const [estados, setEstados] = useState([]);
  const [infoFederal, setInfoFederal] = useState([]);
  const [infoEstatal, setInfoEstatal] = useState(null);
  const [estadoHover, setEstadoHover] = useState(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);
  const [planteles, setPlanteles] = useState([]);
  const [plantelSeleccionado, setPlantelSeleccionado] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroCCT, setFiltroCCT] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (filtroCCT) {
      const plantel = planteles.find(p => p.cct === filtroCCT);
      if (plantel) setPlantelSeleccionado(plantel);
    } else {
      setPlantelSeleccionado(null);
    }
  }, [filtroCCT, planteles]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [estadosRes, federalRes] = await Promise.all([
        mapaService.getEstados(),
        mapaService.getInfoFederal()
      ]);
      setEstados(Array.isArray(estadosRes.data) ? estadosRes.data : []);
      setInfoFederal(Array.isArray(federalRes.data) ? federalRes.data : []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEstadoHover = async (estadoNombre) => {
    setEstadoHover(estadoNombre);
    if (estadoNombre) {
      try {
        const response = await mapaService.getInfoEstatal(estadoNombre);
        setInfoEstatal(response.data);
      } catch {
        setInfoEstatal(null);
      }
    } else {
      setInfoEstatal(null);
    }
  };

  const handleEstadoClick = async (estado) => {
    setEstadoSeleccionado(estado);
    setPlantelSeleccionado(null);
    setLoading(true);
    try {
      const response = await mapaService.getPlantelesByEstado(estado.nombre);
      setPlanteles(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error al cargar planteles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setEstadoSeleccionado(null);
    setPlanteles([]);
    setPlantelSeleccionado(null);
    setFiltroTipo('');
    setFiltroCCT('');
  };

  const plantelesFiltrados = planteles.filter(p => {
    const matchTipo = !filtroTipo || p.tipo === filtroTipo;
    const matchCCT = !filtroCCT || p.cct === filtroCCT;
    return matchTipo && matchCCT;
  });

  const tiposUnicos = [...new Set(planteles.map(p => p.tipo).filter(Boolean))];
  const cctsUnicos = [...new Set(planteles.map(p => p.cct).filter(Boolean))];

  return (
    <div>
      <div className="page-header">
        <h2>🏫 Planteles</h2>
      </div>

      {loading && <div className="loading">Cargando...</div>}

      {!loading && !estadoSeleccionado && (
        <div className="mapa-container">
          <div className="mapa-section">
            <MapView
              estados={estados}
              onEstadoHover={handleEstadoHover}
              onEstadoClick={handleEstadoClick}
            />
            <InfoFederal datos={infoFederal} />
          </div>
          {estadoHover && infoEstatal && (
            <div className="info-estatal-panel">
              <InfoEstatal datos={infoEstatal} estadoNombre={estadoHover} />
            </div>
          )}
        </div>
      )}

      {!loading && estadoSeleccionado && (
        <div className="estado-view">
          <h2>{estadoSeleccionado.nombre}</h2>
          <div className="info-planteles">
            <p>Total de planteles: {planteles.length}</p>
            <p>Planteles filtrados: {plantelesFiltrados.length}</p>
          </div>
          <div className="filtros">
            <div className="filtro-group">
              <label>Tipo:</label>
              <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                <option value="">Todos ({planteles.length})</option>
                {tiposUnicos.map(tipo => (
                  <option key={tipo} value={tipo}>
                    {tipo} ({planteles.filter(p => p.tipo === tipo).length})
                  </option>
                ))}
              </select>
            </div>
            <div className="filtro-group">
              <label>CCT:</label>
              <select value={filtroCCT} onChange={(e) => setFiltroCCT(e.target.value)}>
                <option value="">Seleccione un CCT</option>
                {cctsUnicos.map(cct => {
                  const p = planteles.find(pl => pl.cct === cct);
                  return (
                    <option key={cct} value={cct}>{cct} - {p?.nombreDelPlantel}</option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="planteles-container">
            <MapView
              planteles={plantelesFiltrados}
              center={[estadoSeleccionado.latitud, estadoSeleccionado.longitud]}
              zoom={7}
              onPlantelClick={setPlantelSeleccionado}
              onBack={() => setPlantelSeleccionado(null)}
              plantelSeleccionado={plantelSeleccionado}
            />
            {plantelSeleccionado && <DetallePlantel plantel={plantelSeleccionado} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapaPage;
