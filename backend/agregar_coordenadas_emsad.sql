-- Agregar columnas de latitud y longitud a directorio_emsad
ALTER TABLE directorio_emsad 
ADD COLUMN latitud DOUBLE DEFAULT NULL,
ADD COLUMN longitud DOUBLE DEFAULT NULL;

-- Verificar que directorio_cecyte tenga las columnas
-- Si no las tiene, ejecutar:
-- ALTER TABLE directorio_cecyte 
-- ADD COLUMN latitud DOUBLE DEFAULT NULL,
-- ADD COLUMN longitud DOUBLE DEFAULT NULL;
