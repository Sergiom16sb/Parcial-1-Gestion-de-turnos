# Parcial 1 - Gestión de Turnos

Sistema de gestión de turnos y reservas desarrollado con Bun, React y Tailwind CSS.

## Tecnologías Utilizadas

- **Bun** - Runtime de JavaScript rápido
- **React 19** - Biblioteca para interfaces de usuario
- **React Router DOM 7** - Enrutamiento
- **Tailwind CSS 4** - Framework de CSS utilitario
- **shadcn/ui** - Componentes de UI (Radix UI)
- **Dexie** - Base de datos IndexedDB para el cliente
- **TypeScript** - Tipado estático

## Prerrequisitos

- [Bun](https://bun.sh) v1.3.11 o superior instalado

## Instalación

Clonar el repositorio e instalar dependencias:

```bash
bun install
```

## Scripts Disponibles

### Desarrollo

Inicia el servidor de desarrollo con hot reload:

```bash
bun dev
```

O alternativamente:

```bash
bun --hot src/index.ts
```

El servidor se ejecutará en `http://localhost:3000` (o el puerto configurado).

### Producción

Ejecuta la aplicación en modo producción:

```bash
bun start
```

O con variable de entorno:

```bash
NODE_ENV=production bun src/index.ts
```

### Build

Genera los archivos optimizados para producción en la carpeta `dist/`:

```bash
bun run build
```

Opciones adicionales del build:

```bash
bun run build.ts --outdir=dist --minify --sourcemap=linked --external=react,react-dom
```

## Estructura del Proyecto

```
.
├── src/
│   ├── components/      # Componentes reutilizables (ui/)
│   ├── contexts/        # Contextos de React (AuthContext)
│   ├── hooks/           # Custom hooks (useAuth, useTurnos, useReservas)
│   ├── layouts/         # Layouts (AdminLayout, AppLayout)
│   ├── pages/           # Páginas de la aplicación
│   │   ├── admin/       # Páginas de administración
│   │   ├── Home.tsx     # Página principal
│   │   └── Login.tsx    # Página de login
│   ├── lib/             # Utilidades y validaciones
│   ├── db/              # Configuración de base de datos (Dexie)
│   ├── App.tsx          # Componente principal y rutas
│   ├── index.ts         # Servidor Bun con WebSocket
│   ├── index.html       # HTML principal
│   └── frontend.tsx     # Entrada del cliente React
├── styles/
│   └── globals.css      # Estilos globales
├── build.ts             # Script de build personalizado
├── package.json
└── tsconfig.json
```

## Funcionalidades

- **Autenticación**: Sistema de login con protección de rutas
- **Gestión de Turnos**: Administración de turnos del sistema
- **Gestión de Reservas**: Sistema de reservas
- **Panel de Administración**: Interfaz administrativa con layout dedicado
- **Base de Datos Local**: Persistencia con IndexedDB (Dexie)

## Uso Básico

### Para Usuarios (Sin Login)

1. **Ver turnos disponibles**: Al entrar a la página principal (`/`), se muestran todos los turnos activos con su fecha, horario y cupo restante
2. **Reservar un turno**:
   - Hacer clic en el botón "Reservar" de un turno disponible
   - Completar el formulario con nombre completo y carnet de identidad
   - Confirmar la reserva
   - El sistema valida el cupo disponible y crea la reserva

### Para Administradores

1. **Acceder al panel admin**:
   - Hacer clic en "Login Administrador" desde la página principal
   - Iniciar sesión con las credenciales de administrador
   - Serás redirigido al panel de administración

2. **Gestionar Turnos** (`/admin/turnos`):
   - Ver todos los turnos (activos e inactivos)
   - Crear nuevos turnos con fecha, horario y capacidad
   - Editar turnos existentes
   - Activar/Desactivar turnos

3. **Gestionar Reservas** (`/admin/reservas`):
   - Ver todas las reservas realizadas
   - Filtrar por estado (confirmadas/canceladas)
   - Cancelar reservas si es necesario

## Usuario por Defecto (IndexedDB)

El sistema crea automáticamente un usuario administrador en la base de datos local (IndexedDB) al iniciar por primera vez:

| Campo | Valor |
|-------|-------|
| **Email** | `admin@admin.com` |
| **Contraseña** | `admin123` |
| **Rol** | `admin` |

La base de datos se inicializa con el método `seedDefaultAdmin()` que verifica si el usuario ya existe antes de crearlo.

## Roles del Proyecto

El sistema maneja dos roles de usuario:

### 1. **admin** (Administrador)
- Acceso completo al panel de administración (`/admin/*`)
- Puede gestionar turnos (crear, editar, activar/desactivar)
- Puede gestionar reservas (ver, cancelar)
- Acceso protegido por el componente `<RequireAuth>`

### 2. **user** (Usuario Regular)
- Acceso solo a la página principal para ver turnos disponibles
- Puede realizar reservas proporcionando sus datos
- No requiere autenticación para reservar
- No tiene acceso al panel de administración

### Estructura de Usuario (IndexedDB)

```typescript
interface Usuario {
  id?: number;
  email: string;
  passwordHash: string;    // btoa encoded
  rol: "admin" | "user";
}
```

La autenticación se persiste en `localStorage` con la clave `turnero_auth`, permitiendo que la sesión se mantenga al recargar la página.

## Rutas Principales

- `/` - Página principal
- `/login` - Inicio de sesión
- `/admin/turnos` - Gestión de turnos (protegido)
- `/admin/reservas` - Gestión de reservas (protegido)

## Notas

- El proyecto usa `bun-plugin-tailwind` para procesar Tailwind CSS automáticamente
- La base de datos corre del lado del cliente con Dexie (IndexedDB)
- El servidor Bun soporta WebSockets para comunicación en tiempo real
- Los componentes de UI están basados en Radix UI con estilos de shadcn/ui

## Licencia

Proyecto académico - Programación Web 2
