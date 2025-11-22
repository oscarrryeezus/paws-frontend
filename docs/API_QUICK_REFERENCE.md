# Guía Rápida de API - PAWS Backend

## Base URL

```
http://localhost:3000
```

## Autenticación

Todos los endpoints excepto registro y login requieren token JWT:

```
Authorization: Bearer {token}
```

---

## Flujo de Autenticación

### 1. Registrar → 2. Verificar Email → 3. Verificar OTP → 4. Login

```javascript
// 1. REGISTRAR
POST /usuarios/registrar
{
  "str_nombre": "Juan Pérez",
  "str_correo": "juan@ejemplo.com",
  "str_pass": "Password123!"
}

// 2. VERIFICAR EMAIL (código del correo)
POST /usuarios/verificar-email
{
  "email": "juan@ejemplo.com",
  "codigo": "123456"
}

// 3. VERIFICAR OTP (código del authenticator)
POST /usuarios/verificar-otp
{
  "str_correo": "juan@ejemplo.com",
  "codigo_otp": "275847"
}

// 4. LOGIN (obtener token)
POST /login
{
  "str_correo": "juan@ejemplo.com",
  "str_pass": "Password123!",
  "codigo_otp": "123456"
}
// Respuesta: { token: "eyJhbGc..." }
```

---

## Endpoints por Módulo

### 🔐 Sin Autenticación

| Método | Endpoint                    | Descripción            |
| ------ | --------------------------- | ---------------------- |
| POST   | `/usuarios/registrar`       | Iniciar registro       |
| POST   | `/usuarios/verificar-email` | Verificar código email |
| POST   | `/usuarios/verificar-otp`   | Completar registro     |
| POST   | `/login`                    | Iniciar sesión         |
| POST   | `/ping`                     | Health check           |

### 📦 Productos (Requiere Token)

| Método | Endpoint                   | Body                                             | Descripción       |
| ------ | -------------------------- | ------------------------------------------------ | ----------------- |
| POST   | `/productos/registrar`     | `{ str_codigo, str_nombre, str_categoria, ... }` | Crear producto    |
| POST   | `/productos/listar`        | `{ bool_activo?: true }`                         | Listar todos      |
| POST   | `/productos/obtener`       | `{ str_codigo: "MOU123" }`                       | Obtener uno       |
| PUT    | `/productos/actualizar`    | `{ str_codigo, ...campos }`                      | Actualizar        |
| POST   | `/productos/eliminar`      | `{ str_codigo }`                                 | Eliminar (lógico) |
| POST   | `/productos/por-categoria` | `{ str_categoria }`                              | Filtrar categoría |
| POST   | `/productos/bajo-stock`    | `{}`                                             | Stock < mínimo    |
| POST   | `/productos/entrada`       | `{ str_codigo, cantidad }`                       | Aumentar stock    |
| POST   | `/productos/salida`        | `{ str_codigo, cantidad }`                       | Disminuir stock   |

### 📊 Movimientos (Requiere Token)

| Método | Endpoint                 | Body                                                  | Descripción        |
| ------ | ------------------------ | ----------------------------------------------------- | ------------------ |
| POST   | `/movimientos/entradas`  | `{ id_producto, int_cantidad, str_responsable, ... }` | Registrar entrada  |
| POST   | `/movimientos/salidas`   | `{ id_producto, int_cantidad, str_responsable, ... }` | Registrar salida   |
| POST   | `/movimientos/historial` | `{ fecha_inicio, fecha_fin, str_tipo? }`              | Historial filtrado |
| POST   | `/movimientos/resumen`   | `{ fecha_inicio, fecha_fin }`                         | Resumen período    |
| POST   | `/movimientos/producto`  | `{ id_producto }`                                     | Por producto       |
| POST   | `/movimientos/stock`     | `{}`                                                  | Stock actual todos |

### 🏢 Proveedores (Requiere Token)

| Método | Endpoint                  | Body                                           | Descripción       |
| ------ | ------------------------- | ---------------------------------------------- | ----------------- |
| POST   | `/proveedores/crear`      | `{ str_nombre, str_telefono, str_email, ... }` | Crear proveedor   |
| POST   | `/proveedores/listar`     | `{ bool_activo?: true }`                       | Listar todos      |
| POST   | `/proveedores/obtener`    | `{ id_proveedor }`                             | Obtener uno       |
| POST   | `/proveedores/actualizar` | `{ id_proveedor, ...campos }`                  | Actualizar        |
| POST   | `/proveedores/eliminar`   | `{ id_proveedor }`                             | Eliminar (lógico) |
| POST   | `/proveedores/reactivar`  | `{ id_proveedor }`                             | Reactivar         |

### 👥 Clientes (Requiere Token)

| Método | Endpoint               | Body                                           | Descripción       |
| ------ | ---------------------- | ---------------------------------------------- | ----------------- |
| POST   | `/clientes/crear`      | `{ str_nombre, str_telefono, str_email, ... }` | Crear cliente     |
| POST   | `/clientes/listar`     | `{ bool_activo?: true }`                       | Listar todos      |
| POST   | `/clientes/obtener`    | `{ id_cliente }`                               | Obtener uno       |
| POST   | `/clientes/actualizar` | `{ id_cliente, ...campos }`                    | Actualizar        |
| POST   | `/clientes/eliminar`   | `{ id_cliente }`                               | Eliminar (lógico) |
| POST   | `/clientes/reactivar`  | `{ id_cliente }`                               | Reactivar         |
| POST   | `/clientes/activos`    | `{}`                                           | Solo activos      |

---

## Códigos de Respuesta

| Código  | Significado  | Cuándo ocurre                         |
| ------- | ------------ | ------------------------------------- |
| **200** | OK           | Operación exitosa                     |
| **201** | Created      | Recurso creado                        |
| **400** | Bad Request  | Validación fallida, datos incorrectos |
| **401** | Unauthorized | Sin token, token inválido/expirado    |
| **403** | Forbidden    | Cuenta inactiva, sin permisos         |
| **404** | Not Found    | Recurso no existe                     |
| **500** | Server Error | Error interno                         |

---

## Formato de Respuestas

### ✅ Éxito

```json
{
  "success": true,
  "mensaje": "Operación exitosa",
  "data": { ... },
  "codigo": 0,
  "ok": true
}
```

### ❌ Error

```json
{
  "success": false,
  "error": "Descripción del error",
  "codigo": 1,
  "ok": false
}
```

### 🔒 Error de Autenticación

```json
{
  "codigo": 1,
  "error": "Token expirado",
  "mensaje": "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
}
```

---

## Ejemplos de Uso

### JavaScript (Fetch)

```javascript
// 1. Login
const loginResponse = await fetch("http://localhost:3000/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    str_correo: "usuario@ejemplo.com",
    str_pass: "password",
    codigo_otp: "123456",
  }),
});
const { token } = await loginResponse.json();

// 2. Usar token en peticiones
const productos = await fetch("http://localhost:3000/productos/listar", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({}),
});
const data = await productos.json();
```

### Axios

```javascript
// Configurar interceptor global
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Usar
const { data } = await axios.post("/productos/listar", {});
```

### cURL

```bash
# Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"str_correo":"usuario@ejemplo.com","str_pass":"pass","codigo_otp":"123456"}'

# Usar endpoint protegido
curl -X POST http://localhost:3000/productos/listar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{}'
```

---

## Validaciones Importantes

### Productos

- `str_codigo`: Único, requerido
- `int_stock_minimo`: >= 0
- `int_stock_actual`: >= 0
- No se puede tener stock negativo

### Movimientos

- `int_cantidad`: > 0
- Para SALIDA: cantidad <= stock_actual
- `str_responsable`: Requerido

### Proveedores/Clientes

- `str_email`: Formato válido
- `str_telefono`: Opcional pero recomendado
- Eliminación es lógica (bool_activo = false)

---

## Testing

### Swagger UI

```
http://localhost:3000/docs
```

1. Hacer login desde Postman/cURL
2. Copiar el token
3. En Swagger, clic en "Authorize"
4. Pegar: `Bearer {token}`
5. Probar endpoints

### Postman

Importar desde Swagger JSON:

```
http://localhost:3000/docs/swagger.json
```

---

## Errores Comunes

### 401 - Token expirado

**Solución:** Hacer login nuevamente (token expira en 5 min)

### 400 - Stock insuficiente

**Respuesta:**

```json
{
  "error": "Stock insuficiente",
  "detalles": {
    "stock_actual": 2,
    "cantidad_solicitada": 5
  }
}
```

### 404 - Producto no encontrado

**Solución:** Verificar que `str_codigo` sea correcto

### 401 - Token no proporcionado

**Solución:** Agregar header `Authorization: Bearer {token}`

---

## Notas del Backend

- **Expiración de Token:** 5 minutos
- **Encoding:** UTF-8
- **Fechas:** ISO 8601
- **Eliminaciones:** Lógicas (bool_activo = false)
- **Validación:** Joi schemas en todos los endpoints
- **CORS:** Habilitado para todos los orígenes

---

## Contacto

- **Swagger Docs:** http://localhost:3000/docs
- **Health Check:** http://localhost:3000/ping
- **Documentación Completa:** Ver `API_ENDPOINTS.md`

---

**Versión:** 1.0  
**Última actualización:** 2025-11-04
