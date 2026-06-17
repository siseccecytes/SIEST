-- ============================================================
--  Índices para acelerar las búsquedas por CCT y COLEGIO.
--  Sin estos índices, MySQL revisa fila por fila toda la tabla.
--  Ejecutar UNA sola vez sobre la base de datos indicadores_educativos.
-- ============================================================

CREATE INDEX idx_planteles_cct          ON planteles (cct);
CREATE INDEX idx_planteles_colegio      ON planteles (colegio);

CREATE INDEX idx_cecyte_cct             ON directorio_cecyte (cct);
CREATE INDEX idx_emsad_cct              ON directorio_emsad (cct);

CREATE INDEX idx_docentes_colegio       ON docentes_por_plantel (colegio);
CREATE INDEX idx_indicadores_colegio    ON indicadores_por_plantel (colegio);
CREATE INDEX idx_matricula_colegio      ON matricula_por_plantel (colegio);
