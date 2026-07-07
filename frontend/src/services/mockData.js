// Datos de ejemplo para desarrollo sin base de datos
// Estructura idéntica a la que devuelve el backend real

const ESTADOS = [
  'AGUASCALIENTES','BAJA CALIFORNIA','BAJA CALIFORNIA SUR','CAMPECHE',
  'CHIAPAS','CHIHUAHUA','COAHUILA','DURANGO','GUANAJUATO','GUERRERO',
  'HIDALGO','JALISCO','MICHOACÁN','MORELOS','NAYARIT','NUEVO LEÓN',
  'OAXACA','PUEBLA','QUERÉTARO','QUINTANA ROO','SAN LUIS POTOSÍ',
  'SINALOA','SONORA','TABASCO','TAMAULIPAS','TLAXCALA','VERACRUZ',
  'YUCATÁN','ZACATECAS',
];

// matricula nacional 2024-2025
export const mockMatriculaNacional = [
  ...ESTADOS.map((e, i) => ({
    colegio: e,
    hombres1: String(1800 + i * 120),
    mujeres1: String(1600 + i * 110),
    hombres2: String(400 + i * 30),
    mujeres2: String(350 + i * 28),
    totalMatricula1: String(3400 + i * 230),
    totalMatricula2: String(3400 + i * 230),
  })),
  {
    colegio: 'TOTAL NACIONAL',
    hombres1: '65000', mujeres1: '58000',
    hombres2: '14000', mujeres2: '12000',
    totalMatricula1: '149000', totalMatricula2: '149000',
  },
];

// matricula nacional 2025-2026
export const mockMatriculaNacional20252026 = [
  ...ESTADOS.map((e, i) => ({
    colegio: e,
    hombres1: String(1900 + i * 125),
    mujeres1: String(1700 + i * 115),
    hombres2: String(420 + i * 32),
    mujeres2: String(370 + i * 29),
    totalMatricula1: String(3590 + i * 242),
    totalMatricula2: String(3590 + i * 242),
  })),
  {
    colegio: 'TOTAL NACIONAL',
    hombres1: '68000', mujeres1: '61000',
    hombres2: '14800', mujeres2: '12600',
    totalMatricula1: '156400', totalMatricula2: '156400',
  },
];

// indicadores nacionales
export const mockIndicadoresNacionales = [
  ...ESTADOS.map((e, i) => ({
    colegio: e,
    eficienciaTerminal: `${(72 + (i % 18)).toFixed(1)}%`,
    aprobacion:         `${(78 + (i % 15)).toFixed(1)}%`,
    desercion:          `${(5  + (i % 8)).toFixed(1)}%`,
  })),
  {
    colegio: 'TOTAL GENERAL',
    eficienciaTerminal: '78.4%',
    aprobacion:         '82.1%',
    desercion:          '7.3%',
  },
];

// docentes por estado
export const mockDocentesPorEstado = [
  ...ESTADOS.map((e, i) => ({
    estado: e,
    totalPlantelesConCaptura: String(8 + (i % 12)),
    totalDocentes:       String(280 + i * 18),
    totalDocentesHombres:String(160 + i * 10),
    totalDocentesMujeres:String(120 + i * 8),
    totalHoras:          String(8400 + i * 540),
    totalHorasHombres:   String(4800 + i * 300),
    totalHorasMujeres:   String(3600 + i * 240),
  })),
  {
    estado: 'TOTAL NACIONAL',
    totalPlantelesConCaptura: '280',
    totalDocentes: '8200', totalDocentesHombres: '4700', totalDocentesMujeres: '3500',
    totalHoras: '246000', totalHorasHombres: '141000', totalHorasMujeres: '105000',
  },
];

const CARRERAS = [
  'Programación','Mecatrónica','Contabilidad','Logística','Electrónica',
  'Administración en MiPyMEs','Diseño Gráfico Digital','Mantenimiento Industrial',
  'Preparación de Alimentos y Bebidas','Enfermería General',
  'Electromecánica','Inteligencia Artificial','Ciberseguridad',
  'Servicios de Hospedaje','Construcción',
];

// oferta educativa por plantel
export const mockOfertaPorPlantel = ESTADOS.flatMap((estado, ei) =>
  Array.from({ length: 6 + (ei % 4) }, (_, pi) =>
    CARRERAS.slice(0, 3 + (pi % 5)).map(carrera => ({
      colegio: estado,
      cct: `${String(ei + 1).padStart(2,'0')}DCC${String(pi + 1).padStart(3,'0')}`,
      plantel: `PLANTEL ${estado} ${pi + 1}`,
      carrera,
      modalidad: pi % 2 === 0 ? 'Presencial' : 'Dual',
      movimientos: 'VIGENTE',
    }))
  ).flat()
);

// matricula por plantel
export const mockMatriculaPorPlantel = ESTADOS.flatMap((estado, ei) =>
  Array.from({ length: 5 + (ei % 4) }, (_, pi) => ({
    colegio: estado,
    tipo: pi % 3 === 0 ? 'EMSAD' : 'CECyTE',
    cct: `${String(ei + 1).padStart(2,'0')}DCC${String(pi + 1).padStart(3,'0')}`,
    plantel: `PLANTEL ${estado} ${pi + 1}`,
    totalAlumnos: String(200 + ei * 15 + pi * 40),
  }))
);

// indicadores por plantel
export const mockIndicadoresPorPlantel = ESTADOS.flatMap((estado, ei) =>
  Array.from({ length: 5 + (ei % 4) }, (_, pi) => ({
    colegio: estado,
    cct: `${String(ei + 1).padStart(2,'0')}DCC${String(pi + 1).padStart(3,'0')}`,
    tipo: pi % 3 === 0 ? 'EMSAD' : 'CECyTE',
    nombreDelPlantel: `PLANTEL ${estado} ${pi + 1}`,
    eficienciaTerminal: `${(68 + (pi * 3) % 25).toFixed(1)}%`,
    desafiliacionEscolar: `${(3 + (pi * 2) % 10).toFixed(1)}%`,
    reprobacion: `${(6 + (pi * 2) % 12).toFixed(1)}%`,
  }))
);

// docentes por plantel
export const mockDocentesPorPlantel = ESTADOS.flatMap((estado, ei) =>
  Array.from({ length: 4 + (ei % 3) }, (_, pi) =>
    Array.from({ length: 3 + (pi % 4) }, (_, di) => ({
      colegio: estado,
      cct: `${String(ei + 1).padStart(2,'0')}DCC${String(pi + 1).padStart(3,'0')}`,
      plantel: `PLANTEL ${estado} ${pi + 1}`,
      nombreDelDocente: `DOCENTE ${di + 1}`,
      claveCarrera: `CAR${String(di + 1).padStart(3,'0')}`,
      carrera: CARRERAS[di % CARRERAS.length],
      horasAsignadas: 12 + (di % 4) * 6,
    }))
  ).flat()
);

export const mockAnexos = ESTADOS.map((estado, i) => ({
  colegios: estado,
  anexos2024: `ANEXO_${estado.replace(/\s/g,'_')}_2024.pdf`,
}));

export const mockInfoFederal = [{
  id: 1,
  indicador: 'CECyTE Nacional',
  aprobacion: 82.1,
  desafiliacion: 7.3,
  eficienciaTerminal: 78.4,
  docentes: '8,200',
  matricula: 156400,
  carreras: '115 carreras',
  titular: 'Titular Nacional CECyTE',
}];

export const mockInfoEstatal = Object.fromEntries(
  ESTADOS.map((e, i) => [e, {
    colegio: e,
    matricula: String(3590 + i * 242),
    eficienciaTerminal: `${(72 + i % 18).toFixed(1)}%`,
    desafiliacionEscolar: `${(3 + i % 8).toFixed(1)}%`,
    aprobacion: `${(78 + i % 15).toFixed(1)}%`,
    presupuesto: `$${(45 + i * 2).toFixed(1)} MDP`,
    docentesA: String(160 + i * 10),
    docentesB: String(120 + i * 8),
    aulas: String(80 + i * 5),
    direccion: `Av. Principal #${100 + i}, ${e}`,
    latitud: String(18 + (i % 12) * 0.8),
    longitud: String(-98 - (i % 10) * 0.5),
    titular: `Director(a) ${e}`,
  }])
);
