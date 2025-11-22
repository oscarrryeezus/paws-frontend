"use client";
import { useState, useEffect } from "react";
import { productosService } from "@/lib/productos";
import ProductoCard from "@/components/productos/ProductoCard";
import ProductoForm from "@/components/productos/ProductoForm";
import ConfirmDialog from "@/components/productos/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Plus, Search, Package, AlertCircle, Loader2, Download } from "lucide-react";
import { dashboardService } from "@/lib/dashboard";

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [showForm, setShowForm] = useState(false);
  const [productoEdit, setProductoEdit] = useState(null);
  const [productoDelete, setProductoDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  // Cargar productos
  useEffect(() => {
    cargarProductos();
  }, []);

  // Filtrar productos cuando cambia búsqueda o filtro
  useEffect(() => {
    let filtered = productos;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.str_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.str_codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.str_descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategoria) {
      filtered = filtered.filter((p) => p.str_categoria === filterCategoria);
    }

    setFilteredProductos(filtered);
  }, [searchTerm, filterCategoria, productos]);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError("");
      // Intentar sin filtros primero (body vacío)
      const response = await productosService.listar({});
      setProductos(response.data || []);
      setFilteredProductos(response.data || []);
    } catch (err) {
      // Mostrar el error completo del backend
      const errorMsg = err.message || err.error || "Error al cargar productos";
      const errorDetails = err.errors ? `\n${JSON.stringify(err.errors)}` : "";
      setError(errorMsg + errorDetails);
      console.error("Error cargando productos:", err);
      
      // Si hay errores de validación, mostrarlos en consola
      if (err.errors) {
        console.error("Errores de validación:", err.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setError("");
      setSuccess("");

      if (productoEdit) {
        // Actualizar
        await productosService.actualizar(productoEdit.str_codigo, formData);
        setSuccess("Producto actualizado exitosamente");
      } else {
        // Crear
        await productosService.registrar(formData);
        setSuccess("Producto creado exitosamente");
      }

      setShowForm(false);
      setProductoEdit(null);
      await cargarProductos();

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.error || "Error al guardar producto");
      console.error("Error guardando producto:", err);
    }
  };

  const handleEdit = (producto) => {
    setProductoEdit(producto);
    setShowForm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productoDelete) return;

    try {
      setDeleteLoading(true);
      setError("");
      await productosService.eliminar(productoDelete.str_codigo);
      setSuccess("Producto eliminado exitosamente");
      setProductoDelete(null);
      await cargarProductos();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.error || "Error al eliminar producto");
      console.error("Error eliminando producto:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleNuevoProducto = () => {
    setProductoEdit(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setProductoEdit(null);
  };

  // Obtener categorías únicas
  const categorias = [...new Set(productos.map((p) => p.str_categoria).filter(Boolean))];

  const handleDescargarExcel = async () => {
    try {
      setDownloadingExcel(true);
      setError("");
      await dashboardService.descargarReporteExcel();
      setSuccess("Reporte descargado exitosamente");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Error al descargar el reporte Excel");
      console.error("Error descargando Excel:", err);
    } finally {
      setDownloadingExcel(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 p-6 relative">
      {/* Fondos decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <Package className="size-6 text-white" />
              </div>
              Gestión de Productos
            </h1>
            <p className="text-gray-700 mt-2">
              {productos.length} productos registrados
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleDescargarExcel}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={downloadingExcel}
            >
              {downloadingExcel ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Descargando...
                </>
              ) : (
                <>
                  <Download className="size-5" />
                  Descargar Excel
                </>
              )}
            </Button>
            <Button
              onClick={handleNuevoProducto}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={showForm}
            >
              <Plus className="size-5" />
              Nuevo Producto
            </Button>
          </div>
        </div>

        {/* Mensajes */}
        {error && (
          <Alert className="bg-red-50 border-red-200 text-red-700">
            <AlertCircle className="size-4" />
            <span>{error}</span>
          </Alert>
        )}

        {success && (
          <Alert className="bg-emerald-50 border-emerald-200 text-emerald-700">
            <AlertCircle className="size-4" />
            <span>{success}</span>
          </Alert>
        )}

        {/* Formulario */}
        {showForm && (
          <ProductoForm
            producto={productoEdit}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
          />
        )}

        {/* Filtros y Búsqueda */}
        {!showForm && (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por código, nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-sky-200 text-gray-900 placeholder-gray-400 focus:border-sky-400 focus:ring-sky-400/20"
              />
            </div>
            {categorias.length > 0 && (
              <select
                value={filterCategoria}
                onChange={(e) => setFilterCategoria(e.target.value)}
                className="px-4 py-2 rounded-md border border-sky-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-400/20 focus:border-sky-400"
              >
                <option value="">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Lista de Productos */}
        {!showForm && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="size-8 text-sky-500 animate-spin" />
              </div>
            ) : filteredProductos.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-white rounded-2xl p-12 border border-sky-200 shadow-md">
                  <Package className="size-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    {searchTerm || filterCategoria
                      ? "No se encontraron productos"
                      : "No hay productos registrados"}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {searchTerm || filterCategoria
                      ? "Intenta con otros términos de búsqueda"
                      : "Comienza agregando tu primer producto"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProductos.map((producto) => (
                  <ProductoCard
                    key={producto.id_producto}
                    producto={producto}
                    onEdit={handleEdit}
                    onDelete={setProductoDelete}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Dialog de confirmación */}
        {productoDelete && (
          <ConfirmDialog
            title="Eliminar Producto"
            message={`¿Estás seguro de que deseas eliminar "${productoDelete.str_nombre}"? Esta acción no se puede deshacer.`}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setProductoDelete(null)}
            loading={deleteLoading}
          />
        )}
      </div>
    </div>
  );
}
