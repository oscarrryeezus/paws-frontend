# Guía de Validaciones para Frontend - PAWS API

Esta guía detalla todas las reglas de validación que debe cumplir cada campo en los formularios. Úsala para implementar validación en tiempo real y mostrar mensajes de error específicos debajo de cada input.

---

## 📋 Tabla de Contenidos

1. [Autenticación y Usuarios](#autenticación-y-usuarios)
2. [Productos](#productos)
3. [Clientes](#clientes)
4. [Proveedores](#proveedores)
5. [Movimientos de Stock](#movimientos-de-stock)
6. [Códigos de Verificación](#códigos-de-verificación)
7. [Ejemplos de Validación en Frontend](#ejemplos-de-validación-en-frontend)

---

## 1️⃣ Autenticación y Usuarios

### 📝 Registro de Usuario

#### **Nombre** (`str_nombre`)

| Regla          | Valor                     | Mensaje de Error                                  |
| -------------- | ------------------------- | ------------------------------------------------- |
| **Requerido**  | Sí                        | "El nombre es obligatorio"                        |
| **Mínimo**     | 3 caracteres              | "El nombre debe tener al menos 3 letras"          |
| **Máximo**     | 30 caracteres             | "El nombre no puede exceder los 30 caracteres"    |
| **Patrón**     | Solo letras y espacios    | "El nombre solo puede contener letras y espacios" |
| **Permitidos** | `A-Z a-z Á-ú Ñ ñ espacio` | -                                                 |

```javascript
// Regex de validación
/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;

// Ejemplo válido
("Juan Pérez");
("María José García");

// Ejemplo inválido
("Juan123"); // ❌ Contiene números
("A"); // ❌ Muy corto
```

#### **Correo Electrónico** (`str_correo`)

| Regla         | Valor         | Mensaje de Error                               |
| ------------- | ------------- | ---------------------------------------------- |
| **Requerido** | Sí            | "El correo es obligatorio"                     |
| **Formato**   | Email válido  | "El correo debe tener un formato válido"       |
| **Máximo**    | 30 caracteres | "El correo no puede exceder los 30 caracteres" |

```javascript
// Ejemplo válido
"usuario@mail.com";
"test@empresa.mx";

// Ejemplo inválido
"usuario@"; // ❌ Email incompleto
"usuario.mail.com"; // ❌ Falta @
"usuario@dominio.commmmmmmmmmm"; // ❌ Muy largo
```

#### **Contraseña** (`str_pass`)

| Regla            | Valor                                   | Mensaje de Error                                                             |
| ---------------- | --------------------------------------- | ---------------------------------------------------------------------------- |
| **Requerido**    | Sí                                      | "La contraseña es obligatoria"                                               |
| **Mínimo**       | 8 caracteres                            | "La contraseña debe tener al menos 8 caracteres"                             |
| **Máximo**       | 30 caracteres                           | "La contraseña no puede exceder los 30 caracteres"                           |
| **Debe incluir** | Letras, números y caracteres especiales | "La contraseña debe incluir letras, números y al menos un carácter especial" |

```javascript
// Regex de validación
/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,30}$/;

// Ejemplo válido
("Password123!");
("MiClave#2024");
("Segur@987");

// Ejemplo inválido
("password"); // ❌ Falta número y carácter especial
("12345678"); // ❌ Falta letra y carácter especial
("Pass1"); // ❌ Muy corto
```

**Características requeridas:**

- ✅ Al menos una letra (mayúscula o minúscula)
- ✅ Al menos un número
- ✅ Al menos un carácter especial (!@#$%^&\*()\_+-=[]{}|;:,.<>?)

---

### 🔐 Login

#### **Correo** (`str_correo`)

- Mismas reglas que en registro

#### **Contraseña** (`str_pass`)

- Mismas reglas que en registro

#### **Código OTP** (`str_codigo`)

| Regla         | Valor                 | Mensaje de Error                             |
| ------------- | --------------------- | -------------------------------------------- |
| **Requerido** | Sí                    | "El código es obligatorio"                   |
| **Longitud**  | Exactamente 6 dígitos | "El código debe tener exactamente 6 dígitos" |
| **Patrón**    | Solo números          | "El código debe contener solo números"       |

```javascript
// Regex de validación
/^\d{6}$/;

// Ejemplo válido
("123456");
("000000");
("999999");

// Ejemplo inválido
("12345"); // ❌ Muy corto
("1234567"); // ❌ Muy largo
("12ABC6"); // ❌ Contiene letras
```

---

### 📧 Verificación de Email

#### **Email** (`email`)

- Mismas reglas que `str_correo`

#### **Código de Verificación** (`codigo`)

| Regla         | Valor                 | Mensaje de Error                              |
| ------------- | --------------------- | --------------------------------------------- |
| **Requerido** | Sí                    | "El código de verificación es obligatorio"    |
| **Patrón**    | Exactamente 6 dígitos | "El código debe ser de exactamente 6 dígitos" |

```javascript
// Regex de validación
/^\d{6}$/;
```

---

### 🔑 Recuperación de Contraseña

#### **Solicitar Recuperación**

- **Correo**: Mismas reglas que `str_correo`

#### **Restablecer Contraseña**

| Campo        | Reglas                                     | Mensaje de Error                                                             |
| ------------ | ------------------------------------------ | ---------------------------------------------------------------------------- |
| `str_correo` | Email válido, max 30 chars                 | "El correo debe tener un formato válido"                                     |
| `codigo`     | 6 dígitos numéricos                        | "El código debe tener exactamente 6 dígitos"                                 |
| `nueva_pass` | Min 8, max 30, letras + números + especial | "La contraseña debe incluir letras, números y al menos un carácter especial" |

---

### 📌 PIN (Autenticación de un solo uso)

#### **Configurar PIN**

| Campo        | Reglas                     | Mensaje de Error                                |
| ------------ | -------------------------- | ----------------------------------------------- |
| `str_correo` | Email válido, max 30 chars | "El correo debe tener un formato válido"        |
| `codigo_otp` | 6 dígitos numéricos        | "El código OTP debe ser de 6 dígitos numéricos" |

#### **Usar PIN**

| Campo        | Reglas                     | Mensaje de Error                                     |
| ------------ | -------------------------- | ---------------------------------------------------- |
| `str_correo` | Email válido, max 30 chars | "El correo debe tener un formato válido"             |
| `pin`        | 6 dígitos numéricos        | "El PIN debe ser de exactamente 6 dígitos numéricos" |

```javascript
// Ejemplo de PIN
"123456";
"000000";

// Inválido
"12ABC6"; // ❌ Contiene letras
```

---

## 2️⃣ Productos

### ➕ Registrar Producto

#### **Nombre** (`str_nombre`)

| Regla         | Valor                      | Mensaje de Error                                           |
| ------------- | -------------------------- | ---------------------------------------------------------- |
| **Requerido** | Sí                         | "El nombre es obligatorio"                                 |
| **Mínimo**    | 3 caracteres               | "El nombre debe tener al menos 3 caracteres"               |
| **Máximo**    | 50 caracteres              | "El nombre no puede exceder los 50 caracteres"             |
| **Patrón**    | Letras, números y espacios | "El nombre solo puede contener letras, números y espacios" |

```javascript
// Regex de validación
/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/;

// Ejemplo válido
("Laptop HP 15");
("Teclado Mecánico RGB");
("Mouse Inalámbrico 2024");

// Ejemplo inválido
("PC-2024"); // ❌ Contiene guión
("#Laptop"); // ❌ Contiene #
```

#### **Código** (`str_codigo`)

| Regla         | Valor                                     | Mensaje de Error                                                                       |
| ------------- | ----------------------------------------- | -------------------------------------------------------------------------------------- |
| **Requerido** | Sí                                        | "El código del producto es obligatorio"                                                |
| **Mínimo**    | 3 caracteres                              | "El código debe tener al menos 3 caracteres"                                           |
| **Máximo**    | 20 caracteres                             | "El código no puede exceder los 20 caracteres"                                         |
| **Patrón**    | Alfanumérico (sin espacios ni especiales) | "El código solo puede contener letras y números sin espacios ni caracteres especiales" |

```javascript
// Ejemplo válido
"PROD001";
"ABC123XYZ";
"LAP2024";

// Ejemplo inválido
"PROD-001"; // ❌ Contiene guión
"PROD 001"; // ❌ Contiene espacio
"PR"; // ❌ Muy corto
```

#### **Descripción** (`str_descripcion`)

| Regla          | Valor                                         | Mensaje de Error                                                                              |
| -------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Requerido**  | Sí                                            | "La descripción es obligatoria"                                                               |
| **Mínimo**     | 10 caracteres                                 | "La descripción debe tener al menos 10 caracteres"                                            |
| **Máximo**     | 200 caracteres                                | "La descripción no puede exceder los 200 caracteres"                                          |
| **Patrón**     | Letras, números, espacios y puntuación básica | "La descripción solo puede contener letras, números, espacios y signos de puntuación básicos" |
| **Permitidos** | `. , ; : - ( )`                               | -                                                                                             |

```javascript
// Regex de validación
/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,;:\-()]+$/;

// Ejemplo válido
("Laptop de alto rendimiento para gaming y diseño gráfico.");
("Mouse inalámbrico con sensor óptico de 1600 DPI.");

// Ejemplo inválido
("Laptop"); // ❌ Muy corto (menos de 10)
("Laptop #2024"); // ❌ Contiene # (no permitido)
```

#### **Categoría** (`str_categoria`)

| Regla         | Valor                  | Mensaje de Error                                     |
| ------------- | ---------------------- | ---------------------------------------------------- |
| **Requerido** | Sí                     | "La categoría es obligatoria"                        |
| **Mínimo**    | 3 caracteres           | "La categoría debe tener al menos 3 caracteres"      |
| **Máximo**    | 30 caracteres          | "La categoría no puede exceder los 30 caracteres"    |
| **Patrón**    | Solo letras y espacios | "La categoría solo puede contener letras y espacios" |

```javascript
// Regex de validación
/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;

// Ejemplo válido
("Electrónica");
("Papelería");
("Herramientas");

// Ejemplo inválido
("Electrónica2024"); // ❌ Contiene números
("PC"); // ❌ Muy corto
```

#### **Unidad** (`str_unidad`)

| Regla         | Valor         | Mensaje de Error                               |
| ------------- | ------------- | ---------------------------------------------- |
| **Requerido** | Sí            | "La unidad es obligatoria"                     |
| **Mínimo**    | 1 carácter    | "La unidad debe tener al menos 1 caracter"     |
| **Máximo**    | 15 caracteres | "La unidad no puede exceder los 15 caracteres" |

```javascript
// Ejemplo válido
"pieza";
"litro";
"kg";
"caja";
"metro";

// Ejemplo inválido
""; // ❌ Vacío
```

#### **Stock Mínimo** (`int_stock_minimo`)

| Regla             | Valor         | Mensaje de Error                                          |
| ----------------- | ------------- | --------------------------------------------------------- |
| **Requerido**     | Sí            | "El stock mínimo es obligatorio"                          |
| **Tipo**          | Número entero | "El stock mínimo debe ser un número entero"               |
| **Mínimo**        | 0             | "El stock mínimo no puede ser negativo"                   |
| **Sin decimales** | Entero        | "El stock mínimo debe ser un número entero sin decimales" |

```javascript
// Ejemplo válido
0;
5;
10;
100 -
  // Ejemplo inválido
  1; // ❌ Negativo
5.5; // ❌ Con decimales
("cinco"); // ❌ No es número
```

#### **Stock Actual** (`int_stock_actual`)

| Regla             | Valor         | Mensaje de Error                                          |
| ----------------- | ------------- | --------------------------------------------------------- |
| **Requerido**     | Sí            | "El stock actual es obligatorio"                          |
| **Tipo**          | Número entero | "El stock actual debe ser un número entero"               |
| **Mínimo**        | 0             | "El stock actual no puede ser negativo"                   |
| **Sin decimales** | Entero        | "El stock actual debe ser un número entero sin decimales" |

#### **Activo** (`bool_activo`)

| Regla           | Valor   | Mensaje de Error                             |
| --------------- | ------- | -------------------------------------------- |
| **Tipo**        | Boolean | "El campo activo debe ser verdadero o falso" |
| **Por defecto** | `true`  | -                                            |

```javascript
// Ejemplo válido
true;
false;

// Ejemplo inválido
("true"); // ❌ String, debe ser boolean
1; // ❌ Número, debe ser boolean
```

---

### ✏️ Actualizar Producto

- **Todos los campos son opcionales** excepto `str_codigo` (requerido para identificar el producto)
- Mismas reglas de validación que en registro para campos incluidos

---

### 🔍 Listar Productos (Filtros)

| Campo         | Tipo              | Mínimo  | Máximo    | Por Defecto | Mensaje de Error                                |
| ------------- | ----------------- | ------- | --------- | ----------- | ----------------------------------------------- |
| `pagina`      | Número entero     | 1       | -         | 1           | "La página debe ser mayor o igual a 1"          |
| `limite`      | Número entero     | 1       | 100       | 10          | "El límite no puede ser mayor a 100"            |
| `categoria`   | String (opcional) | 3 chars | 50 chars  | -           | "La categoría debe tener al menos 3 caracteres" |
| `nombre`      | String (opcional) | 3 chars | 100 chars | -           | "El nombre debe tener al menos 3 caracteres"    |
| `bool_activo` | Boolean           | -       | -         | -           | "El campo activo debe ser verdadero o falso"    |

---

### 📦 Movimientos de Stock (Entrada/Salida)

#### **Código de Producto** (`str_codigo`)

- Mismas reglas que en registro de producto

#### **Cantidad** (`cantidad`)

| Regla             | Valor         | Mensaje de Error                                      |
| ----------------- | ------------- | ----------------------------------------------------- |
| **Requerido**     | Sí            | "La cantidad es obligatoria"                          |
| **Tipo**          | Número entero | "La cantidad debe ser un número entero"               |
| **Mínimo**        | Mayor a 0     | "La cantidad debe ser mayor a cero"                   |
| **Sin decimales** | Entero        | "La cantidad debe ser un número entero sin decimales" |

```javascript
// Ejemplo válido
1;
10;
500;

// Ejemplo inválido
0 - // ❌ Debe ser mayor a 0
  5; // ❌ No puede ser negativo
10.5; // ❌ No puede tener decimales
```

---

## 3️⃣ Clientes

### ➕ Crear Cliente

#### **Nombre** (`str_nombre`)

| Regla         | Valor          | Mensaje de Error                            |
| ------------- | -------------- | ------------------------------------------- |
| **Requerido** | Sí             | "El nombre del cliente es obligatorio"      |
| **Máximo**    | 200 caracteres | "El nombre no puede exceder 200 caracteres" |

```javascript
// Ejemplo válido
"Juan Pérez Distribuciones";
"Empresa ABC S.A. de C.V.";

// Ejemplo inválido
""; // ❌ Vacío
```

#### **Teléfono** (`str_telefono`)

| Regla                  | Valor         | Mensaje de Error                             |
| ---------------------- | ------------- | -------------------------------------------- |
| **Requerido**          | No (opcional) | -                                            |
| **Máximo**             | 20 caracteres | "El teléfono no puede exceder 20 caracteres" |
| **Permite vacío/null** | Sí            | -                                            |

```javascript
// Ejemplo válido
"5551234567";
"(555) 123-4567";
"+52 55 1234 5678";
""; // ✅ Permitido (opcional)
null; // ✅ Permitido (opcional)
```

#### **Email** (`str_email`)

| Regla                  | Valor          | Mensaje de Error                           |
| ---------------------- | -------------- | ------------------------------------------ |
| **Requerido**          | No (opcional)  | -                                          |
| **Formato**            | Email válido   | "El email debe tener un formato válido"    |
| **Máximo**             | 150 caracteres | "El email no puede exceder 150 caracteres" |
| **Permite vacío/null** | Sí             | -                                          |

```javascript
// Ejemplo válido
"cliente@empresa.com";
""; // ✅ Permitido (opcional)
null; // ✅ Permitido (opcional)

// Ejemplo inválido
("cliente@"); // ❌ Email incompleto
("cliente.empresa.com"); // ❌ Falta @
```

#### **Contacto** (`str_contacto`)

| Regla                  | Valor          | Mensaje de Error                              |
| ---------------------- | -------------- | --------------------------------------------- |
| **Requerido**          | No (opcional)  | -                                             |
| **Máximo**             | 200 caracteres | "El contacto no puede exceder 200 caracteres" |
| **Permite vacío/null** | Sí             | -                                             |

```javascript
// Ejemplo válido
"Ing. María García";
"Depto. de Compras";
""; // ✅ Permitido
null; // ✅ Permitido
```

#### **Dirección** (`str_direccion`)

| Regla                  | Valor         | Mensaje de Error |
| ---------------------- | ------------- | ---------------- |
| **Requerido**          | No (opcional) | -                |
| **Permite vacío/null** | Sí            | -                |

#### **Activo** (`bool_activo`)

| Regla           | Valor   | Mensaje de Error                             |
| --------------- | ------- | -------------------------------------------- |
| **Tipo**        | Boolean | "El campo activo debe ser verdadero o falso" |
| **Por defecto** | `true`  | -                                            |

---

### 📋 Listar Clientes (Filtros)

| Campo    | Tipo              | Mínimo | Máximo    | Por Defecto | Mensaje de Error                                         |
| -------- | ----------------- | ------ | --------- | ----------- | -------------------------------------------------------- |
| `pagina` | Número entero     | 1      | -         | 1           | "La página debe ser un número positivo"                  |
| `limite` | Número entero     | 1      | 100       | 50          | "El límite no puede exceder 100"                         |
| `activo` | Boolean           | -      | -         | `true`      | "El campo activo debe ser verdadero o falso"             |
| `buscar` | String (opcional) | -      | 200 chars | -           | "El término de búsqueda no puede exceder 200 caracteres" |

---

## 4️⃣ Proveedores

**Las reglas de validación son IDÉNTICAS a las de Clientes**, solo cambian los nombres de los campos de ID:

- `id_proveedor` en lugar de `id_cliente`
- Todos los demás campos (`str_nombre`, `str_telefono`, `str_email`, etc.) tienen las mismas reglas

---

## 5️⃣ Movimientos de Stock

### 📥 Registrar Entrada

| Campo                      | Reglas                            | Mensaje de Error                                              |
| -------------------------- | --------------------------------- | ------------------------------------------------------------- |
| `id_producto`              | Número entero positivo, requerido | "El ID del producto es obligatorio"                           |
| `int_cantidad`             | Número entero positivo, requerido | "La cantidad debe ser mayor a 0"                              |
| `str_referencia_documento` | String opcional, max 100 chars    | "La referencia del documento no puede exceder 100 caracteres" |
| `str_responsable`          | String requerido, max 200 chars   | "El responsable es obligatorio"                               |
| `str_observaciones`        | String opcional                   | -                                                             |
| `id_proveedor`             | Número entero positivo opcional   | "El ID del proveedor debe ser un número positivo"             |
| `id_cliente`               | **PROHIBIDO en entradas**         | "No se permite cliente en entradas de stock"                  |

```javascript
// Ejemplo válido (Entrada)
{
  "id_producto": 5,
  "int_cantidad": 100,
  "str_referencia_documento": "FAC-2024-001",
  "str_responsable": "Juan Pérez",
  "str_observaciones": "Recibido en buen estado",
  "id_proveedor": 3
}

// Ejemplo inválido
{
  "id_producto": 5,
  "int_cantidad": 100,
  "id_cliente": 2  // ❌ No se permite cliente en ENTRADAS
}
```

---

### 📤 Registrar Salida

**Mismas reglas que entrada, excepto:**

| Campo          | Reglas                          | Mensaje de Error                                |
| -------------- | ------------------------------- | ----------------------------------------------- |
| `id_proveedor` | **PROHIBIDO en salidas**        | "No se permite proveedor en salidas de stock"   |
| `id_cliente`   | Número entero positivo opcional | "El ID del cliente debe ser un número positivo" |

```javascript
// Ejemplo válido (Salida)
{
  "id_producto": 5,
  "int_cantidad": 20,
  "str_responsable": "María López",
  "id_cliente": 7
}

// Ejemplo inválido
{
  "id_producto": 5,
  "int_cantidad": 20,
  "id_proveedor": 3  // ❌ No se permite proveedor en SALIDAS
}
```

---

### 📊 Consultar Historial

| Campo         | Tipo   | Reglas                               | Mensaje de Error                                 |
| ------------- | ------ | ------------------------------------ | ------------------------------------------------ |
| `pagina`      | Número | Entero positivo, default 1           | "La página debe ser mayor a 0"                   |
| `limite`      | Número | Entero positivo, max 100, default 50 | "El límite no puede exceder 100"                 |
| `fechaInicio` | Date   | Opcional                             | "La fecha de inicio debe ser una fecha válida"   |
| `fechaFin`    | Date   | Opcional                             | "La fecha de fin debe ser una fecha válida"      |
| `tipo`        | String | "entrada" o "salida"                 | "El tipo debe ser 'entrada' o 'salida'"          |
| `id_producto` | Número | Entero positivo opcional             | "El ID del producto debe ser un número positivo" |
| `responsable` | String | Max 200 chars opcional               | "El responsable no puede exceder 200 caracteres" |

```javascript
// Ejemplo válido
{
  "pagina": 1,
  "limite": 50,
  "fechaInicio": "2024-01-01",
  "fechaFin": "2024-12-31",
  "tipo": "entrada"
}

// Ejemplo inválido
{
  "tipo": "compra"  // ❌ Debe ser "entrada" o "salida"
}
```

---

### 📈 Consultar Resumen

| Campo         | Tipo | Reglas        | Mensaje de Error                    |
| ------------- | ---- | ------------- | ----------------------------------- |
| `fechaInicio` | Date | **Requerido** | "La fecha de inicio es obligatoria" |
| `fechaFin`    | Date | **Requerido** | "La fecha de fin es obligatoria"    |

```javascript
// Ejemplo válido
{
  "fechaInicio": "2024-11-01",
  "fechaFin": "2024-11-30"
}

// Ejemplo inválido
{
  "fechaInicio": "2024-11-01"
  // ❌ Falta fechaFin (obligatoria)
}
```

---

## 6️⃣ Códigos de Verificación

### ✉️ Verificación de Email

| Campo    | Reglas                     | Mensaje de Error                                     |
| -------- | -------------------------- | ---------------------------------------------------- |
| `email`  | Email válido, max 30 chars | "El correo electrónico debe tener un formato válido" |
| `codigo` | 6 dígitos numéricos        | "El código debe ser de exactamente 6 dígitos"        |

---

### 🔐 OTP (Google/Microsoft Authenticator)

| Campo        | Reglas                     | Mensaje de Error                                |
| ------------ | -------------------------- | ----------------------------------------------- |
| `str_correo` | Email válido, max 30 chars | "El correo debe tener un formato válido"        |
| `codigo_otp` | 6 dígitos numéricos        | "El código OTP debe ser de 6 dígitos numéricos" |

```javascript
// Regex de validación
/^\d{6}$/;

// Ejemplo válido
("123456");
("000000");

// Ejemplo inválido
("12345"); // ❌ Solo 5 dígitos
("abc123"); // ❌ Contiene letras
```

---

## 💻 Ejemplos de Validación en Frontend

### React - Validación en Tiempo Real

```jsx
import React, { useState } from "react";

function RegistroProducto() {
  const [formData, setFormData] = useState({
    str_nombre: "",
    str_codigo: "",
    str_descripcion: "",
    str_categoria: "",
    str_unidad: "",
    int_stock_minimo: 0,
    int_stock_actual: 0,
  });

  const [errores, setErrores] = useState({});

  // Función de validación
  const validarCampo = (nombre, valor) => {
    const nuevosErrores = { ...errores };

    switch (nombre) {
      case "str_nombre":
        if (!valor) {
          nuevosErrores.str_nombre = "El nombre es obligatorio";
        } else if (valor.length < 3) {
          nuevosErrores.str_nombre =
            "El nombre debe tener al menos 3 caracteres";
        } else if (valor.length > 50) {
          nuevosErrores.str_nombre =
            "El nombre no puede exceder los 50 caracteres";
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/.test(valor)) {
          nuevosErrores.str_nombre =
            "El nombre solo puede contener letras, números y espacios";
        } else {
          delete nuevosErrores.str_nombre;
        }
        break;

      case "str_codigo":
        if (!valor) {
          nuevosErrores.str_codigo = "El código del producto es obligatorio";
        } else if (valor.length < 3) {
          nuevosErrores.str_codigo =
            "El código debe tener al menos 3 caracteres";
        } else if (valor.length > 20) {
          nuevosErrores.str_codigo =
            "El código no puede exceder los 20 caracteres";
        } else if (!/^[A-Za-z0-9]+$/.test(valor)) {
          nuevosErrores.str_codigo =
            "El código solo puede contener letras y números sin espacios ni caracteres especiales";
        } else {
          delete nuevosErrores.str_codigo;
        }
        break;

      case "str_descripcion":
        if (!valor) {
          nuevosErrores.str_descripcion = "La descripción es obligatoria";
        } else if (valor.length < 10) {
          nuevosErrores.str_descripcion =
            "La descripción debe tener al menos 10 caracteres";
        } else if (valor.length > 200) {
          nuevosErrores.str_descripcion =
            "La descripción no puede exceder los 200 caracteres";
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,;:\-()]+$/.test(valor)) {
          nuevosErrores.str_descripcion =
            "La descripción solo puede contener letras, números, espacios y signos de puntuación básicos";
        } else {
          delete nuevosErrores.str_descripcion;
        }
        break;

      case "int_stock_minimo":
      case "int_stock_actual":
        const num = parseInt(valor, 10);
        if (isNaN(num)) {
          nuevosErrores[nombre] = "Debe ser un número entero";
        } else if (num < 0) {
          nuevosErrores[nombre] = "No puede ser negativo";
        } else if (!Number.isInteger(num)) {
          nuevosErrores[nombre] = "Debe ser un número entero sin decimales";
        } else {
          delete nuevosErrores[nombre];
        }
        break;

      default:
        break;
    }

    setErrores(nuevosErrores);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validarCampo(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos los campos antes de enviar
    Object.keys(formData).forEach((key) => validarCampo(key, formData[key]));

    // Si hay errores, no enviar
    if (Object.keys(errores).length > 0) {
      alert("Por favor corrige los errores antes de continuar");
      return;
    }

    // Enviar al backend
    try {
      const response = await fetch(
        "http://localhost:3000/productos/registrar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Error al registrar producto");
      } else {
        alert("Producto registrado exitosamente");
      }
    } catch (err) {
      alert("Error de conexión");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Nombre */}
      <div>
        <label>Nombre del Producto:</label>
        <input
          type="text"
          name="str_nombre"
          value={formData.str_nombre}
          onChange={handleChange}
          className={errores.str_nombre ? "input-error" : ""}
        />
        {errores.str_nombre && (
          <p className="error-message">{errores.str_nombre}</p>
        )}
      </div>

      {/* Código */}
      <div>
        <label>Código:</label>
        <input
          type="text"
          name="str_codigo"
          value={formData.str_codigo}
          onChange={handleChange}
          className={errores.str_codigo ? "input-error" : ""}
        />
        {errores.str_codigo && (
          <p className="error-message">{errores.str_codigo}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label>Descripción:</label>
        <textarea
          name="str_descripcion"
          value={formData.str_descripcion}
          onChange={handleChange}
          className={errores.str_descripcion ? "input-error" : ""}
        />
        {errores.str_descripcion && (
          <p className="error-message">{errores.str_descripcion}</p>
        )}
      </div>

      {/* Stock Mínimo */}
      <div>
        <label>Stock Mínimo:</label>
        <input
          type="number"
          name="int_stock_minimo"
          value={formData.int_stock_minimo}
          onChange={handleChange}
          className={errores.int_stock_minimo ? "input-error" : ""}
        />
        {errores.int_stock_minimo && (
          <p className="error-message">{errores.int_stock_minimo}</p>
        )}
      </div>

      <button type="submit">Registrar Producto</button>
    </form>
  );
}

export default RegistroProducto;
```

---

### Vue.js - Validación con Composables

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <!-- Nombre de Usuario -->
    <div>
      <label>Nombre:</label>
      <input
        v-model="formData.str_nombre"
        @blur="validarCampo('str_nombre')"
        :class="{ 'input-error': errores.str_nombre }"
      />
      <p v-if="errores.str_nombre" class="error-message">
        {{ errores.str_nombre }}
      </p>
    </div>

    <!-- Email -->
    <div>
      <label>Email:</label>
      <input
        v-model="formData.str_correo"
        @blur="validarCampo('str_correo')"
        :class="{ 'input-error': errores.str_correo }"
      />
      <p v-if="errores.str_correo" class="error-message">
        {{ errores.str_correo }}
      </p>
    </div>

    <!-- Contraseña -->
    <div>
      <label>Contraseña:</label>
      <input
        type="password"
        v-model="formData.str_pass"
        @blur="validarCampo('str_pass')"
        :class="{ 'input-error': errores.str_pass }"
      />
      <p v-if="errores.str_pass" class="error-message">
        {{ errores.str_pass }}
      </p>

      <!-- Indicadores de fuerza de contraseña -->
      <div class="password-strength">
        <p :class="{ valid: tieneLetras }">✓ Contiene letras</p>
        <p :class="{ valid: tieneNumeros }">✓ Contiene números</p>
        <p :class="{ valid: tieneEspeciales }">
          ✓ Contiene caracteres especiales
        </p>
        <p :class="{ valid: longitudValida }">✓ Entre 8 y 30 caracteres</p>
      </div>
    </div>

    <button type="submit" :disabled="!formularioValido">Registrarse</button>
  </form>
</template>

<script setup>
import { ref, computed } from "vue";

const formData = ref({
  str_nombre: "",
  str_correo: "",
  str_pass: "",
});

const errores = ref({});

// Validadores de contraseña
const tieneLetras = computed(() => /[a-zA-Z]/.test(formData.value.str_pass));
const tieneNumeros = computed(() => /\d/.test(formData.value.str_pass));
const tieneEspeciales = computed(() =>
  /[^a-zA-Z\d]/.test(formData.value.str_pass)
);
const longitudValida = computed(
  () =>
    formData.value.str_pass.length >= 8 && formData.value.str_pass.length <= 30
);

const formularioValido = computed(() => {
  return (
    Object.keys(errores.value).length === 0 &&
    formData.value.str_nombre &&
    formData.value.str_correo &&
    formData.value.str_pass
  );
});

const validarCampo = (nombre) => {
  const valor = formData.value[nombre];

  switch (nombre) {
    case "str_nombre":
      if (!valor) {
        errores.value.str_nombre = "El nombre es obligatorio";
      } else if (valor.length < 3) {
        errores.value.str_nombre = "El nombre debe tener al menos 3 letras";
      } else if (valor.length > 30) {
        errores.value.str_nombre =
          "El nombre no puede exceder los 30 caracteres";
      } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(valor)) {
        errores.value.str_nombre =
          "El nombre solo puede contener letras y espacios";
      } else {
        delete errores.value.str_nombre;
      }
      break;

    case "str_correo":
      if (!valor) {
        errores.value.str_correo = "El correo es obligatorio";
      } else if (valor.length > 30) {
        errores.value.str_correo =
          "El correo no puede exceder los 30 caracteres";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
        errores.value.str_correo = "El correo debe tener un formato válido";
      } else {
        delete errores.value.str_correo;
      }
      break;

    case "str_pass":
      if (!valor) {
        errores.value.str_pass = "La contraseña es obligatoria";
      } else if (valor.length < 8) {
        errores.value.str_pass =
          "La contraseña debe tener al menos 8 caracteres";
      } else if (valor.length > 30) {
        errores.value.str_pass =
          "La contraseña no puede exceder los 30 caracteres";
      } else if (
        !/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,30}$/.test(valor)
      ) {
        errores.value.str_pass =
          "La contraseña debe incluir letras, números y al menos un carácter especial";
      } else {
        delete errores.value.str_pass;
      }
      break;
  }
};

const handleSubmit = async () => {
  // Validar todos los campos
  Object.keys(formData.value).forEach(validarCampo);

  if (!formularioValido.value) {
    alert("Por favor corrige los errores");
    return;
  }

  // Enviar al backend
  try {
    const response = await fetch("http://localhost:3000/usuarios/registrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData.value),
    });

    if (!response.ok) {
      const error = await response.json();
      alert(error.error);
    } else {
      alert("Usuario registrado exitosamente");
    }
  } catch (err) {
    alert("Error de conexión");
  }
};
</script>

<style scoped>
.input-error {
  border: 2px solid red;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 4px;
}

.password-strength p {
  font-size: 12px;
  color: gray;
}

.password-strength p.valid {
  color: green;
}
</style>
```

---

### JavaScript Vanilla - Función de Validación Reutilizable

```javascript
// validators.js

const validators = {
  // Validador de nombre
  str_nombre: (valor) => {
    if (!valor) return "El nombre es obligatorio";
    if (valor.length < 3) return "El nombre debe tener al menos 3 letras";
    if (valor.length > 30)
      return "El nombre no puede exceder los 30 caracteres";
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(valor)) {
      return "El nombre solo puede contener letras y espacios";
    }
    return null; // Sin error
  },

  // Validador de correo
  str_correo: (valor) => {
    if (!valor) return "El correo es obligatorio";
    if (valor.length > 30)
      return "El correo no puede exceder los 30 caracteres";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
      return "El correo debe tener un formato válido";
    }
    return null;
  },

  // Validador de contraseña
  str_pass: (valor) => {
    if (!valor) return "La contraseña es obligatoria";
    if (valor.length < 8)
      return "La contraseña debe tener al menos 8 caracteres";
    if (valor.length > 30)
      return "La contraseña no puede exceder los 30 caracteres";
    if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,30}$/.test(valor)) {
      return "La contraseña debe incluir letras, números y al menos un carácter especial";
    }
    return null;
  },

  // Validador de código OTP/PIN
  codigo_otp: (valor) => {
    if (!valor) return "El código es obligatorio";
    if (!/^\d{6}$/.test(valor)) {
      return "El código debe tener exactamente 6 dígitos";
    }
    return null;
  },

  // Validador de código de producto
  str_codigo: (valor) => {
    if (!valor) return "El código del producto es obligatorio";
    if (valor.length < 3) return "El código debe tener al menos 3 caracteres";
    if (valor.length > 20)
      return "El código no puede exceder los 20 caracteres";
    if (!/^[A-Za-z0-9]+$/.test(valor)) {
      return "El código solo puede contener letras y números sin espacios ni caracteres especiales";
    }
    return null;
  },

  // Validador de stock (número entero positivo)
  int_stock: (valor) => {
    const num = parseInt(valor, 10);
    if (isNaN(num)) return "Debe ser un número entero";
    if (num < 0) return "No puede ser negativo";
    if (!Number.isInteger(num))
      return "Debe ser un número entero sin decimales";
    return null;
  },

  // Validador de cantidad (número entero mayor a 0)
  cantidad: (valor) => {
    const num = parseInt(valor, 10);
    if (isNaN(num)) return "Debe ser un número entero";
    if (num <= 0) return "Debe ser mayor a cero";
    if (!Number.isInteger(num))
      return "Debe ser un número entero sin decimales";
    return null;
  },
};

// Función para validar un formulario completo
function validarFormulario(formData, camposRequeridos) {
  const errores = {};

  camposRequeridos.forEach((campo) => {
    const validador = validators[campo];
    if (validador) {
      const error = validador(formData[campo]);
      if (error) {
        errores[campo] = error;
      }
    }
  });

  return {
    esValido: Object.keys(errores).length === 0,
    errores,
  };
}

// Uso en un formulario
const formulario = document.getElementById("registro-form");
const erroresDiv = document.getElementById("errores");

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    str_nombre: document.getElementById("nombre").value,
    str_correo: document.getElementById("correo").value,
    str_pass: document.getElementById("password").value,
  };

  // Validar
  const { esValido, errores } = validarFormulario(formData, [
    "str_nombre",
    "str_correo",
    "str_pass",
  ]);

  if (!esValido) {
    // Mostrar errores
    erroresDiv.innerHTML = Object.values(errores)
      .map((error) => `<p class="error">${error}</p>`)
      .join("");
    return;
  }

  // Enviar al backend
  try {
    const response = await fetch("http://localhost:3000/usuarios/registrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      erroresDiv.innerHTML = `<p class="error">${data.error}</p>`;
    } else {
      alert("Usuario registrado exitosamente");
    }
  } catch (err) {
    erroresDiv.innerHTML = '<p class="error">Error de conexión</p>';
  }
});

// Validación en tiempo real para cada campo
document.getElementById("nombre").addEventListener("blur", (e) => {
  const error = validators.str_nombre(e.target.value);
  const errorSpan = document.getElementById("error-nombre");

  if (error) {
    errorSpan.textContent = error;
    errorSpan.style.display = "block";
    e.target.classList.add("input-error");
  } else {
    errorSpan.style.display = "none";
    e.target.classList.remove("input-error");
  }
});
```

---

## 📌 Resumen de Patrones Regex Importantes

```javascript
// Nombre de usuario/cliente/proveedor (solo letras y espacios)
/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/

// Nombre de producto (letras, números y espacios)
/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/

// Código de producto (alfanumérico sin espacios)
/^[A-Za-z0-9]+$/

// Descripción (letras, números, espacios y puntuación básica)
/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,;:\-()]+$/

// Email
/^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Contraseña (letras + números + especiales, 8-30 chars)
/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,30}$/

// Código OTP/PIN (6 dígitos)
/^\d{6}$/

// Teléfono (flexible, acepta cualquier formato)
// No hay regex estricto, pero max 20 caracteres
```

---

## 🎨 CSS Recomendado para Mensajes de Error

```css
/* Input con error */
.input-error {
  border: 2px solid #dc3545;
  background-color: #fff5f5;
}

.input-error:focus {
  outline: none;
  border-color: #c82333;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

/* Mensaje de error */
.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  margin-bottom: 0;
  display: block;
}

/* Input válido */
.input-valid {
  border: 2px solid #28a745;
  background-color: #f0fff4;
}

/* Indicador de fuerza de contraseña */
.password-strength {
  margin-top: 0.5rem;
}

.password-strength p {
  font-size: 0.75rem;
  color: #6c757d;
  margin: 0.25rem 0;
}

.password-strength p.valid {
  color: #28a745;
}

.password-strength p.valid::before {
  content: "✓ ";
  font-weight: bold;
}
```

---

## 🔗 Integración con la API

### Manejo de Errores del Backend

Cuando el backend devuelve un error, el formato es:

```json
{
  "error": "Error de validación en registro de usuario",
  "errores": [
    "El nombre debe tener al menos 3 letras",
    "El correo debe tener un formato válido"
  ]
}
```

**Código para procesar errores del backend:**

```javascript
async function registrarUsuario(formData) {
  try {
    const response = await fetch("http://localhost:3000/usuarios/registrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Si hay errores múltiples
      if (data.errores && Array.isArray(data.errores)) {
        return {
          success: false,
          errores: data.errores,
        };
      }

      // Si hay un solo error
      return {
        success: false,
        errores: [data.error || "Error desconocido"],
      };
    }

    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      errores: ["Error de conexión con el servidor"],
    };
  }
}

// Uso
const resultado = await registrarUsuario(formData);

if (!resultado.success) {
  // Mostrar errores al usuario
  resultado.errores.forEach((error) => {
    console.error(error);
    // Mostrar en UI
  });
} else {
  console.log("Éxito:", resultado.data);
}
```

---

**Versión:** 1.0  
**Última actualización:** 2025-11-07  
**Autor:** Equipo Backend PAWS
