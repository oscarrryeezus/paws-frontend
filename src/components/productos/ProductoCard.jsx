"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Package, AlertTriangle } from "lucide-react";

export default function ProductoCard({ producto, onEdit, onDelete }) {
  const isBajoStock = producto.int_stock_actual <= producto.int_stock_minimo;

  return (
    <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:border-yellow-400/30 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-white flex items-center gap-2">
              <Package className="size-5 text-yellow-400" />
              {producto.str_nombre}
            </CardTitle>
            <CardDescription className="text-slate-400 mt-1">
              Código: {producto.str_codigo}
            </CardDescription>
          </div>
          {isBajoStock && (
            <div className="bg-yellow-500/10 p-2 rounded-lg">
              <AlertTriangle className="size-5 text-yellow-500" title="Stock bajo" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white/5 p-3 rounded-lg">
            <p className="text-slate-400 text-xs">Categoría</p>
            <p className="text-white font-medium mt-1">{producto.str_categoria || "N/A"}</p>
          </div>
          <div className="bg-white/5 p-3 rounded-lg">
            <p className="text-slate-400 text-xs">Unidad</p>
            <p className="text-white font-medium mt-1">{producto.str_unidad || "N/A"}</p>
          </div>
          <div className="bg-white/5 p-3 rounded-lg">
            <p className="text-slate-400 text-xs">Stock Actual</p>
            <p className={`font-bold mt-1 ${isBajoStock ? "text-yellow-500" : "text-green-400"}`}>
              {producto.int_stock_actual}
            </p>
          </div>
          <div className="bg-white/5 p-3 rounded-lg">
            <p className="text-slate-400 text-xs">Stock Mínimo</p>
            <p className="text-white font-medium mt-1">{producto.int_stock_minimo}</p>
          </div>
        </div>

        {producto.str_descripcion && (
          <div className="pt-2 border-t border-white/10">
            <p className="text-slate-400 text-xs">Descripción</p>
            <p className="text-slate-300 text-sm line-clamp-2 mt-1">{producto.str_descripcion}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 bg-white/5 border-white/10 text-white hover:bg-yellow-400/10 hover:border-yellow-400/30 hover:text-yellow-400 transition-all duration-200"
            onClick={() => onEdit(producto)}
          >
            <Pencil className="size-4" />
            Editar
          </Button>
          <Button
            size="sm"
            className="bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all duration-200"
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
