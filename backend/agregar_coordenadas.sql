-- Agregar columnas de latitud y longitud a la tabla directorio_cecyte
ALTER TABLE directorio_cecyte 
ADD COLUMN latitud DOUBLE DEFAULT NULL,
ADD COLUMN longitud DOUBLE DEFAULT NULL;

-- Opcional: Crear índice para búsquedas más rápidas
CREATE INDEX idx_coordenadas ON directorio_cecyte(latitud, longitud);
