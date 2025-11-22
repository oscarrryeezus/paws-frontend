# CRUD de Productos - PAWS Frontend

## 📋 Descripción

Implementación completa del CRUD (Crear, Leer, Actualizar, Eliminar) para la gestión de productos, siguiendo la estructura y diseño del proyecto existente.

## 🎯 Características Implementadas

### ✅ Funcionalidades Principales

- **Listar Productos**: Visualización en tarjetas con información clave
- **Crear Producto**: Formulario completo con validación
- **Editar Producto**: Actualización de datos existentes
- **Eliminar Producto**: Eliminación lógica con confirmación
- **Búsqueda**: Búsqueda en tiempo real por código, nombre o descripción
- **Filtros**: Filtrado por categoría
- **Alertas de Stock**: Indicador visual para productos con stock bajo
- **Mensajes**: Feedback visual para operaciones exitosas/fallidas

### 🎨 Diseño

- Interfaz coherente con el login existente
- Uso de componentes shadcn/ui
- Diseño responsivo (mobile, tablet, desktop)
- Modo oscuro con gradientes
- Iconos de Lucide React
- Animaciones y transiciones suaves

## 📁 Estructura de Archivos Creados

```
src/
├── lib/
│   ├── api.js                     # ✅ Configuración de Axios
│   └── productos.js               # ✅ Servicio de productos
├── components/
│   └── productos/
│       ├── ProductoCard.jsx       # ✅ Tarjeta de producto
│       ├── ProductoForm.jsx       # ✅ Formulario crear/editar
│       └── ConfirmDialog.jsx      # ✅ Modal de confirmación
└── app/
    └── productos/
        └── page.jsx               # ✅ Página principal del CRUD
```

## 🚀 Cómo Usar

### 1. Acceder a la Página de Productos

```
http://localhost:3000/productos
```

**Nota:** Debes estar autenticado con un token válido.

### 2. Operaciones Disponibles

#### Crear un Producto

1. Click en botón **"Nuevo Producto"**
2. Completar el formulario:
   - **Código** (requerido, único)
   - **Nombre** (requerido)
   - **Categoría** (requerido)
   - **Unidad** (requerido, ej: pieza, caja, kg)
   - **Stock Mínimo** (requerido, número)
   - **Stock Actual** (requerido, número)
   - **Descripción** (opcional)
3. Click en **"Crear Producto"**

#### Editar un Producto

1. Click en botón **"Editar"** en la tarjeta del producto
2. Modificar los campos deseados
   - **Nota:** El código no se puede editar
3. Click en **"Actualizar"**

#### Eliminar un Producto

1. Click en botón **"Eliminar"** en la tarjeta del producto
2. Confirmar en el modal que aparece
3. El producto se eliminará lógicamente (bool_activo = false)

#### Buscar Productos

- Escribir en el campo de búsqueda
- Se filtrarán automáticamente por:
  - Código
  - Nombre
  - Descripción

#### Filtrar por Categoría

- Seleccionar una categoría del dropdown
- Se mostrarán solo productos de esa categoría

## 🔌 Integración con API

### Configuración de Axios

El archivo `src/lib/api.js` contiene:

- **BaseURL**: `http://localhost:3000` (configurable con `NEXT_PUBLIC_API_URL`)
- **Interceptor de Request**: Agrega automáticamente el token JWT
- **Interceptor de Response**: Maneja errores 401 (redirige a login)

### Endpoints Utilizados

| Método | Endpoint                   | Descripción           |
| ------ | -------------------------- | --------------------- |
| POST   | `/productos/listar`        | Obtener todos         |
| POST   | `/productos/obtener`       | Obtener uno           |
| POST   | `/productos/registrar`     | Crear nuevo           |
| PUT    | `/productos/actualizar`    | Actualizar existente  |
| POST   | `/productos/eliminar`      | Eliminar (lógico)     |
| POST   | `/productos/por-categoria` | Filtrar por categoría |
| POST   | `/productos/bajo-stock`    | Stock < mínimo        |
| POST   | `/productos/entrada`       | Aumentar stock        |
| POST   | `/productos/salida`        | Disminuir stock       |

## 💻 Ejemplos de Código

### Usar el Servicio de Productos

```javascript
import { productosService } from "@/lib/productos";

// Listar productos activos
const response = await productosService.listar({ bool_activo: true });
console.log(response.data);

// Crear producto
const nuevoProducto = {
  str_codigo: "MOU123",
  str_nombre: "Mouse Gamer RGB",
  str_descripcion: "Mouse ergonómico con luces RGB",
  str_categoria: "Periféricos",
  str_unidad: "pieza",
  int_stock_minimo: 5,
  int_stock_actual: 20,
  bool_activo: true,
};
await productosService.registrar(nuevoProducto);

// Actualizar producto
await productosService.actualizar("MOU123", {
  str_nombre: "Mouse Gamer Pro RGB",
  int_stock_minimo: 10,
});

// Eliminar producto
await productosService.eliminar("MOU123");
```

### Configurar Variable de Entorno

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🎨 Componentes UI Utilizados

Todos los componentes son de shadcn/ui ya existentes en el proyecto:

- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
- `Button` (variants: default, outline, destructive, ghost)
- `Input`
- `Label`
- `Alert`

### Iconos (Lucide React)

- `Package` - Icono principal de productos
- `Plus` - Nuevo producto
- `Pencil` - Editar
- `Trash2` - Eliminar
- `Search` - Búsqueda
- `AlertTriangle` - Stock bajo
- `AlertCircle` - Mensajes de error/éxito
- `Loader2` - Cargando
- `X` - Cerrar

## 🔐 Autenticación

El sistema requiere estar autenticado:

1. El token se obtiene del login (`localStorage.getItem("token")`)
2. Se agrega automáticamente en cada petición via interceptor
3. Si el token es inválido o expiró, se redirige a `/login`

## 🚨 Manejo de Errores

### Errores Comunes

| Error                      | Causa                         | Solución                      |
| -------------------------- | ----------------------------- | ----------------------------- |
| 401 Unauthorized           | Token inválido/expirado       | Volver a iniciar sesión       |
| 400 Código duplicado       | Ya existe producto con código | Usar otro código              |
| 404 Producto no encontrado | Código incorrecto             | Verificar código              |
| Network Error              | Backend no disponible         | Verificar que API esté activa |

### Ejemplo de Manejo

```javascript
try {
  await productosService.registrar(producto);
} catch (err) {
  console.error("Error:", err);
  // err.error contiene el mensaje del backend
  alert(err.error || "Error desconocido");
}
```

## 📱 Responsividad

- **Mobile** (< 768px): 1 columna
- **Tablet** (768px - 1024px): 2 columnas
- **Desktop** (> 1024px): 3 columnas

## ✨ Características de UX

1. **Indicador de Stock Bajo**: Icono amarillo cuando stock_actual <= stock_minimo
2. **Loading States**: Spinners durante operaciones asíncronas
3. **Confirmación de Eliminación**: Modal antes de eliminar
4. **Mensajes de Éxito/Error**: Feedback visual con auto-ocultamiento (3 seg)
5. **Búsqueda en Tiempo Real**: Sin necesidad de botón "Buscar"
6. **Formulario Inline**: Se muestra en la misma página
7. **Disabled States**: Botones deshabilitados durante operaciones

## 🧪 Testing

### Verificar Funcionamiento

1. **Backend corriendo**: Asegurar que el backend esté en `http://localhost:3000`
2. **Login válido**: Obtener un token JWT válido
3. **Navegar a productos**: `http://localhost:3000/productos`
4. **Probar operaciones**:
   - Crear producto
   - Editar producto
   - Eliminar producto
   - Búsqueda
   - Filtros

### Datos de Prueba

```javascript
{
  str_codigo: "TEST001",
  str_nombre: "Producto de Prueba",
  str_descripcion: "Este es un producto de prueba",
  str_categoria: "Pruebas",
  str_unidad: "pieza",
  int_stock_minimo: 10,
  int_stock_actual: 50,
  bool_activo: true
}
```

## 🔄 Próximas Mejoras (Opcionales)

- [ ] Paginación para grandes cantidades de productos
- [ ] Exportar a Excel/PDF
- [ ] Importación masiva (CSV)
- [ ] Gestión de entradas/salidas de stock
- [ ] Historial de movimientos
- [ ] Gráficas de estadísticas
- [ ] Códigos de barras/QR
- [ ] Multi-imagen por producto
- [ ] Categorías jerárquicas

## 📞 Soporte

Para dudas o problemas:

1. Verificar que el backend esté corriendo
2. Verificar la consola del navegador (F12)
3. Verificar la consola del servidor Next.js
4. Revisar la documentación de la API en `/docs`

---

**Versión**: 1.0  
**Fecha**: 4 de noviembre de 2025  
**Autor**: GitHub Copilot  
**Framework**: Next.js 15.5.4  
**UI Library**: shadcn/ui  
**HTTP Client**: Axios 1.13.1
