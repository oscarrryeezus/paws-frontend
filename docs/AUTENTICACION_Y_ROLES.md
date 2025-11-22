# Sistema de Autenticación y Roles

## Resumen

Se ha implementado un sistema completo de autenticación basado en JWT (JSON Web Tokens) para proteger todos los endpoints de productos, movimientos, proveedores y clientes.

## Middlewares Disponibles

### 1. `auth` - Autenticación Básica

Middleware que verifica que el usuario tenga un token JWT válido y que su cuenta esté activa.

**Uso:**

```javascript
const { auth } = require("../middlewares/auth");

router.post("/ruta-protegida", auth, controller.metodo);
```

**Qué verifica:**

- Token presente en header Authorization
- Token válido y no expirado
- Usuario existe en la base de datos
- Cuenta del usuario está activa (bool_activo = true)

**Respuestas de error:**

- 401: Token no proporcionado, inválido o expirado
- 403: Cuenta inactiva

### 2. `authRole` - Autenticación con Roles

Middleware que además de verificar la autenticación, valida que el usuario tenga un rol específico.

**Uso:**

```javascript
const { auth, authRole } = require("../middlewares/auth");

// Solo permite usuarios con rol 1 o 2
router.post("/admin-only", auth, authRole([1, 2]), controller.metodo);
```

**Parámetros:**

- `rolesPermitidos`: Array de roles permitidos (ej: [1, 2, 3])

**Nota:** Este middleware debe usarse DESPUÉS del middleware `auth`.

### 3. `authOptional` - Autenticación Opcional

Middleware que permite acceso sin token, pero agrega información del usuario si el token está presente.

**Uso:**

```javascript
const { authOptional } = require("../middlewares/auth");

router.post("/ruta-publica", authOptional, controller.metodo);
```

**Útil para:** Endpoints que funcionan con o sin autenticación (ej: catálogos públicos con precios diferentes para usuarios registrados).

## Rutas Protegidas

### Todas las rutas de los siguientes módulos requieren autenticación:

1. **Productos** (`/productos/*`)

   - Registrar producto
   - Listar productos
   - Obtener producto
   - Actualizar producto
   - Eliminar producto
   - Productos por categoría
   - Productos con bajo stock
   - Entrada de stock
   - Salida de stock

2. **Movimientos** (`/movimientos/*`)

   - Registrar entradas
   - Registrar salidas
   - Obtener historial
   - Obtener resumen
   - Movimientos por producto
   - Stock actual

3. **Proveedores** (`/proveedores/*`)

   - Crear proveedor
   - Listar proveedores
   - Obtener proveedor
   - Actualizar proveedor
   - Eliminar proveedor
   - Reactivar proveedor

4. **Clientes** (`/clientes/*`)
   - Crear cliente
   - Listar clientes
   - Obtener cliente
   - Actualizar cliente
   - Eliminar cliente
   - Reactivar cliente
   - Obtener clientes activos

## Cómo Usar desde el Frontend/Cliente

### 1. Obtener el Token (Login)

**Endpoint:** `POST /login`

**Request:**

```json
{
  "str_correo": "usuario@ejemplo.com",
  "str_pass": "contraseña123",
  "codigo_otp": "123456"
}
```

**Response:**

```json
{
  "mensaje": "Codigo correcto",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "correo": "usuario@ejemplo.com",
    "nombre": "Usuario Ejemplo"
  },
  "codigo": 0,
  "Expiracion": "5 min 0 seg",
  "ok": true
}
```

### 2. Usar el Token en Peticiones Posteriores

**Header requerido:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ejemplo con fetch (JavaScript):**

```javascript
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

fetch("http://localhost:3000/productos/listar", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({}),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

**Ejemplo con Axios:**

```javascript
const token = localStorage.getItem("token");

axios
  .post(
    "http://localhost:3000/productos/listar",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  .then((response) => console.log(response.data));
```

**Ejemplo con curl:**

```bash
curl -X POST http://localhost:3000/productos/listar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{}'
```

### 3. Manejo de Errores de Autenticación

**Token expirado (401):**

```json
{
  "codigo": 1,
  "error": "Token expirado",
  "mensaje": "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
}
```

**Acción recomendada:** Redirigir al usuario a la página de login.

**Token inválido (401):**

```json
{
  "codigo": 1,
  "error": "Token inválido",
  "mensaje": "El token proporcionado no es válido."
}
```

**Cuenta inactiva (403):**

```json
{
  "codigo": 1,
  "error": "Cuenta inactiva",
  "mensaje": "Tu cuenta ha sido desactivada. Contacta al administrador."
}
```

**Sin token (401):**

```json
{
  "codigo": 1,
  "error": "Acceso denegado. Token requerido.",
  "mensaje": "Debes iniciar sesión para acceder a este recurso"
}
```

## Sistema de Roles (Preparado para Futuro)

El sistema ya está preparado para trabajar con roles. El campo `int_rol` en la tabla `usuario` define el nivel de acceso.

### Roles Sugeridos

```javascript
const ROLES = {
  ADMINISTRADOR: 1,
  GERENTE: 2,
  EMPLEADO: 3,
  CLIENTE: 4,
};
```

### Ejemplo de Uso con Roles

```javascript
// Solo administradores y gerentes pueden eliminar productos
router.post(
  "/eliminar",
  auth, // Primero verifica autenticación
  authRole([1, 2]), // Luego verifica roles 1 y 2
  productoController.eliminarProducto
);

// Solo administradores
router.post("/admin-panel", auth, authRole([1]), adminController.panel);
```

### Información del Usuario en el Controller

Dentro de cualquier controller protegido con `auth`, puedes acceder a:

```javascript
exports.miMetodo = async (req, res) => {
  // Información del usuario autenticado
  const usuarioId = req.user.id;
  const usuarioCorreo = req.user.correo;
  const usuarioRol = req.user.rol;
  const usuarioNombre = req.user.nombre;

  console.log(
    `Usuario ${usuarioNombre} (ID: ${usuarioId}, Rol: ${usuarioRol})`
  );

  // Tu lógica aquí...
};
```

## Testing en Swagger

Swagger ahora incluye soporte para autenticación JWT.

### Pasos para probar en Swagger UI:

1. Ve a `http://localhost:3000/docs`
2. Haz login desde Postman/Thunder Client y copia el token
3. En Swagger, haz clic en el botón **"Authorize"** (candado) arriba a la derecha
4. Ingresa: `Bearer {tu_token_aquí}`
5. Haz clic en "Authorize"
6. Ahora puedes probar los endpoints protegidos

**Ejemplo:**

```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUsImNvcnJlbyI6InN0dXBlZmllZGV1bGVyMEBqdXN0emV1cy5jb20iLCJyb2wiOjEsImlhdCI6MTc2MjI3OTY4NiwiZXhwIjoxNzYyMjc5OTg2fQ.7IZ2iUjiRMEFGVutTO6U13vI4t8ENzbAU-PegEzXqFA
```

## Buenas Prácticas

### Frontend

1. **Almacenar el token de forma segura:**

   ```javascript
   // localStorage (simple pero menos seguro)
   localStorage.setItem("token", token);

   // O mejor: sessionStorage (se borra al cerrar el navegador)
   sessionStorage.setItem("token", token);
   ```

2. **Interceptor global (Axios):**

   ```javascript
   axios.interceptors.request.use(
     (config) => {
       const token = localStorage.getItem("token");
       if (token) {
         config.headers.Authorization = `Bearer ${token}`;
       }
       return config;
     },
     (error) => Promise.reject(error)
   );

   // Interceptor de respuestas para manejar 401
   axios.interceptors.response.use(
     (response) => response,
     (error) => {
       if (error.response?.status === 401) {
         localStorage.removeItem("token");
         window.location.href = "/login";
       }
       return Promise.reject(error);
     }
   );
   ```

3. **Renovar token antes de expirar:**
   ```javascript
   // El token expira en 5 minutos
   // Renovar a los 4 minutos
   setInterval(() => {
     renewToken();
   }, 4 * 60 * 1000);
   ```

### Backend

1. **No confiar solo en el token:** Siempre verificar que el usuario existe y está activo (ya implementado).

2. **Logging de accesos:**

   ```javascript
   console.log(
     `[${new Date().toISOString()}] Usuario ${req.user.id} accedió a ${
       req.path
     }`
   );
   ```

3. **Rate limiting:** Considerar agregar `express-rate-limit` para prevenir abuso.

## Migración/Actualización

Si ya tienes un frontend funcionando, solo necesitas:

1. Guardar el token después del login
2. Agregar el header `Authorization` a todas las peticiones a productos, movimientos, proveedores y clientes
3. Manejar errores 401/403 redirigiendo al login

## Soporte

Para dudas o problemas:

- Revisa los logs del servidor
- Verifica que el token no haya expirado (5 minutos)
- Asegúrate de incluir "Bearer " antes del token
- Verifica que la cuenta esté activa en la base de datos

---

**Última actualización:** 2025-11-04
**Versión:** 1.0
