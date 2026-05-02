
### 1. Arquitectura de Persistencia (Offline-First)

Una de las restricciones más críticas es la **prohibición de servidores externos**.

- **Almacenamiento:** Se debe usar **IndexedDB** (recomendado por su capacidad y consultas por índices) o **localStorage**.
    
- **Librerías sugeridas:** Se permite el uso de **Dexie.js** para facilitar el manejo de IndexedDB de forma reactiva mediante el hook `useLiveQuery`.
    
- **Modelo de Datos:** El sistema debe manejar al menos tres colecciones: `turnos`, `reservas` y `usuarios`.

### 2. Estructura de Navegación y Rutas

El sistema requiere el uso de **React Router DOM** para gestionar tres entornos principales:

|**Tipo de Ruta**|**Path**|**Componente/Layout**|**Propósito**|
|---|---|---|---|
|**Pública**|`/`|`PublicLayout`|Visualización y reserva de turnos por clientes.|
|**Pública**|`/login`|`PublicLayout`|Acceso para el administrador.|
|**Protegida**|`/admin`|`AdminLayout`|Panel principal (requiere autenticación).|
|**Anidada**|`/admin/turnos`|`CRUDTurnos`|Gestión de altas, bajas y cambios de turnos.|
|**Anidada**|`/admin/reservas`|`ListadoReservas`|Gestión y cancelación de reservas de clientes.|

### 3. Lógica de Negocio y Custom Hooks

El examen exige una separación clara entre la interfaz y la lógica mediante **Custom Hooks obligatorios**:

- **`useStorage`:** Centraliza las operaciones CRUD en la base de datos local.
    
- **`useAuth`:** Provee el estado de autenticación (usuario, token ficticio, funciones de login/logout).
    
- **`useTurnos`:** Valida reglas de negocio, como evitar el solapamiento de horarios al crear turnos y calcular cupos disponibles.
    
- **`useReservas`:** Gestiona la creación de reservas verificando disponibilidad y su posterior cancelación.
    

### 4. Gestión del Estado Global

Se debe implementar un **`AuthContext`** que envuelva la aplicación.

- **Persistencia de sesión:** El estado de `isAuthenticated` debe mantenerse incluso al recargar la página, apoyándose en `localStorage` o `sessionStorage`.
    
- **Protección de rutas:** Un componente guardián debe verificar el contexto de autenticación; si el usuario no está logueado, debe usar `useNavigate` para redirigirlo al login.
    

### 5. Criterios Clave de Evaluación

Para obtener una calificación positiva, el estudiante debe asegurar:

- **Validaciones estrictas:** No permitir reservas si el cupo está lleno ni crear turnos que choquen en horario.
    
- **Organización:** Código dividido en componentes funcionales, layouts y componentes reutilizables (Modales, Tablas, Formularios).
    
- **Uso de Hooks:** Aplicación correcta de `useState`, `useEffect` para carga inicial y hooks de navegación.