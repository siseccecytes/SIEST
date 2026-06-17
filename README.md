<div align="center">

# SIEST

### Sistema de Indicadores Educativos y mapa de planteles — CECYTE

Aplicación web para visualizar planteles del CECYTE en un mapa interactivo y consultar
indicadores educativos (matrícula, docentes, oferta educativa, eficiencia terminal, etc.)
a nivel nacional, estatal y por plantel.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-green)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![MySQL](https://img.shields.io/badge/MySQL-8-blue)

</div>

---

## Tabla de contenidos

1. [Descripción](#descripción)
2. [Tecnologías](#tecnologías)
3. [Estructura del repositorio](#estructura-del-repositorio)
4. [Ramas](#ramas)
5. [Requisitos previos](#requisitos-previos)
6. [Instalación](#instalación)
7. [Configuración](#configuración)
8. [Ejecución en desarrollo](#ejecución-en-desarrollo)
9. [Despliegue](#despliegue)
10. [Convenciones](#convenciones)

---

## Descripción

SIEST es un sistema que combina:

- **Un mapa interactivo** (Leaflet) con la ubicación de los planteles CECYTE de todo el país.
- **Tableros de indicadores** educativos: matrícula nacional y por plantel, docentes por
  estado y por plantel, oferta educativa, anexos de ejecución, indicadores nacionales, etc.
- **Acceso protegido** mediante usuario/contraseña (autenticación con JWT).

El backend expone una API REST y el frontend la consume para construir los mapas y tablas.

## Tecnologías

| Capa      | Tecnología                                             |
|-----------|--------------------------------------------------------|
| Backend   | Java 17, Spring Boot 3.5, Spring Security (JWT), JPA/Hibernate |
| Base de datos | MySQL 8                                            |
| Frontend  | React 18, Vite 5, React Router, Leaflet, Axios         |
| Despliegue | Docker, Docker Compose, Caddy (HTTPS automático)      |

## Estructura del repositorio

```
SIEST/
├── backend/      # API REST en Spring Boot (Java)
│   └── src/main/java/com/mapa/mapa/
│       ├── controller/   # Endpoints REST
│       ├── service/      # Lógica de negocio
│       ├── repository/   # Acceso a datos (JPA)
│       ├── entity/       # Entidades de la base de datos
│       └── config/       # Seguridad, JWT, CORS
├── frontend/     # Aplicación React (Vite)
│   └── src/
│       ├── components/   # Mapa, tablas, filtros, login...
│       ├── services/     # Cliente de la API (api.js)
│       └── pages/        # Páginas
└── docker-compose.yml    # Orquesta base de datos + backend + frontend (en ramas qa/produccion)
```

## Ramas

Este repositorio está organizado en tres ramas:

| Rama         | Propósito                                                        |
|--------------|------------------------------------------------------------------|
| `main`       | Documentación general del proyecto (este README).                |
| `qa`         | Código + configuración de despliegue del entorno de **QA**.      |
| `produccion` | Código + configuración de despliegue del entorno de **producción**. |

> Para trabajar con el código, ubícate en `qa` o `produccion`:
> ```bash
> git checkout qa
> ```

## Requisitos previos

- **Java 17** (JDK)
- **Node.js 18+** y npm
- **MySQL 8** (o Docker, que ya incluye la base de datos)
- **Git**

## Instalación

> Los siguientes pasos asumen que estás en la rama `qa` o `produccion` (donde vive el código).

**1. Clonar el repositorio**

```bash
git clone <URL-DEL-REPO>
cd SIEST
git checkout qa
```

**2. Backend**

```bash
cd backend
./mvnw clean install      # en Windows: mvnw.cmd clean install
```

**3. Frontend**

```bash
cd frontend
npm install
```

**4. Base de datos**

Crea la base de datos `indicadores_educativos` en MySQL e importa el dump incluido en el repositorio:

```bash
mysql -u root -p indicadores_educativos < dump-indicadores_educativos-202605271625.sql
```

## Configuración

**Backend** — crea `backend/.env` a partir de `backend/.env.example` y llena los valores:

```env
DB_URL=jdbc:mysql://localhost:3306/indicadores_educativos?useSSL=false&serverTimezone=UTC
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_password
JWT_SECRET=un-secreto-largo-y-aleatorio-de-minimo-32-caracteres
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

**Frontend** — el archivo `frontend/.env` define la URL del backend:

```env
VITE_API_URL=http://localhost:8081/api
```

## Ejecución en desarrollo

**Backend** (queda en `http://localhost:8081`):

```bash
cd backend
./mvnw spring-boot:run
```

**Frontend** (queda en `http://localhost:3000`):

```bash
cd frontend
npm run dev
```

Abre `http://localhost:3000` e inicia sesión con las credenciales de administrador
configuradas en la base de datos.

## Despliegue

El despliegue con **Docker** (base de datos + backend + frontend con HTTPS automático vía Caddy)
y el flujo de **CI/CD con GitHub Actions** están documentados en las ramas `qa` y `produccion`
(archivo `README-DESPLIEGUE.md` y `docker-compose.yml`).

Resumen del flujo:

```
push a la rama qa  →  GitHub Actions (runner self-hosted)  →  docker compose up -d --build
```

## Convenciones

Para mantener los README estandarizados, todos los README del proyecto siguen esta estructura:

1. Título + descripción corta
2. Tecnologías
3. Requisitos previos
4. Instalación
5. Configuración
6. Ejecución
7. Despliegue (si aplica)

**Mensajes de commit** (recomendado, estilo *Conventional Commits*):

```
feat:     nueva funcionalidad
fix:      corrección de error
docs:     cambios en documentación
refactor: refactorización sin cambiar comportamiento
chore:    tareas de mantenimiento (configs, dependencias)
```
