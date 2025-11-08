"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">
          {producto ? "Editar Producto" : "Nuevo Producto"}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onCancel}
          className="text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="size-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="str_codigo" className="text-slate-300">
                Código *
              </Label>
              <Input
                id="str_codigo"
                name="str_codigo"
                value={formData.str_codigo}
                onChange={handleChange}
                required
                disabled={!!producto}
                placeholder="Ej: MOU123"
                className="bg-white/5 border-white/10 text-white placeholder-slate-400 focus:border-yellow-400 focus:ring-yellow-400/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="str_nombre" className="text-slate-300">
                Nombre *
              </Label>
              <Input
                id="str_nombre"
                name="str_nombre"
                value={formData.str_nombre}
                onChange={handleChange}
                required
                placeholder="Ej: Mouse Gamer RGB"
                className="bg-white/5 border-white/10 text-white placeholder-slate-400 focus:border-yellow-400 focus:ring-yellow-400/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="str_categoria" className="text-slate-300">
                Categoría *
              </Label>
              <Input
                id="str_categoria"
                name="str_categoria"
                value={formData.str_categoria}
                onChange={handleChange}
                required
                placeholder="Ej: Periféricos"
                className="bg-white/5 border-white/10 text-white placeholder-slate-400 focus:border-yellow-400 focus:ring-yellow-400/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="str_unidad" className="text-slate-300">
                Unidad *
              </Label>
              <Input
                id="str_unidad"
                name="str_unidad"
                value={formData.str_unidad}
                onChange={handleChange}
                required
                placeholder="Ej: pieza, caja, kg"
                className="bg-white/5 border-white/10 text-white placeholder-slate-400 focus:border-yellow-400 focus:ring-yellow-400/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="int_stock_minimo" className="text-slate-300">
                Stock Mínimo *
              </Label>
              <Input
                id="int_stock_minimo"
                name="int_stock_minimo"
                type="number"
                min="0"
                value={formData.int_stock_minimo}
                onChange={handleChange}
                required
                className="bg-white/5 border-white/10 text-white placeholder-slate-400 focus:border-yellow-400 focus:ring-yellow-400/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="int_stock_actual" className="text-slate-300">
                Stock Actual *
              </Label>
              <Input
                id="int_stock_actual"
                name="int_stock_actual"
                type="number"
                min="0"
                value={formData.int_stock_actual}
                onChange={handleChange}
                required
                className="bg-white/5 border-white/10 text-white placeholder-slate-400 focus:border-yellow-400 focus:ring-yellow-400/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="str_descripcion" className="text-slate-300">
              Descripción
            </Label>
            <textarea
              id="str_descripcion"
              name="str_descripcion"
              value={formData.str_descripcion}
              onChange={handleChange}
              rows={3}
              placeholder="Descripción detallada del producto..."
              className="w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? "Guardando..." : producto ? "Actualizar" : "Crear Producto"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
