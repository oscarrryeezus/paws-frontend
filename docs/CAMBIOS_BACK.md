# 📊 Endpoints para Dashboard - PAWS Sistema

Documentación de endpoints para estadísticas y reportes del dashboard frontend.

---

## 🔐 Autenticación

Todos los endpoints requieren autenticación mediante Bearer Token JWT.

**Header requerido:**

```
Authorization: Bearer {tu_token_jwt}
```

El token expira en **5 minutos**.

---

## 📈 1. Total de Productos Activos

Obtiene el número total de productos activos en el sistema.

### Endpoint

```
POST /productos/total
```

### Request

```json
{
  // No requiere body
}
```

### Response Exitosa (200)

```json
{
  "status": true,
  "message": "Total de productos obtenido correctamente.",
  "data": {
    "total": 150
  }
}
```

### Response Error (500)

```json
{
  "status": false,
  "message": "Error al obtener total de productos.",
  "error": "Mensaje de error detallado"
}
```

### Ejemplo Frontend (JavaScript)

```javascript
async function obtenerTotalProductos() {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:3000/productos/total", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (data.status) {
    console.log("Total de productos:", data.data.total);
    // Actualizar UI con data.data.total
  }
}
```

---

## 📉 2. Productos con Stock Bajo

Obtiene el conteo de productos que tienen stock por debajo del mínimo establecido.

### Endpoint

```
POST /productos/estadisticas-stock-bajo
```

### Request

```json
{
  // No requiere body
}
```

### Response Exitosa (200)

```json
{
  "status": true,
  "message": "Estadísticas de stock bajo obtenidas correctamente.",
  "data": {
    "total_productos_bajo_stock": 12
  }
}
```

### Response Error (500)

```json
{
  "status": false,
  "message": "Error al obtener estadísticas de stock bajo.",
  "error": "Mensaje de error detallado"
}
```

### Ejemplo Frontend (JavaScript)

```javascript
async function obtenerStockBajo() {
  const token = localStorage.getItem("token");

  const response = await fetch(
    "http://localhost:3000/productos/estadisticas-stock-bajo",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (data.status) {
    console.log(
      "Productos con stock bajo:",
      data.data.total_productos_bajo_stock
    );
    // Mostrar alerta si > 0
    if (data.data.total_productos_bajo_stock > 0) {
      alert(
        `¡Atención! ${data.data.total_productos_bajo_stock} productos con stock bajo`
      );
    }
  }
}
```

---

## 📦 3. Movimientos de Hoy (Entradas/Salidas)

Obtiene estadísticas de movimientos realizados en el día actual.

### Endpoint

```
POST /movimientos/hoy
```

### Request

```json
{
  // No requiere body
}
```

### Response Exitosa (200)

```json
{
  "success": true,
  "mensaje": "Movimientos de hoy obtenidos correctamente",
  "data": {
    "fecha": "2025-11-21",
    "entradas": {
      "total_movimientos": 15,
      "total_unidades": 450
    },
    "salidas": {
      "total_movimientos": 8,
      "total_unidades": 120
    }
  }
}
```

### Response Error (500)

```json
{
  "success": false,
  "error": "Mensaje de error detallado"
}
```

### Ejemplo Frontend (JavaScript)

```javascript
async function obtenerMovimientosHoy() {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:3000/movimientos/hoy", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (data.success) {
    console.log("Fecha:", data.data.fecha);
    console.log("Entradas:", data.data.entradas);
    console.log("Salidas:", data.data.salidas);

    // Ejemplo: Actualizar cards del dashboard
    document.getElementById("entradas-hoy").innerText =
      data.data.entradas.total_movimientos;
    document.getElementById("unidades-entrada").innerText =
      data.data.entradas.total_unidades;
    document.getElementById("salidas-hoy").innerText =
      data.data.salidas.total_movimientos;
    document.getElementById("unidades-salida").innerText =
      data.data.salidas.total_unidades;
  }
}
```

---

## 👥 4. Total de Proveedores Activos

Obtiene el número total de proveedores activos en el sistema.

### Endpoint

```
POST /proveedores/total
```

### Request

```json
{
  // No requiere body
}
```

### Response Exitosa (200)

```json
{
  "success": true,
  "mensaje": "Total de proveedores obtenido correctamente",
  "data": {
    "total": 25
  }
}
```

### Response Error (500)

```json
{
  "success": false,
  "error": "Mensaje de error detallado"
}
```

### Ejemplo Frontend (JavaScript)

```javascript
async function obtenerTotalProveedores() {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:3000/proveedores/total", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (data.success) {
    console.log("Total de proveedores:", data.data.total);
    // Actualizar UI
    document.getElementById("total-proveedores").innerText = data.data.total;
  }
}
```

---

## 📄 5. Reporte Excel de Productos

Genera y descarga un archivo Excel con todos los productos activos, incluyendo formato condicional para productos con stock bajo.

### Endpoint

```
POST /productos/reporte-excel
```

### Request

```json
{
  // No requiere body
}
```

### Response Exitosa (200)

- **Content-Type**: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- **Content-Disposition**: `attachment; filename=Reporte_Productos_YYYY-MM-DD.xlsx`
- **Body**: Archivo Excel binario

### Características del Excel:

✅ Encabezados con formato profesional (fondo azul, texto blanco)  
✅ Columnas: Código, Nombre, Categoría, Descripción, Unidad, Stock Actual, Stock Mínimo, Estado Stock  
✅ Formato condicional:

- **BAJO STOCK**: Fondo rojo, texto blanco
- **NORMAL**: Fondo verde, texto blanco  
  ✅ Autofiltro habilitado  
  ✅ Bordes en todas las celdas  
  ✅ Fila de resumen al final con totales  
  ✅ Solo productos con `bool_activo: true`

### Response Error (500)

```json
{
  "status": false,
  "message": "Error al generar reporte Excel.",
  "error": "Mensaje de error detallado"
}
```

### Ejemplo Frontend (JavaScript)

```javascript
async function descargarReporteExcel() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      "http://localhost:3000/productos/reporte-excel",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al generar reporte");
    }

    // Convertir respuesta a blob
    const blob = await response.blob();

    // Crear URL temporal para descarga
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Reporte_Productos_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    alert("Reporte descargado exitosamente");
  } catch (error) {
    console.error("Error:", error);
    alert("Error al descargar el reporte");
  }
}
```

### Ejemplo Frontend (React)

```javascript
import React from "react";

const DescargarReporte = () => {
  const handleDescargarReporte = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:3000/productos/reporte-excel",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Error al generar reporte");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Reporte_Productos_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar reporte:", error);
    }
  };

  return (
    <button onClick={handleDescargarReporte} className="btn btn-success">
      📊 Descargar Reporte Excel
    </button>
  );
};

export default DescargarReporte;
```

---

## 📊 6. Ejemplo: Dashboard Completo

Función para cargar todas las estadísticas del dashboard de una vez:

```javascript
async function cargarDashboard() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/login";
    return;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  try {
    // Llamadas en paralelo
    const [productos, stockBajo, movimientos, proveedores] = await Promise.all([
      fetch("http://localhost:3000/productos/total", {
        method: "POST",
        headers,
      }).then((r) => r.json()),
      fetch("http://localhost:3000/productos/estadisticas-stock-bajo", {
        method: "POST",
        headers,
      }).then((r) => r.json()),
      fetch("http://localhost:3000/movimientos/hoy", {
        method: "POST",
        headers,
      }).then((r) => r.json()),
      fetch("http://localhost:3000/proveedores/total", {
        method: "POST",
        headers,
      }).then((r) => r.json()),
    ]);

    // Actualizar UI
    if (productos.status) {
      document.getElementById("total-productos").innerText =
        productos.data.total;
    }

    if (stockBajo.status) {
      const totalBajo = stockBajo.data.total_productos_bajo_stock;
      document.getElementById("stock-bajo").innerText = totalBajo;

      // Mostrar alerta si hay productos con stock bajo
      if (totalBajo > 0) {
        document.getElementById("alerta-stock").classList.remove("d-none");
        document.getElementById(
          "alerta-stock"
        ).innerText = `¡Atención! ${totalBajo} productos con stock bajo`;
      }
    }

    if (movimientos.success) {
      document.getElementById("entradas-hoy").innerText =
        movimientos.data.entradas.total_movimientos;
      document.getElementById("unidades-entrada").innerText =
        movimientos.data.entradas.total_unidades;
      document.getElementById("salidas-hoy").innerText =
        movimientos.data.salidas.total_movimientos;
      document.getElementById("unidades-salida").innerText =
        movimientos.data.salidas.total_unidades;
    }

    if (proveedores.success) {
      document.getElementById("total-proveedores").innerText =
        proveedores.data.total;
    }
  } catch (error) {
    console.error("Error al cargar dashboard:", error);

    // Verificar si el token expiró
    if (error.message.includes("401") || error.message.includes("403")) {
      alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", cargarDashboard);

// Actualizar cada 30 segundos (opcional)
setInterval(cargarDashboard, 30000);
```

---

## 🎨 7. Ejemplo HTML del Dashboard

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Dashboard - PAWS Sistema</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
  </head>
  <body>
    <div class="container mt-5">
      <h1>📊 Dashboard</h1>

      <!-- Alerta de stock bajo -->
      <div
        id="alerta-stock"
        class="alert alert-danger d-none"
        role="alert"
      ></div>

      <div class="row mt-4">
        <!-- Card Total Productos -->
        <div class="col-md-3">
          <div class="card text-white bg-primary mb-3">
            <div class="card-header">Total Productos</div>
            <div class="card-body">
              <h2 class="card-title" id="total-productos">-</h2>
            </div>
          </div>
        </div>

        <!-- Card Stock Bajo -->
        <div class="col-md-3">
          <div class="card text-white bg-danger mb-3">
            <div class="card-header">Stock Bajo</div>
            <div class="card-body">
              <h2 class="card-title" id="stock-bajo">-</h2>
            </div>
          </div>
        </div>

        <!-- Card Proveedores -->
        <div class="col-md-3">
          <div class="card text-white bg-info mb-3">
            <div class="card-header">Proveedores</div>
            <div class="card-body">
              <h2 class="card-title" id="total-proveedores">-</h2>
            </div>
          </div>
        </div>

        <!-- Card Entradas Hoy -->
        <div class="col-md-3">
          <div class="card text-white bg-success mb-3">
            <div class="card-header">Entradas Hoy</div>
            <div class="card-body">
              <h2 class="card-title" id="entradas-hoy">-</h2>
              <p class="card-text">
                <small id="unidades-entrada">-</small> unidades
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <!-- Card Salidas Hoy -->
        <div class="col-md-3">
          <div class="card text-white bg-warning mb-3">
            <div class="card-header">Salidas Hoy</div>
            <div class="card-body">
              <h2 class="card-title" id="salidas-hoy">-</h2>
              <p class="card-text">
                <small id="unidades-salida">-</small> unidades
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Botón de descarga de reporte -->
      <div class="mt-4">
        <button
          onclick="descargarReporteExcel()"
          class="btn btn-success btn-lg"
        >
          📄 Descargar Reporte Excel
        </button>
      </div>
    </div>

    <script src="dashboard.js"></script>
  </body>
</html>
```

---

## 📋 Resumen de Endpoints

| Endpoint                             | Método | Descripción                  | Response Field                    |
| ------------------------------------ | ------ | ---------------------------- | --------------------------------- |
| `/productos/total`                   | POST   | Total de productos activos   | `data.total`                      |
| `/productos/estadisticas-stock-bajo` | POST   | Productos con stock bajo     | `data.total_productos_bajo_stock` |
| `/productos/reporte-excel`           | POST   | Descarga Excel de productos  | Archivo binario                   |
| `/movimientos/hoy`                   | POST   | Movimientos del día actual   | `data.entradas`, `data.salidas`   |
| `/proveedores/total`                 | POST   | Total de proveedores activos | `data.total`                      |

---

## ⚠️ Notas Importantes

1. **Tokens JWT**: Expiran en 5 minutos. Implementar refresh o re-login automático.

2. **Manejo de Errores**: Siempre verificar el campo `status` o `success` en la respuesta:

   ```javascript
   if (data.status || data.success) {
     // Éxito
   } else {
     // Error
     console.error(data.message || data.error);
   }
   ```

3. **CORS**: Asegurarse de que el backend tenga CORS habilitado para tu dominio frontend.

4. **Reporte Excel**: El archivo se genera dinámicamente en cada petición, puede tardar algunos segundos si hay muchos productos.

5. **Actualización Automática**: Considerar usar `setInterval` o WebSockets para actualizar estadísticas en tiempo real.

6. **Stock Bajo**: El conteo se basa en `int_stock_actual <= int_stock_minimo` y solo productos activos.

7. **Movimientos Hoy**: Se calcula desde las 00:00:00 hasta las 23:59:59 del día actual según hora del servidor.

---

## 🔍 Endpoints Adicionales Existentes

### Listar Productos con Stock Bajo (Detallado)

```
POST /productos/bajo-stock
```

Retorna la lista completa de productos con stock bajo (no solo el conteo).

**Response:**

```json
{
  "status": true,
  "message": "Productos con bajo stock obtenidos correctamente.",
  "data": [
    {
      "id_producto": 1,
      "str_codigo": "PROD-001",
      "str_nombre": "Producto Ejemplo",
      "int_stock_actual": 3,
      "int_stock_minimo": 10,
      "str_categoria": "Electrónica"
    }
  ]
}
```

---

## 📞 Soporte

Para más información sobre otros endpoints, consultar:

- `docs/API_ENDPOINTS.md` - Documentación completa de la API
- `docs/API_QUICK_REFERENCE.md` - Referencia rápida
- Swagger UI: `http://localhost:3000/api-docs`

---

**Última actualización:** 21 de noviembre de 2025  
**Versión:** 1.0.0
