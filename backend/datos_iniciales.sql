-- Script de datos iniciales para el sistema de planteles

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS mapa_planteles;
USE mapa_planteles;

-- Insertar estados de ejemplo
INSERT INTO estados (nombre, clave, latitud, longitud, poblacion, capital) VALUES
('Ciudad de México', 'CDMX', 19.4326, -99.1332, 9209944, 'Ciudad de México'),
('Jalisco', 'JAL', 20.6597, -103.3496, 8348151, 'Guadalajara'),
('Nuevo León', 'NL', 25.6866, -100.3161, 5784442, 'Monterrey'),
('Puebla', 'PUE', 19.0414, -98.2063, 6583278, 'Puebla'),
('Guanajuato', 'GTO', 21.0190, -101.2574, 6166934, 'Guanajuato');

-- Insertar municipios de ejemplo
INSERT INTO municipios (nombre, clave, latitud, longitud, poblacion, estado_id) VALUES
('Cuauhtémoc', '015', 19.4326, -99.1332, 545884, 1),
('Miguel Hidalgo', '016', 19.4270, -99.2020, 372889, 1),
('Guadalajara', '039', 20.6597, -103.3496, 1495189, 2),
('Zapopan', '120', 20.7214, -103.3918, 1332272, 2),
('Monterrey', '039', 25.6866, -100.3161, 1135512, 3),
('San Pedro Garza García', '019', 25.6488, -100.4099, 122627, 3);

-- Insertar planteles de ejemplo
INSERT INTO planteles (nombre, clave, latitud, longitud, direccion, telefono, email, director, total_alumnos, total_docentes, turno, imagen_url, municipio_id) VALUES
('Plantel Centro Histórico', 'PL001', 19.4340, -99.1330, 'Av. Juárez 123, Centro', '5555-1234', 'centro@plantel.edu.mx', 'Lic. Juan Pérez', 850, 45, 'Matutino', 'https://via.placeholder.com/400x300', 1),
('Plantel Polanco', 'PL002', 19.4320, -99.1950, 'Av. Masaryk 456, Polanco', '5555-5678', 'polanco@plantel.edu.mx', 'Mtra. María García', 720, 38, 'Vespertino', 'https://via.placeholder.com/400x300', 2),
('Plantel Guadalajara Norte', 'PL003', 20.6700, -103.3500, 'Av. Vallarta 789, Guadalajara', '3333-1234', 'gdlnorte@plantel.edu.mx', 'Ing. Carlos López', 950, 52, 'Matutino', 'https://via.placeholder.com/400x300', 3),
('Plantel Zapopan', 'PL004', 20.7250, -103.3900, 'Av. Patria 321, Zapopan', '3333-5678', 'zapopan@plantel.edu.mx', 'Dra. Ana Martínez', 680, 35, 'Vespertino', 'https://via.placeholder.com/400x300', 4),
('Plantel Monterrey Centro', 'PL005', 25.6900, -100.3100, 'Av. Constitución 555, Monterrey', '8181-1234', 'mtycentro@plantel.edu.mx', 'Mtro. Roberto Sánchez', 1100, 60, 'Matutino', 'https://via.placeholder.com/400x300', 5),
('Plantel San Pedro', 'PL006', 25.6500, -100.4050, 'Av. Vasconcelos 888, San Pedro', '8181-5678', 'sanpedro@plantel.edu.mx', 'Lic. Laura Hernández', 580, 32, 'Vespertino', 'https://via.placeholder.com/400x300', 6);
