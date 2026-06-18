# Sistema de Gestión de Laboratorio

Este proyecto es una plataforma web orientada a administrar los recursos y operativas de un laboratorio universitario, desarrollada con un enfoque en la práctica. Permite a los profesores y técnicos mantener un registro ordenado del equipamiento, registrar quién los tiene y controlar los objetos que necesitan reparación o que han sido extraviados.

## Funcionalidades Principales

El sistema está dividido en módulos según las necesidades de cada usuario:

- **📦 Préstamos de Objetos**: Permite a los profesores de práctica registrar qué estudiantes solicitan y utilizan equipos del laboratorio, incluyendo fechas estimadas de devolución y control de objetos vencidos.
- **🚨 Registro de Sustracciones (Robos)**: Módulo para reportar objetos extraviados o robados, documentando detalles, responsables y enviando alertas al sistema.
- **🔧 Reparaciones**: Gestión de maquinaria y equipos descompuestos que deben ser enviados a reparación. El técnico reparador (otro profesor de la universidad) toma el control de los estados de la reparación (En reparación, Reparado, Irreparable).
- **📋 Inventario General**: (Solo para administradores). Permite ver y registrar entradas y salidas de stock del laboratorio general, y crear nuevos objetos en el catálogo.
- **🔔 Notificaciones en Tiempo Real**: Alertas integradas para avisar a profesores y técnicos sobre préstamos vencidos, nuevos robos o equipos críticos.

## Roles del Sistema

El sistema cuenta con un control de acceso basado en roles (RBAC) para limitar la visibilidad y permisos:

1. **Profesor de Práctica**: Tiene acceso a crear y gestionar *Préstamos*, reportar *Sustracciones* y mandar equipos a *Reparaciones*.
2. **Reparador (Técnico)**: Tiene acceso exclusivo a la pestaña de *Reparaciones* para actualizar el estado de las máquinas y equipos averiados que le han sido asignados.
3. **Administrador**: Tiene control total sobre todos los módulos, la gestión del inventario y la administración de usuarios.

## Credenciales de Prueba por Defecto

Al levantar el sistema por primera vez, la base de datos se poblará automáticamente con las siguientes cuentas para poder probar todos los roles:

| Rol | Correo Electrónico | Contraseña |
| --- | --- | --- |
| Administrador | `admin@lab.cl` | `admin1234` |
| Profesor de Práctica | `carlos.ramirez@lab.cl` | `practica1234` |
| Reparador | `jorge.soto@lab.cl` | `reparador1234` |

*(Nota: Todos los correos deben usar el dominio institucional `@lab.cl`)*

## Tecnologías Utilizadas

- **Frontend**: React.js, Vite, React Router, SweetAlert2.
- **Backend**: Node.js, Express.js.
- **Base de Datos**: PostgreSQL (Object-Relational Mapping con TypeORM).
- **Seguridad**: Autenticación JWT (JSON Web Tokens), validaciones con Joi, contraseñas encriptadas con bcryptjs.

## Instalación y Configuración Local

### Prerrequisitos
- Node.js instalado (v16 o superior).
- PostgreSQL instalado y ejecutándose.

### 1. Configurar la Base de Datos
Crea una base de datos en PostgreSQL (por ejemplo, `practica_db`). Luego, en la carpeta `backend`, renombra el archivo `.env.example` a `.env` y configura las variables de entorno para que apunten a tu base de datos local:

```env
PORT=3000
HOST=localhost
DB_HOST=localhost
DB_USERNAME=postgres
DB_PASSWORD=tu_contrasena
DB_DATABASE=practica_db
DB_PORT=5432
ACCESS_TOKEN_SECRET=tu_secreto_super_seguro
```

### 2. Ejecutar el Backend
Abre una terminal y navega hasta la carpeta del backend:
```bash
cd backend
npm install
npm run dev
```
*(Al iniciar por primera vez, la base de datos creará las tablas automáticamente e insertará los usuarios de prueba).*

### 3. Ejecutar el Frontend
Abre otra terminal y navega hasta la carpeta del frontend:
```bash
cd frontend
npm install
npm run dev
```

El frontend se levantará por defecto en `http://localhost:5173`. Abre este enlace en tu navegador para empezar a usar la aplicación.