# Ejemplos de Integración Frontend - PAWS API

## Configuración Inicial

### 1. Clase de Servicio API (Recomendado)

```javascript
// services/api.js
class PawsAPI {
  constructor(baseURL = "http://localhost:3000") {
    this.baseURL = baseURL;
    this.token = localStorage.getItem("token");
  }

  // Método base para peticiones
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Agregar token si existe
    if (this.token && !options.skipAuth) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      const data = await response.json();

      // Manejar errores de autenticación
      if (response.status === 401) {
        this.handleUnauthorized();
        throw new Error(data.error || "No autenticado");
      }

      if (!response.ok) {
        throw new Error(data.error || "Error en la petición");
      }

      return data;
    } catch (error) {
      console.error("Error en API:", error);
      throw error;
    }
  }

  // Guardar token
  setToken(token) {
    this.token = token;
    localStorage.setItem("token", token);
  }

  // Limpiar token
  clearToken() {
    this.token = null;
    localStorage.removeItem("token");
  }

  // Manejar sesión expirada
  handleUnauthorized() {
    this.clearToken();
    // Redirigir a login
    window.location.href = "/login";
  }

  // ============ AUTENTICACIÓN ============

  async registrar(nombre, correo, password) {
    return this.request("/usuarios/registrar", {
      method: "POST",
      body: { str_nombre: nombre, str_correo: correo, str_pass: password },
      skipAuth: true,
    });
  }

  async verificarEmail(email, codigo) {
    return this.request("/usuarios/verificar-email", {
      method: "POST",
      body: { email, codigo },
      skipAuth: true,
    });
  }

  async verificarOTP(correo, codigoOTP) {
    return this.request("/usuarios/verificar-otp", {
      method: "POST",
      body: { str_correo: correo, codigo_otp: codigoOTP },
      skipAuth: true,
    });
  }

  async login(correo, password, codigoOTP) {
    const response = await this.request("/login", {
      method: "POST",
      body: { str_correo: correo, str_pass: password, codigo_otp: codigoOTP },
      skipAuth: true,
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  // ============ PRODUCTOS ============

  async listarProductos(filtros = {}) {
    return this.request("/productos/listar", {
      method: "POST",
      body: filtros,
    });
  }

  async obtenerProducto(codigo) {
    return this.request("/productos/obtener", {
      method: "POST",
      body: { str_codigo: codigo },
    });
  }

  async registrarProducto(producto) {
    return this.request("/productos/registrar", {
      method: "POST",
      body: producto,
    });
  }

  async actualizarProducto(codigo, cambios) {
    return this.request("/productos/actualizar", {
      method: "PUT",
      body: { str_codigo: codigo, ...cambios },
    });
  }

  async eliminarProducto(codigo) {
    return this.request("/productos/eliminar", {
      method: "POST",
      body: { str_codigo: codigo },
    });
  }

  async productosPorCategoria(categoria) {
    return this.request("/productos/por-categoria", {
      method: "POST",
      body: { str_categoria: categoria },
    });
  }

  async productosBajoStock() {
    return this.request("/productos/bajo-stock", {
      method: "POST",
      body: {},
    });
  }

  async entradaStock(codigo, cantidad) {
    return this.request("/productos/entrada", {
      method: "POST",
      body: { str_codigo: codigo, cantidad },
    });
  }

  async salidaStock(codigo, cantidad) {
    return this.request("/productos/salida", {
      method: "POST",
      body: { str_codigo: codigo, cantidad },
    });
  }

  // ============ MOVIMIENTOS ============

  async registrarEntrada(movimiento) {
    return this.request("/movimientos/entradas", {
      method: "POST",
      body: movimiento,
    });
  }

  async registrarSalida(movimiento) {
    return this.request("/movimientos/salidas", {
      method: "POST",
      body: movimiento,
    });
  }

  async obtenerHistorial(fechaInicio, fechaFin, tipo = null) {
    return this.request("/movimientos/historial", {
      method: "POST",
      body: { fecha_inicio: fechaInicio, fecha_fin: fechaFin, str_tipo: tipo },
    });
  }

  async obtenerResumen(fechaInicio, fechaFin) {
    return this.request("/movimientos/resumen", {
      method: "POST",
      body: { fecha_inicio: fechaInicio, fecha_fin: fechaFin },
    });
  }

  // ============ PROVEEDORES ============

  async listarProveedores(filtros = {}) {
    return this.request("/proveedores/listar", {
      method: "POST",
      body: filtros,
    });
  }

  async crearProveedor(proveedor) {
    return this.request("/proveedores/crear", {
      method: "POST",
      body: proveedor,
    });
  }

  async obtenerProveedor(id) {
    return this.request("/proveedores/obtener", {
      method: "POST",
      body: { id_proveedor: id },
    });
  }

  async actualizarProveedor(id, cambios) {
    return this.request("/proveedores/actualizar", {
      method: "POST",
      body: { id_proveedor: id, ...cambios },
    });
  }

  async eliminarProveedor(id) {
    return this.request("/proveedores/eliminar", {
      method: "POST",
      body: { id_proveedor: id },
    });
  }

  // ============ CLIENTES ============

  async listarClientes(filtros = {}) {
    return this.request("/clientes/listar", {
      method: "POST",
      body: filtros,
    });
  }

  async crearCliente(cliente) {
    return this.request("/clientes/crear", {
      method: "POST",
      body: cliente,
    });
  }

  async obtenerCliente(id) {
    return this.request("/clientes/obtener", {
      method: "POST",
      body: { id_cliente: id },
    });
  }

  async actualizarCliente(id, cambios) {
    return this.request("/clientes/actualizar", {
      method: "POST",
      body: { id_cliente: id, ...cambios },
    });
  }

  async eliminarCliente(id) {
    return this.request("/clientes/eliminar", {
      method: "POST",
      body: { id_cliente: id },
    });
  }

  async clientesActivos() {
    return this.request("/clientes/activos", {
      method: "POST",
      body: {},
    });
  }
}

// Exportar instancia única
export default new PawsAPI();
```

---

## Uso en Componentes

### React

```jsx
// components/Login.jsx
import React, { useState } from "react";
import api from "../services/api";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [codigoOTP, setCodigoOTP] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.login(correo, password, codigoOTP);

      // Guardar información del usuario
      localStorage.setItem("user", JSON.stringify(response.user));

      // Redirigir al dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Código OTP (6 dígitos)"
        value={codigoOTP}
        onChange={(e) => setCodigoOTP(e.target.value)}
        maxLength={6}
        required
      />

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </button>
    </form>
  );
}

export default Login;
```

```jsx
// components/ProductList.jsx
import React, { useState, useEffect } from "react";
import api from "../services/api";

function ProductList() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const response = await api.listarProductos({ bool_activo: true });
      setProductos(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (codigo) => {
    if (!confirm("¿Eliminar este producto?")) return;

    try {
      await api.eliminarProducto(codigo);
      alert("Producto eliminado exitosamente");
      cargarProductos(); // Recargar lista
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Productos</h2>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id_producto}>
              <td>{producto.str_codigo}</td>
              <td>{producto.str_nombre}</td>
              <td>{producto.str_categoria}</td>
              <td>{producto.int_stock_actual}</td>
              <td>
                <button onClick={() => handleEliminar(producto.str_codigo)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;
```

---

### Vue.js

```vue
<!-- components/ProductList.vue -->
<template>
  <div>
    <h2>Productos</h2>

    <div v-if="loading">Cargando...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <table v-else>
      <thead>
        <tr>
          <th>Código</th>
          <th>Nombre</th>
          <th>Stock</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="producto in productos" :key="producto.id_producto">
          <td>{{ producto.str_codigo }}</td>
          <td>{{ producto.str_nombre }}</td>
          <td>{{ producto.int_stock_actual }}</td>
          <td>
            <button @click="eliminar(producto.str_codigo)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  name: "ProductList",
  data() {
    return {
      productos: [],
      loading: true,
      error: null,
    };
  },
  mounted() {
    this.cargarProductos();
  },
  methods: {
    async cargarProductos() {
      try {
        this.loading = true;
        const response = await api.listarProductos({ bool_activo: true });
        this.productos = response.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async eliminar(codigo) {
      if (!confirm("¿Eliminar este producto?")) return;

      try {
        await api.eliminarProducto(codigo);
        this.$toast.success("Producto eliminado");
        this.cargarProductos();
      } catch (err) {
        this.$toast.error(err.message);
      }
    },
  },
};
</script>
```

---

### Angular

```typescript
// services/api.service.ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private baseURL = "http://localhost:3000";
  private token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem("token");
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ "Content-Type": "application/json" });
    if (this.token) {
      headers = headers.set("Authorization", `Bearer ${this.token}`);
    }
    return headers;
  }

  login(correo: string, password: string, codigoOTP: string): Observable<any> {
    return this.http
      .post(`${this.baseURL}/login`, {
        str_correo: correo,
        str_pass: password,
        codigo_otp: codigoOTP,
      })
      .pipe(
        tap((response: any) => {
          if (response.token) {
            this.token = response.token;
            localStorage.setItem("token", response.token);
          }
        }),
        catchError(this.handleError)
      );
  }

  listarProductos(filtros = {}): Observable<any> {
    return this.http
      .post(`${this.baseURL}/productos/listar`, filtros, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  registrarProducto(producto: any): Observable<any> {
    return this.http
      .post(`${this.baseURL}/productos/registrar`, producto, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error("Error:", error);
    return throwError(
      () => new Error(error.error?.error || "Error en la petición")
    );
  }
}
```

```typescript
// components/product-list.component.ts
import { Component, OnInit } from "@angular/core";
import { ApiService } from "../services/api.service";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
})
export class ProductListComponent implements OnInit {
  productos: any[] = [];
  loading = true;
  error = "";

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.loading = true;
    this.api.listarProductos({ bool_activo: true }).subscribe({
      next: (response) => {
        this.productos = response.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  eliminar(codigo: string) {
    if (!confirm("¿Eliminar producto?")) return;

    this.api.eliminarProducto(codigo).subscribe({
      next: () => {
        alert("Producto eliminado");
        this.cargarProductos();
      },
      error: (err) => alert(err.message),
    });
  }
}
```

---

## Manejo de Errores Global

### React Context

```jsx
// context/AuthContext.jsx
import React, { createContext, useState, useContext } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (correo, password, codigoOTP) => {
    try {
      const response = await api.login(correo, password, codigoOTP);
      setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user));
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

---

## Interceptores Axios (Alternativa)

```javascript
// services/axios-config.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
```

---

## Testing

### Jest + React Testing Library

```javascript
// __tests__/ProductList.test.js
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductList from "../components/ProductList";
import api from "../services/api";

jest.mock("../services/api");

describe("ProductList", () => {
  beforeEach(() => {
    api.listarProductos.mockResolvedValue({
      success: true,
      data: [
        { id_producto: 1, str_codigo: "TEST01", str_nombre: "Producto Test" },
      ],
    });
  });

  it("debe cargar y mostrar productos", async () => {
    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText("Producto Test")).toBeInTheDocument();
    });
  });

  it("debe eliminar un producto", async () => {
    api.eliminarProducto.mockResolvedValue({ success: true });

    render(<ProductList />);

    await waitFor(() => screen.getByText("Producto Test"));

    const deleteButton = screen.getByText("Eliminar");
    await userEvent.click(deleteButton);

    expect(api.eliminarProducto).toHaveBeenCalledWith("TEST01");
  });
});
```

---

**Versión:** 1.0  
**Última actualización:** 2025-11-04
