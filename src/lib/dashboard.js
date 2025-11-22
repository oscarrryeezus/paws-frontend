import api from "./api";

export const dashboardService = {
  // Obtener total de productos activos
  async obtenerTotalProductos() {
    try {
      const response = await api.post("/productos/total", {});
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener productos con stock bajo
  async obtenerStockBajo() {
    try {
      const response = await api.post("/productos/estadisticas-stock-bajo", {});
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener movimientos de hoy
  async obtenerMovimientosHoy() {
    try {
      const response = await api.post("/movimientos/hoy", {});
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener total de proveedores
  async obtenerTotalProveedores() {
    try {
      const response = await api.post("/proveedores/total", {});
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Descargar reporte Excel de productos
  async descargarReporteExcel() {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/productos/reporte-excel`,
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

      return { success: true };
    } catch (error) {
      throw error;
    }
  },
};
