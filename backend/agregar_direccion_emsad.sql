-- Agregar columna direccion a directorio_emsad si no existe
ALTER TABLE directorio_emsad 
ADD COLUMN IF NOT EXISTS direccion VARCHAR(500);

-- Verificar las columnas
DESCRIBE directorio_emsad;
