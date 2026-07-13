# 🍽️ API Restaurante

API REST para la gestión de mesas, reservaciones y usuarios de un restaurante, con control de acceso basado en roles (**cliente** / **admin**).

Construida con **Node.js**, **Express**, **Prisma ORM** y **PostgreSQL**.

---

## 📋 Descripción

Esta API permite:

- Gestionar **mesas** del restaurante (crear, listar, consultar por ID).
- Gestionar **reservaciones** (crear, listar, actualizar, desactivar), asociadas a un usuario y a una mesa.
- Gestionar **usuarios** y **autenticación** mediante JWT, con dos roles: `cliente` y `admin`.
- Proteger rutas sensibles mediante middlewares de autenticación y autorización por rol.

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| [Node.js](https://nodejs.org/) | Entorno de ejecución |
| [Express](https://expressjs.com/) | Framework del servidor / enrutamiento |
| [Prisma ORM](https://www.prisma.io/) | Acceso y modelado de la base de datos |
| [PostgreSQL](https://www.postgresql.org/) | Motor de base de datos relacional |
| JWT (jsonwebtoken) | Autenticación basada en tokens |
| bcrypt | Encriptación de contraseñas |

---

## 📂 Estructura del proyecto

```
API_RESTAURANT/
├── controller/
│   ├── auth.controller.js          # Lógica de registro y login
│   ├── mesa.controller.js          # Lógica de mesas
│   └── reservaciones.controller.js # Lógica de reservaciones
├── Middleware/
│   └── auth.middleware.js          # Verificación de token y rol (admin)
├── prisma/
│   ├── client.js                   # Instancia de PrismaClient
│   └── schema.prisma               # Modelos de la base de datos
├── routes/
│   ├── auth.routes.js              # Rutas de autenticación
│   ├── mesa.routes.js              # Rutas de mesas
│   └── reservaciones.routes.js     # Rutas de reservaciones
├── .env                             # Variables de entorno (no se sube a Git)
├── .gitignore
├── index.js                         # Punto de entrada de la aplicación
├── package.json
├── package-lock.json
└── prisma.config.ts
```

---

## 🗄️ Modelo de base de datos

El script `tablasBDrestaurante.sql` define 3 tablas principales:

### `usuarios`
| Campo | Tipo | Descripción |
|---|---|---|
| id | SERIAL (PK) | Identificador único |
| nombre | VARCHAR(100) | Nombre del usuario |
| correo | VARCHAR(100) | Correo único |
| password | VARCHAR(255) | Contraseña encriptada |
| rol | VARCHAR(20) | `cliente` (default) o `admin` |
| created_at | TIMESTAMP | Fecha de creación |

### `mesas`
| Campo | Tipo | Descripción |
|---|---|---|
| id | SERIAL (PK) | Identificador único |
| numero | INT | Número de mesa (único) |
| capacidad | INT | Capacidad de personas |
| disponible | BOOLEAN | Disponibilidad de la mesa |
| created_at | TIMESTAMP | Fecha de creación |

### `reservaciones`
| Campo | Tipo | Descripción |
|---|---|---|
| id | SERIAL (PK) | Identificador único |
| fecha | DATE | Fecha de la reservación |
| hora | TIME | Hora de la reservación |
| personas | INT | Cantidad de personas |
| estado | VARCHAR(20) | `pendiente`, `confirmada` o `cancelada` |
| usuario_id | INT (FK) | Referencia a `usuarios` |
| mesa_id | INT (FK) | Referencia a `mesas` |
| created_at | TIMESTAMP | Fecha de creación |

---

## 🚀 Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/raquel-raquel-esperanza/api_restaurante.git
cd api_restaurante
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_base_datos"
JWT_SECRET="tu_clave_secreta"
PORT=3000
```

### 4. Crear la base de datos y ejecutar el script SQL

```bash
psql -U tu_usuario -d nombre_base_datos -f tablasBDrestaurante.sql
```

### 5. Generar el cliente de Prisma

```bash
npx prisma generate
```

Si necesitas sincronizar el schema con la base de datos:

```bash
npx prisma migrate dev
```

### 6. Iniciar el servidor

```bash
node index.js
```

El servidor quedará disponible en:

```
http://localhost:3000
```

---

## 📡 Endpoints principales

### Autenticación — `/api/v1/auth`

| Método | Ruta | Descripción | Protegida |
|---|---|---|---|
| POST | `/registro` | Registrar un nuevo usuario | No |
| POST | `/login` | Iniciar sesión y obtener token JWT | No |

### Mesas — `/api/v1/mesas`

| Método | Ruta | Descripción | Protegida |
|---|---|---|---|
| GET | `/` | Listar todas las mesas | No |
| GET | `/:id` | Obtener una mesa por ID | No |
| POST | `/` | Crear una nueva mesa | Recomendado: solo admin |

### Reservaciones — `/api/v1/reservaciones`

| Método | Ruta | Descripción | Protegida |
|---|---|---|---|
| GET | `/` | Listar todas las reservaciones | No |
| GET | `/:id` | Obtener una reservación por ID | No |
| POST | `/` | Crear una nueva reservación | Sí (token + admin) |
| PUT | `/:id` | Actualizar una reservación | Sí (token + admin) |
| PATCH | `/:id` | Desactivar/cancelar una reservación | Sí (token) |

---

## 🔐 Autenticación

Las rutas protegidas requieren un token JWT enviado en el header:

```
Authorization: Bearer <token>
```

El token se obtiene al hacer login exitoso en `/api/v1/auth/login`.

Ejemplo de body para login:

```json
{
  "correo": "carlos@email.com",
  "password": "123456"
}
```

---

## 🧪 Pruebas con Thunder Client

Ejemplo de body para crear una reservación (`POST /api/v1/reservaciones`):

```json
{
  "fecha": "2026-07-16",
  "hora": "19:00",
  "personas": 4,
  "estado": "pendiente",
  "usuario_id": 2,
  "mesa_id": 1
}
```

---

## 📌 Notas y buenas prácticas

- Nunca se debe enviar el campo `id` al crear registros; Postgres lo genera automáticamente.
- El registro público de usuarios siempre debería asignar el rol `cliente` por defecto; solo un `admin` autenticado puede ascender a otro usuario.
- Las contraseñas se almacenan encriptadas con `bcrypt`, nunca en texto plano.

---

## ✍️ Autora

**Raquel Esperanza**