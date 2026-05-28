# Frontend - Mapa de Planteles CECYTES

Frontend en React para visualizar planteles CECYTES en un mapa interactivo.

## Instalación

```bash
cd frontend
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: http://localhost:3000

## Requisitos

- Node.js 16 o superior
- Backend corriendo en http://localhost:8081

## Características

- Mapa interactivo con Leaflet
- Filtros por Estado y Municipio
- Lista de planteles con información detallada
- Diseño responsive
- Integración completa con API REST del backend

## Estructura del proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── MapView.jsx       # Componente del mapa
│   │   ├── Filters.jsx        # Filtros de búsqueda
│   │   └── PlantelList.jsx    # Lista de planteles
│   ├── services/
│   │   └── api.js             # Servicios API
│   ├── App.jsx                # Componente principal
│   ├── App.css                # Estilos
│   └── main.jsx               # Punto de entrada
├── index.html
├── package.json
└── vite.config.js
```
