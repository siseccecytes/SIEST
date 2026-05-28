const Filters = ({ estados, municipios, onEstadoChange, onMunicipioChange, selectedEstado, selectedMunicipio }) => {
  return (
    <div className="filters">
      <div className="filter-group">
        <label htmlFor="estado">Estado:</label>
        <select 
          id="estado" 
          value={selectedEstado || ''} 
          onChange={(e) => onEstadoChange(e.target.value)}
        >
          <option value="">Todos los estados</option>
          {estados.map((estado) => (
            <option key={estado.id} value={estado.id}>
              {estado.nombre}
            </option>
          ))}
        </select>
      </div>

      {selectedEstado && (
        <div className="filter-group">
          <label htmlFor="municipio">Municipio:</label>
          <select 
            id="municipio" 
            value={selectedMunicipio || ''} 
            onChange={(e) => onMunicipioChange(e.target.value)}
          >
            <option value="">Todos los municipios</option>
            {municipios.map((municipio) => (
              <option key={municipio.id} value={municipio.id}>
                {municipio.nombre}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Filters;
