"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Package, AlertTriangle } from "lucide-react";

export default function ProductoCard({ producto, onEdit, onDelete }) {
  const isBajoStock = producto.int_stock_actual <= producto.int_stock_minimo;

  return (
    <Card className="bg-white border-sky-200 hover:border-sky-400 shadow-md hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Package className="size-5 text-sky-500" />
              {producto.str_nombre}
            </CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              Código: {producto.str_codigo}
            </CardDescription>
          </div>
          {isBajoStock && (
            <div className="bg-orange-100 p-2 rounded-lg">
              <AlertTriangle className="size-5 text-orange-500" title="Stock bajo" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-sky-50 p-3 rounded-lg border border-sky-100">
            <p className="text-gray-600 text-xs">Categoría</p>
            <p className="text-gray-900 font-medium mt-1">{producto.str_categoria || "N/A"}</p>
          </div>
          <div className="bg-sky-50 p-3 rounded-lg border border-sky-100">
            <p className="text-gray-600 text-xs">Unidad</p>
            <p className="text-gray-900 font-medium mt-1">{producto.str_unidad || "N/A"}</p>
          </div>
          <div className="bg-sky-50 p-3 rounded-lg border border-sky-100">
            <p className="text-gray-600 text-xs">Stock Actual</p>
            <p className={`font-bold mt-1 ${isBajoStock ? "text-orange-600" : "text-emerald-600"}`}>
              {producto.int_stock_actual}
            </p>
          </div>
          <div className="bg-sky-50 p-3 rounded-lg border border-sky-100">
            <p className="text-gray-600 text-xs">Stock Mínimo</p>
            <p className="text-gray-900 font-medium mt-1">{producto.int_stock_minimo}</p>
          </div>
        </div>

        {producto.str_descripcion && (
          <div className="pt-2 border-t border-gray-200">
            <p className="text-gray-600 text-xs">Descripción</p>
            <p className="text-gray-800 text-sm line-clamp-2 mt-1">{producto.str_descripcion}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100 hover:border-sky-300 hover:text-sky-800 transition-all duration-200"
            onClick={() => onEdit(producto)}
          >
            <Pencil className="size-4" />
            Editar
          </Button>
          <Button
            size="sm"
            className="bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200"
            onClick={() => onDelete(producto)}
          >
            <Trash2 className="size-4" />
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
