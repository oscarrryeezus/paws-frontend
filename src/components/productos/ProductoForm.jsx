"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, AlertCircle } from "lucide-react";

export default function ProductoForm({ producto, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    str_codigo: "",
    str_nombre: "",
    str_descripcion: "",
    str_categoria: "",
    str_unidad: "pieza",
    int_stock_minimo: 0,
    int_stock_actual: 0,
    bool_activo: true,
  });

  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (producto) {
      setFormData({
        str_codigo: producto.str_codigo || "",
        str_nombre: producto.str_nombre || "",
        str_descripcion: producto.str_descripcion || "",
        str_categoria: producto.str_categoria || "",
        str_unidad: producto.str_unidad || "pieza",
        int_stock_minimo: producto.int_stock_minimo || 0,
        int_stock_actual: producto.int_stock_actual || 0,
        bool_activo: producto.bool_activo !== undefined ? producto.bool_activo : true,
      });
    }
  }, [producto]);

  // Funciones de validación según la guía
  const validarCampo = (nombre, valor) => {
    const nuevosErrores = { ...errores };

    switch (nombre) {
      case "str_nombre":
        if (!valor) {
          nuevosErrores.str_nombre = "El nombre es obligatorio";
        } else if (valor.length < 3) {
          nuevosErrores.str_nombre = "El nombre debe tener al menos 3 caracteres";
        } else if (valor.length > 50) {
          nuevosErrores.str_nombre = "El nombre no puede exceder los 50 caracteres";
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/.test(valor)) {
          nuevosErrores.str_nombre = "El nombre solo puede contener letras, números y espacios";
        } else {
          delete nuevosErrores.str_nombre;
        }
        break;

      case "str_codigo":
        if (!valor) {
          nuevosErrores.str_codigo = "El código del producto es obligatorio";
        } else if (valor.length < 3) {
          nuevosErrores.str_codigo = "El código debe tener al menos 3 caracteres";
        } else if (valor.length > 20) {
          nuevosErrores.str_codigo = "El código no puede exceder los 20 caracteres";
        } else if (!/^[A-Za-z0-9]+$/.test(valor)) {
          nuevosErrores.str_codigo = "El código solo puede contener letras y números sin espacios ni caracteres especiales";
        } else {
          delete nuevosErrores.str_codigo;
        }
        break;

      case "str_descripcion":
        if (!valor) {
          nuevosErrores.str_descripcion = "La descripción es obligatoria";
        } else if (valor.length < 10) {
          nuevosErrores.str_descripcion = "La descripción debe tener al menos 10 caracteres";
        } else if (valor.length > 200) {
          nuevosErrores.str_descripcion = "La descripción no puede exceder los 200 caracteres";
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,;:\-()]+$/.test(valor)) {
          nuevosErrores.str_descripcion = "La descripción solo puede contener letras, números, espacios y signos de puntuación básicos";
        } else {
          delete nuevosErrores.str_descripcion;
        }
        break;

      case "str_categoria":
        if (!valor) {
          nuevosErrores.str_categoria = "La categoría es obligatoria";
        } else if (valor.length < 3) {
          nuevosErrores.str_categoria = "La categoría debe tener al menos 3 caracteres";
        } else if (valor.length > 30) {
          nuevosErrores.str_categoria = "La categoría no puede exceder los 30 caracteres";
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(valor)) {
          nuevosErrores.str_categoria = "La categoría solo puede contener letras y espacios";
        } else {
          delete nuevosErrores.str_categoria;
        }
        break;

      case "str_unidad":
        if (!valor) {
          nuevosErrores.str_unidad = "La unidad es obligatoria";
        } else if (valor.length < 1) {
          nuevosErrores.str_unidad = "La unidad debe tener al menos 1 carácter";
        } else if (valor.length > 15) {
          nuevosErrores.str_unidad = "La unidad no puede exceder los 15 caracteres";
        } else {
          delete nuevosErrores.str_unidad;
        }
        break;

      case "int_stock_minimo":
      case "int_stock_actual":
        const num = parseInt(valor, 10);
        if (isNaN(num)) {
          nuevosErrores[nombre] = "Debe ser un número entero";
        } else if (num < 0) {
          nuevosErrores[nombre] = "No puede ser negativo";
        } else if (!Number.isInteger(parseFloat(valor))) {
          nuevosErrores[nombre] = "Debe ser un número entero sin decimales";
        } else {
          delete nuevosErrores[nombre];
        }
        break;

      default:
        break;
    }

    setErrores(nuevosErrores);
    return nuevosErrores;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === "number" ? value : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    
    // Validar el campo al escribir
    validarCampo(name, newValue);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validarCampo(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar todos los campos antes de enviar
    let todosLosErrores = {};
    Object.keys(formData).forEach((key) => {
      if (key !== 'bool_activo') {
        const erroresDelCampo = validarCampo(key, formData[key]);
        todosLosErrores = { ...todosLosErrores, ...erroresDelCampo };
      }
    });

    // Si hay errores, no enviar
    if (Object.keys(todosLosErrores).length > 0) {
      setErrores(todosLosErrores);
      return;
    }

    setLoading(true);
    try {
      // Convertir valores numéricos antes de enviar
      const dataToSubmit = {
        ...formData,
        int_stock_minimo: parseInt(formData.int_stock_minimo, 10),
        int_stock_actual: parseInt(formData.int_stock_actual, 10),
      };
      await onSubmit(dataToSubmit);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white border-sky-200 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-gray-900">
          {producto ? "Editar Producto" : "Nuevo Producto"}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <X className="size-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="str_codigo" className="text-gray-700">
                Código *
              </Label>
              <Input
                id="str_codigo"
                name="str_codigo"
                value={formData.str_codigo}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                disabled={!!producto}
                placeholder="Ej: MOU123"
                className={`bg-sky-50 text-gray-900 placeholder-gray-400 focus:border-sky-400 focus:ring-sky-400/20 ${
                  errores.str_codigo ? 'border-red-400' : 'border-sky-200'
                }`}
              />
              {errores.str_codigo && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="size-3" />
                  {errores.str_codigo}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="str_nombre" className="text-gray-700">
                Nombre *
              </Label>
              <Input
                id="str_nombre"
                name="str_nombre"
                value={formData.str_nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                placeholder="Ej: Mouse Gamer RGB"
                className={`bg-sky-50 text-gray-900 placeholder-gray-400 focus:border-sky-400 focus:ring-sky-400/20 ${
                  errores.str_nombre ? 'border-red-400' : 'border-sky-200'
                }`}
              />
              {errores.str_nombre && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="size-3" />
                  {errores.str_nombre}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="str_categoria" className="text-gray-700">
                Categoría *
              </Label>
              <Input
                id="str_categoria"
                name="str_categoria"
                value={formData.str_categoria}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                placeholder="Ej: Periféricos"
                className={`bg-sky-50 text-gray-900 placeholder-gray-400 focus:border-sky-400 focus:ring-sky-400/20 ${
                  errores.str_categoria ? 'border-red-400' : 'border-sky-200'
                }`}
              />
              {errores.str_categoria && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="size-3" />
                  {errores.str_categoria}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="str_unidad" className="text-gray-700">
                Unidad *
              </Label>
              <Input
                id="str_unidad"
                name="str_unidad"
                value={formData.str_unidad}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                placeholder="Ej: pieza, caja, kg"
                className={`bg-sky-50 text-gray-900 placeholder-gray-400 focus:border-sky-400 focus:ring-sky-400/20 ${
                  errores.str_unidad ? 'border-red-400' : 'border-sky-200'
                }`}
              />
              {errores.str_unidad && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="size-3" />
                  {errores.str_unidad}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="int_stock_minimo" className="text-gray-700">
                Stock Mínimo *
              </Label>
              <Input
                id="int_stock_minimo"
                name="int_stock_minimo"
                type="number"
                min="0"
                value={formData.int_stock_minimo}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={`bg-sky-50 text-gray-900 placeholder-gray-400 focus:border-sky-400 focus:ring-sky-400/20 ${
                  errores.int_stock_minimo ? 'border-red-400' : 'border-sky-200'
                }`}
              />
              {errores.int_stock_minimo && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="size-3" />
                  {errores.int_stock_minimo}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="int_stock_actual" className="text-gray-700">
                Stock Actual *
              </Label>
              <Input
                id="int_stock_actual"
                name="int_stock_actual"
                type="number"
                min="0"
                value={formData.int_stock_actual}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className={`bg-sky-50 text-gray-900 placeholder-gray-400 focus:border-sky-400 focus:ring-sky-400/20 ${
                  errores.int_stock_actual ? 'border-red-400' : 'border-sky-200'
                }`}
              />
              {errores.int_stock_actual && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="size-3" />
                  {errores.int_stock_actual}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="str_descripcion" className="text-gray-700">
              Descripción *
            </Label>
            <textarea
              id="str_descripcion"
              name="str_descripcion"
              value={formData.str_descripcion}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              rows={3}
              placeholder="Descripción detallada del producto..."
              className={`w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/20 bg-sky-50 ${
                errores.str_descripcion ? 'border-red-400' : 'border-sky-200'
              }`}
            />
            {errores.str_descripcion && (
              <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="size-3" />
                {errores.str_descripcion}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? "Guardando..." : producto ? "Actualizar" : "Crear Producto"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
