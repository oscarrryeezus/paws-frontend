# Documentación de API - PAWS Backend

## Información General

**Base URL:** `http://localhost:3000`  
**Formato:** JSON  
**Autenticación:** Bearer Token (JWT)  
**Expiración del Token:** 5 minutos

---

## Índice

1. [Autenticación](#autenticación)
   - [Registro de Usuario](#registro-de-usuario)
   - [Verificar Email](#verificar-email)
   - [Verificar OTP](#verificar-otp)
   - [Login](#login)
2. [Productos](#productos)
3. [Movimientos](#movimientos)
4. [Proveedores](#proveedores)
5. [Clientes](#clientes)
6. [Códigos de Respuesta](#códigos-de-respuesta)

---

## Autenticación

### Registro de Usuario

Inicia el proceso de registro enviando un código de verificación al email.

**Endpoint:** `POST /usuarios/registrar`  
**Autenticación:** No requerida

#### Request Body

```json
{
  "str_nombre": "Juan Pérez",
  "str_correo": "juan@ejemplo.com",
  "str_pass": "MiPassword123!"
}
```

#### Respuesta Exitosa (200)

```json
{
  "mensaje": "Registro iniciado exitosamente. Revisa tu correo electrónico para obtener el código de verificación de 6 dígitos.",
  "correo": "juan@ejemplo.com",
  "siguiente_paso": "Usar el endpoint /usuarios/verificar-email con tu email y el código de 6 dígitos",
  "tiempo_expiracion": "15 minutos"
}
```

#### Respuestas de Error

**400 - Email duplicado:**

```json
{
  "error": "El email ya está registrado"
}
```

**400 - Validación:**

```json
{
  "error": "\"str_nombre\" es requerido"
}
```

---

### Verificar Email

Valida el código de 6 dígitos enviado por email y genera la configuración OTP.

**Endpoint:** `POST /usuarios/verificar-email`  
**Autenticación:** No requerida

#### Request Body

```json
{
  "email": "juan@ejemplo.com",
  "codigo": "123456"
}
```

#### Respuesta Exitosa (200)

```json
{
  "mensaje": "¡Email verificado exitosamente! Ahora configura tu autenticación de dos factores (2FA).",
  "correo": "juan@ejemplo.com",
  "configuracion_otp": {
    "codigo_manual": "JRCXG22RENECUNTBMNQTQ6CRJFDXM32ANN6T44SIJFGHOUTBJM2A",
    "url_configuracion": "otpauth://totp/PAWS%20-%20Juan%20P%C3%A9rez:juan@ejemplo.com?secret=JRCXG22...&issuer=PAWS%20Backend",
    "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANS...",
    "instrucciones": "Escanea el código QR con Google Authenticator o Microsoft Authenticator...",
    "tiempo_expiracion": "15 minutos"
  },
  "siguiente_paso": "Usar el endpoint /usuarios/verificar-otp con tu email y el código de 6 dígitos del authenticator"
}
```

#### Respuestas de Error

**400 - Código incorrecto:**

```json
{
  "error": "Código incorrecto",
  "intentos_restantes": 2
}
```

**404 - Registro no encontrado:**

```json
{
  "error": "No se encontró un registro pendiente para este email o ha expirado"
}
```

---

### Verificar OTP

Completa el registro validando el código del authenticator.

**Endpoint:** `POST /usuarios/verificar-otp`  
**Autenticación:** No requerida

#### Request Body

```json
{
  "str_correo": "juan@ejemplo.com",
  "codigo_otp": "275847"
}
```

#### Respuesta Exitosa (200)

```json
{
  "mensaje": "¡Registro completado exitosamente! Tu cuenta está activa y lista para usar.",
  "usuario": {
    "id": 25,
    "nombre": "Juan Pérez",
    "correo": "juan@ejemplo.com",
    "activo": true,
    "otp_habilitado": true,
    "pin_habilitado": true
  },
  "pin": {
    "codigo": "243701",
    "expira_en": "15 días",
    "fecha_expiracion": "2025-11-19T17:23:44.330Z",
    "uso_unico": true,
    "advertencia": "Este PIN es de un solo uso. Guárdalo en un lugar seguro."
  },
  "almacenamiento_offline": {
    "datos": {
      "encrypted_data": "78a13d7fc0e95308dcf8299541786a98...",
      "iv": "a8e9fffa7e35f7ba932f0b0c84eccafe",
      "token": "166cebc96879da8e3c9d792f9be39f7f..."
    },
    "instrucciones": [
      "Guarda estos datos en secure storage o IndexedDB local",
      "El PIN se borrará automáticamente después de usarse",
      "Estos datos son necesarios para uso offline"
    ]
  }
}
```

#### Respuestas de Error

**400 - Código OTP inválido:**

```json
{
  "error": "Código OTP inválido o expirado"
}
```

**400 - Email no verificado:**

```json
{
  "error": "Debes verificar tu email primero usando el código de 6 dígitos. Usa el endpoint /usuarios/verificar-email."
}
```

---

### Login

Inicia sesión con email, contraseña y código OTP del authenticator.

**Endpoint:** `POST /login`  
**Autenticación:** No requerida

#### Request Body

```json
{
  "str_correo": "juan@ejemplo.com",
  "str_pass": "MiPassword123!",
  "codigo_otp": "123456"
}
```

#### Respuesta Exitosa (200)

```json
{
  "mensaje": "Codigo correcto",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUsImNvcnJlbyI6Imp1YW5AZWplbXBsby5jb20iLCJyb2wiOjEsImlhdCI6MTc2MjI3OTY4NiwiZXhwIjoxNzYyMjc5OTg2fQ.7IZ2iUjiRMEFGVutTO6U13vI4t8ENzbAU-PegEzXqFA",
  "user": {
    "correo": "juan@ejemplo.com",
    "nombre": "Juan Pérez"
  },
  "codigo": 0,
  "Expiracion": "5 min 0 seg",
  "ok": true
}
```

#### Respuestas de Error

**401 - Credenciales incorrectas:**

```json
{
  "error": "Credenciales incorrectas",
  "codigo": 1,
  "ok": false
}
```

**401 - Código OTP inválido:**

```json
{
  "error": "Código OTP inválido",
  "codigo": 1,
  "ok": false
}
```

**403 - Cuenta inactiva:**

```json
{
  "error": "Tu cuenta está inactiva. Contacta al administrador.",
  "codigo": 1,
  "ok": false
}
```

---

## Productos

**Base:** `/productos`  
**Autenticación:** Requerida (Bearer Token)

### Headers Requeridos

```
Authorization: Bearer {token}
Content-Type: application/json
```

---

### Registrar Producto

**Endpoint:** `POST /productos/registrar`

#### Request Body

```json
{
  "str_codigo": "MOU123",
  "str_nombre": "Mouse Gamer RGB",
  "str_descripcion": "Mouse ergonómico con luces RGB, 7200 DPI",
  "str_categoria": "Periféricos",
  "str_unidad": "pieza",
  "int_stock_minimo": 5,
  "int_stock_actual": 20,
  "bool_activo": true
}
```

#### Respuesta Exitosa (201)

```json
{
  "success": true,
  "mensaje": "Producto registrado exitosamente",
  "data": {
    "id_producto": 1,
    "str_codigo": "MOU123",
    "str_nombre": "Mouse Gamer RGB",
    "str_descripcion": "Mouse ergonómico con luces RGB, 7200 DPI",
    "str_categoria": "Periféricos",
    "str_unidad": "pieza",
    "int_stock_minimo": 5,
    "int_stock_actual": 20,
    "bool_activo": true,
    "dt_creacion": "2025-11-04T18:30:00.000Z"
  }
}
```

#### Respuestas de Error

**400 - Código duplicado:**

```json
{
  "success": false,
  "error": "El código de producto ya existe"
}
```

**401 - No autenticado:**

```json
{
  "codigo": 1,
  "error": "Acceso denegado. Token requerido.",
  "mensaje": "Debes iniciar sesión para acceder a este recurso"
}
```

**401 - Token expirado:**

```json
{
  "codigo": 1,
  "error": "Token expirado",
  "mensaje": "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
}
```

---

### Listar Productos

**Endpoint:** `POST /productos/listar`

#### Request Body (Opcional - Filtros)

```json
{
  "bool_activo": true
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": [
    {
      "id_producto": 1,
      "str_codigo": "MOU123",
      "str_nombre": "Mouse Gamer RGB",
      "str_descripcion": "Mouse ergonómico con luces RGB, 7200 DPI",
      "str_categoria": "Periféricos",
      "str_unidad": "pieza",
      "int_stock_minimo": 5,
      "int_stock_actual": 20,
      "bool_activo": true,
      "dt_creacion": "2025-11-04T18:30:00.000Z"
    },
    {
      "id_producto": 2,
      "str_codigo": "TEC456",
      "str_nombre": "Teclado Mecánico",
      "str_categoria": "Periféricos",
      "int_stock_actual": 15,
      "bool_activo": true
    }
  ]
}
```

---

### Obtener Producto por Código

**Endpoint:** `POST /productos/obtener`

#### Request Body

```json
{
  "str_codigo": "MOU123"
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "id_producto": 1,
    "str_codigo": "MOU123",
    "str_nombre": "Mouse Gamer RGB",
    "str_descripcion": "Mouse ergonómico con luces RGB, 7200 DPI",
    "str_categoria": "Periféricos",
    "str_unidad": "pieza",
    "int_stock_minimo": 5,
    "int_stock_actual": 20,
    "bool_activo": true,
    "dt_creacion": "2025-11-04T18:30:00.000Z"
  }
}
```

#### Respuestas de Error

**404 - No encontrado:**

```json
{
  "success": false,
  "error": "Producto no encontrado"
}
```

---

### Actualizar Producto

**Endpoint:** `PUT /productos/actualizar`

#### Request Body

```json
{
  "str_codigo": "MOU123",
  "str_nombre": "Mouse Gamer Pro RGB",
  "str_descripcion": "Mouse ergonómico actualizado",
  "int_stock_minimo": 10
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "mensaje": "Producto actualizado exitosamente",
  "data": {
    "id_producto": 1,
    "str_codigo": "MOU123",
    "str_nombre": "Mouse Gamer Pro RGB",
    "str_descripcion": "Mouse ergonómico actualizado",
    "int_stock_minimo": 10,
    "int_stock_actual": 20
  }
}
```

---

### Eliminar Producto (Lógico)

**Endpoint:** `POST /productos/eliminar`

#### Request Body

```json
{
  "str_codigo": "MOU123"
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "mensaje": "Producto eliminado lógicamente",
  "data": {
    "str_codigo": "MOU123",
    "bool_activo": false
  }
}
```

---

### Productos por Categoría

**Endpoint:** `POST /productos/por-categoria`

#### Request Body

```json
{
  "str_categoria": "Periféricos"
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": [
    {
      "id_producto": 1,
      "str_codigo": "MOU123",
      "str_nombre": "Mouse Gamer RGB",
      "str_categoria": "Periféricos",
      "int_stock_actual": 20
    },
    {
      "id_producto": 2,
      "str_codigo": "TEC456",
      "str_nombre": "Teclado Mecánico",
      "str_categoria": "Periféricos",
      "int_stock_actual": 15
    }
  ]
}
```

---

### Productos con Bajo Stock

**Endpoint:** `POST /productos/bajo-stock`

#### Request Body

```json
{}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": [
    {
      "id_producto": 3,
      "str_codigo": "CAB789",
      "str_nombre": "Cable HDMI",
      "int_stock_actual": 3,
      "int_stock_minimo": 10,
      "diferencia": -7
    }
  ],
  "total_productos_bajo_stock": 1
}
```

---

### Entrada de Stock

**Endpoint:** `POST /productos/entrada`

#### Request Body

```json
{
  "str_codigo": "MOU123",
  "cantidad": 10
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "mensaje": "Stock aumentado exitosamente",
  "data": {
    "str_codigo": "MOU123",
    "stock_anterior": 20,
    "cantidad_agregada": 10,
    "stock_actual": 30
  }
}
```

---

### Salida de Stock

**Endpoint:** `POST /productos/salida`

#### Request Body

```json
{
  "str_codigo": "MOU123",
  "cantidad": 5
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "mensaje": "Stock disminuido exitosamente",
  "data": {
    "str_codigo": "MOU123",
    "stock_anterior": 30,
    "cantidad_retirada": 5,
    "stock_actual": 25
  }
}
```

#### Respuestas de Error

**400 - Stock insuficiente:**

```json
{
  "success": false,
  "error": "Stock insuficiente",
  "detalles": {
    "stock_actual": 2,
    "cantidad_solicitada": 5,
    "faltante": 3
  }
}
```

---

## Movimientos

**Base:** `/movimientos`  
**Autenticación:** Requerida (Bearer Token)

---

### Registrar Entrada

**Endpoint:** `POST /movimientos/entradas`

#### Request Body

```json
{
  "id_producto": 1,
  "int_cantidad": 100,
  "str_referencia_documento": "FAC-001",
  "str_responsable": "Juan Pérez",
  "str_observaciones": "Compra a proveedor principal"
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "mensaje": "Entrada registrada exitosamente",
  "data": {
    "id_movimiento": 1,
    "id_producto": 1,
    "str_tipo": "ENTRADA",
    "int_cantidad": 100,
    "str_referencia_documento": "FAC-001",
    "str_responsable": "Juan Pérez",
    "dt_movimiento": "2025-11-04T18:45:00.000Z",
    "stock_anterior": 20,
    "stock_actual": 120
  }
}
```

---

### Registrar Salida

**Endpoint:** `POST /movimientos/salidas`

#### Request Body

```json
{
  "id_producto": 1,
  "int_cantidad": 50,
  "str_referencia_documento": "VTA-001",
  "str_responsable": "María García",
  "str_observaciones": "Venta a cliente corporativo"
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "mensaje": "Salida registrada exitosamente",
  "data": {
    "id_movimiento": 2,
    "id_producto": 1,
    "str_tipo": "SALIDA",
    "int_cantidad": 50,
    "str_referencia_documento": "VTA-001",
    "str_responsable": "María García",
    "dt_movimiento": "2025-11-04T19:00:00.000Z",
    "stock_anterior": 120,
    "stock_actual": 70
  }
}
```

---

### Obtener Historial

**Endpoint:** `POST /movimientos/historial`

#### Request Body

```json
{
  "fecha_inicio": "2025-11-01",
  "fecha_fin": "2025-11-30",
  "str_tipo": "ENTRADA"
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": [
    {
      "id_movimiento": 1,
      "id_producto": 1,
      "producto_nombre": "Mouse Gamer RGB",
      "str_tipo": "ENTRADA",
      "int_cantidad": 100,
      "str_referencia_documento": "FAC-001",
      "str_responsable": "Juan Pérez",
      "dt_movimiento": "2025-11-04T18:45:00.000Z"
    }
  ],
  "total_movimientos": 1
}
```

---

### Obtener Resumen

**Endpoint:** `POST /movimientos/resumen`

#### Request Body

```json
{
  "fecha_inicio": "2025-11-01",
  "fecha_fin": "2025-11-30"
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "total_entradas": 100,
    "total_salidas": 50,
    "movimientos_por_tipo": {
      "ENTRADA": 1,
      "SALIDA": 1
    },
    "variacion_neta": 50
  }
}
```

---

### Movimientos por Producto

**Endpoint:** `POST /movimientos/producto`

#### Request Body

```json
{
  "id_producto": 1
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "producto": {
      "id_producto": 1,
      "str_nombre": "Mouse Gamer RGB",
      "str_codigo": "MOU123"
    },
    "movimientos": [
      {
        "id_movimiento": 1,
        "str_tipo": "ENTRADA",
        "int_cantidad": 100,
        "dt_movimiento": "2025-11-04T18:45:00.000Z"
      },
      {
        "id_movimiento": 2,
        "str_tipo": "SALIDA",
        "int_cantidad": 50,
        "dt_movimiento": "2025-11-04T19:00:00.000Z"
      }
    ],
    "resumen": {
      "total_entradas": 100,
      "total_salidas": 50,
      "stock_actual": 70
    }
  }
}
```

---

### Stock Actual

**Endpoint:** `POST /movimientos/stock`

#### Request Body

```json
{}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": [
    {
      "id_producto": 1,
      "str_codigo": "MOU123",
      "str_nombre": "Mouse Gamer RGB",
      "int_stock_actual": 70,
      "int_stock_minimo": 5,
      "estado": "NORMAL"
    },
    {
      "id_producto": 3,
      "str_codigo": "CAB789",
      "str_nombre": "Cable HDMI",
      "int_stock_actual": 3,
      "int_stock_minimo": 10,
      "estado": "BAJO_STOCK"
    }
  ]
}
```

---

## Proveedores

**Base:** `/proveedores`  
**Autenticación:** Requerida (Bearer Token)

---

### Crear Proveedor

**Endpoint:** `POST /proveedores/crear`

#### Request Body

```json
{
  "str_nombre": "Proveedor General S.A.",
  "str_telefono": "+52 555-123-4567",
  "str_email": "ventas@proveedorgeneral.com",
  "str_contacto": "Carlos Ramírez",
  "str_direccion": "Av. Industrial #500, CDMX"
}
```

#### Respuesta Exitosa (201)

```json
{
  "success": true,
  "mensaje": "Proveedor creado exitosamente",
  "data": {
    "id_proveedor": 1,
    "str_nombre": "Proveedor General S.A.",
    "str_telefono": "+52 555-123-4567",
    "str_email": "ventas@proveedorgeneral.com",
    "str_contacto": "Carlos Ramírez",
    "str_direccion": "Av. Industrial #500, CDMX",
    "bool_activo": true,
    "dt_creacion": "2025-11-04T20:00:00.000Z"
  }
}
```

---

### Listar Proveedores

**Endpoint:** `POST /proveedores/listar`

#### Request Body (Opcional)

```json
{
  "bool_activo": true
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": [
    {
      "id_proveedor": 1,
      "str_nombre": "Proveedor General S.A.",
      "str_telefono": "+52 555-123-4567",
      "str_email": "ventas@proveedorgeneral.com",
      "bool_activo": true
    }
  ]
}
```

---

### Obtener Proveedor

**Endpoint:** `POST /proveedores/obtener`

#### Request Body

```json
{
  "id_proveedor": 1
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "id_proveedor": 1,
    "str_nombre": "Proveedor General S.A.",
    "str_telefono": "+52 555-123-4567",
    "str_email": "ventas@proveedorgeneral.com",
    "str_contacto": "Carlos Ramírez",
    "str_direccion": "Av. Industrial #500, CDMX",
    "bool_activo": true,
    "dt_creacion": "2025-11-04T20:00:00.000Z"
  }
}
```

---

### Actualizar Proveedor

**Endpoint:** `POST /proveedores/actualizar`

#### Request Body

```json
{
  "id_proveedor": 1,
  "str_telefono": "+52 555-999-8888",
  "str_email": "nuevoemail@proveedorgeneral.com"
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "mensaje": "Proveedor actualizado exitosamente",
  "data": {
    "id_proveedor": 1,
    "str_nombre": "Proveedor General S.A.",
    "str_telefono": "+52 555-999-8888",
    "str_email": "nuevoemail@proveedorgeneral.com"
  }
}
```

---

### Eliminar Proveedor (Lógico)

**Endpoint:** `POST /proveedores/eliminar`

#### Request Body

```json
{
  "id_proveedor": 1
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "mensaje": "Proveedor eliminado lógicamente",
  "data": {
    "id_proveedor": 1,
    "bool_activo": false
  }
}
```

---

### Reactivar Proveedor

**Endpoint:** `POST /proveedores/reactivar`

#### Request Body

```json
{
  "id_proveedor": 1
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "mensaje": "Proveedor reactivado exitosamente",
  "data": {
    "id_proveedor": 1,
    "bool_activo": true
  }
}
```

---

## Clientes

**Base:** `/clientes`  
**Autenticación:** Requerida (Bearer Token)

---

### Crear Cliente

**Endpoint:** `POST /clientes/crear`

#### Request Body

```json
{
  "str_nombre": "Cliente Corporativo S.A.",
  "str_telefono": "+52 555-111-2222",
  "str_email": "compras@clientecorporativo.com",
  "str_contacto": "Roberto Mendoza",
  "str_direccion": "Av. Empresarial #100, CDMX"
}
```

#### Respuesta Exitosa (201)

```json
{
  "success": true,
  "mensaje": "Cliente creado exitosamente",
  "data": {
    "id_cliente": 1,
    "str_nombre": "Cliente Corporativo S.A.",
    "str_telefono": "+52 555-111-2222",
    "str_email": "compras@clientecorporativo.com",
    "str_contacto": "Roberto Mendoza",
    "str_direccion": "Av. Empresarial #100, CDMX",
    "bool_activo": true,
    "dt_creacion": "2025-11-04T20:30:00.000Z"
  }
}
```

---

### Listar Clientes

**Endpoint:** `POST /clientes/listar`

#### Request Body (Opcional)

```json
{
  "bool_activo": true
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": [
    {
      "id_cliente": 1,
      "str_nombre": "Cliente Corporativo S.A.",
      "str_telefono": "+52 555-111-2222",
      "str_email": "compras@clientecorporativo.com",
      "bool_activo": true
    }
  ]
}
```

---

### Obtener Cliente

**Endpoint:** `POST /clientes/obtener`

#### Request Body

```json
{
  "id_cliente": 1
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": {
    "id_cliente": 1,
    "str_nombre": "Cliente Corporativo S.A.",
    "str_telefono": "+52 555-111-2222",
    "str_email": "compras@clientecorporativo.com",
    "str_contacto": "Roberto Mendoza",
    "str_direccion": "Av. Empresarial #100, CDMX",
    "bool_activo": true,
    "dt_creacion": "2025-11-04T20:30:00.000Z"
  }
}
```

---

### Actualizar Cliente

**Endpoint:** `POST /clientes/actualizar`

#### Request Body

```json
{
  "id_cliente": 1,
  "str_telefono": "+52 555-777-6666",
  "str_direccion": "Nueva dirección"
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "mensaje": "Cliente actualizado exitosamente",
  "data": {
    "id_cliente": 1,
    "str_nombre": "Cliente Corporativo S.A.",
    "str_telefono": "+52 555-777-6666",
    "str_direccion": "Nueva dirección"
  }
}
```

---

### Eliminar Cliente (Lógico)

**Endpoint:** `POST /clientes/eliminar`

#### Request Body

```json
{
  "id_cliente": 1
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "mensaje": "Cliente eliminado lógicamente",
  "data": {
    "id_cliente": 1,
    "bool_activo": false
  }
}
```

---

### Reactivar Cliente

**Endpoint:** `POST /clientes/reactivar`

#### Request Body

```json
{
  "id_cliente": 1
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "mensaje": "Cliente reactivado exitosamente",
  "data": {
    "id_cliente": 1,
    "bool_activo": true
  }
}
```

---

### Obtener Clientes Activos

**Endpoint:** `POST /clientes/activos`

#### Request Body

```json
{}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "data": [
    {
      "id_cliente": 1,
      "str_nombre": "Cliente Corporativo S.A.",
      "str_telefono": "+52 555-111-2222",
      "bool_activo": true
    }
  ],
  "total_clientes_activos": 1
}
```

---

## Códigos de Respuesta

### Códigos HTTP

| Código | Significado           | Descripción                             |
| ------ | --------------------- | --------------------------------------- |
| 200    | OK                    | Petición exitosa                        |
| 201    | Created               | Recurso creado exitosamente             |
| 400    | Bad Request           | Error de validación o datos incorrectos |
| 401    | Unauthorized          | No autenticado o token inválido         |
| 403    | Forbidden             | Sin permisos suficientes                |
| 404    | Not Found             | Recurso no encontrado                   |
| 500    | Internal Server Error | Error del servidor                      |

### Códigos de Negocio

En las respuestas exitosas:

```json
{
  "codigo": 0, // 0 = éxito
  "ok": true
}
```

En las respuestas de error:

```json
{
  "codigo": 1, // 1 = error
  "ok": false
}
```

---

## Notas Importantes

### Autenticación

1. **Obtener Token:** Primero hacer login en `/login`
2. **Usar Token:** Incluir en header `Authorization: Bearer {token}`
3. **Expiración:** El token expira en 5 minutos
4. **Renovación:** Hacer login nuevamente cuando expire

### Formato de Fechas

- **Entrada:** ISO 8601 o formato `YYYY-MM-DD`
- **Salida:** ISO 8601 (`2025-11-04T18:30:00.000Z`)

### Validaciones Comunes

- Emails: Formato válido requerido
- Teléfonos: Formato internacional recomendado
- Códigos: Únicos en productos
- Stock: No puede ser negativo
- Cantidades: Deben ser números positivos

### Manejo de Errores

Todas las respuestas de error incluyen:

```json
{
  "success": false,
  "error": "Descripción del error",
  "codigo": 1
}
```

Algunos errores incluyen detalles adicionales:

```json
{
  "success": false,
  "error": "Stock insuficiente",
  "detalles": {
    "stock_actual": 2,
    "cantidad_solicitada": 5
  }
}
```

---

## Exportación desde Swagger

Para exportar desde Swagger UI:

1. Ir a `http://localhost:3000/docs`
2. Copiar la URL completa del JSON: `http://localhost:3000/docs/swagger.json`
3. Usar herramientas como:
   - **Swagger Editor**: https://editor.swagger.io/ (pegar el JSON)
   - **Postman**: Importar desde URL
   - **Insomnia**: Importar OpenAPI/Swagger

---

## Colección de Postman/Thunder Client

Se recomienda crear una colección con:

1. **Variable de entorno `token`**: Se actualiza automáticamente después del login
2. **Pre-request script** para login automático si el token expiró
3. **Tests** para validar respuestas

### Ejemplo de Pre-request Script (Postman)

```javascript
// Si no hay token o expiró, hacer login
if (!pm.environment.get("token") || tokenExpired()) {
  pm.sendRequest(
    {
      url: "http://localhost:3000/login",
      method: "POST",
      header: { "Content-Type": "application/json" },
      body: {
        mode: "raw",
        raw: JSON.stringify({
          str_correo: "usuario@ejemplo.com",
          str_pass: "password",
          codigo_otp: "123456",
        }),
      },
    },
    (err, res) => {
      const token = res.json().token;
      pm.environment.set("token", token);
    }
  );
}
```

---

**Última actualización:** 2025-11-04  
**Versión de API:** 1.0  
**Documentación Swagger:** http://localhost:3000/docs
