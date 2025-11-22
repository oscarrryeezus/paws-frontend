import api from "./api";

/**
 * Servicio para gestión de productos
 */
export const productosService = {
  /**
   * Listar todos los productos
   * @param {Object} filtros - Filtros opcionales (bool_activo, str_categoria, etc)
   * @returns {Promise<Object>} - { success: boolean, data: Array }
   */
  listar: async (filtros = {}) => {
    return await api.post("/productos/listar", filtros);
  },

  /**
   * Obtener un producto por código
   * @param {string} codigo - Código del producto
   * @returns {Promise<Object>} - { success: boolean, data: Object }
   */
  obtener: async (codigo) => {
    return await api.post("/productos/obtener", { str_codigo: codigo });
  },

  /**
   * Registrar un nuevo producto
   * @param {Object} producto - Datos del producto
   * @returns {Promise<Object>} - { success: boolean, mensaje: string, data: Object }
   */
  registrar: async (producto) => {
    return await api.post("/productos/registrar", producto);
  },

  /**
   * Actualizar un producto existente
   * @param {string} codigo - Código del producto
   * @param {Object} cambios - Datos a actualizar
   * @returns {Promise<Object>} - { success: boolean, mensaje: string, data: Object }
   */
  actualizar: async (codigo, cambios) => {
    return await api.put("/productos/actualizar", {
      str_codigo: codigo,
      ...cambios,
    });
  },

  /**
   * Eliminar un producto (eliminación lógica)
   * @param {string} codigo - Código del producto
   * @returns {Promise<Object>} - { success: boolean, mensaje: string }
   */
  eliminar: async (codigo) => {
    return await api.post("/productos/eliminar", { str_codigo: codigo });
  },

  /**
   * Listar productos por categoría
   * @param {string} categoria - Categoría a filtrar
   * @returns {Promise<Object>} - { success: boolean, data: Array }
   */
  porCategoria: async (categoria) => {
    return await api.post("/productos/por-categoria", {
      str_categoria: categoria,
    });
  },

  /**
   * Listar productos con bajo stock
   * @returns {Promise<Object>} - { success: boolean, data: Array }
   */
  bajoStock: async () => {
    return await api.post("/productos/bajo-stock", {});
  },

  /**
   * Registrar entrada de stock
   * @param {string} codigo - Código del producto
   * @param {number} cantidad - Cantidad a agregar
   * @returns {Promise<Object>} - { success: boolean, mensaje: string, data: Object }
   */
  entrada: async (codigo, cantidad) => {
    return await api.post("/productos/entrada", {
      str_codigo: codigo,
      cantidad,
    });
  },

  /**
   * Registrar salida de stock
   * @param {string} codigo - Código del producto
   * @param {number} cantidad - Cantidad a restar
   * @returns {Promise<Object>} - { success: boolean, mensaje: string, data: Object }
   */
  salida: async (codigo, cantidad) => {
    return await api.post("/productos/salida", {
      str_codigo: codigo,
      cantidad,
    });
  },
};
