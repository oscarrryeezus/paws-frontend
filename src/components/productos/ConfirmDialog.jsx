"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ title, message, onConfirm, onCancel, loading = false }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white/5 backdrop-blur-md border-red-500/30 shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-red-500/20 p-3 rounded-full border border-red-500/30">
              <AlertTriangle className="size-6 text-red-400" />
            </div>
            <div>
              <CardTitle className="text-white">{title}</CardTitle>
              <CardDescription className="text-slate-400 mt-1">
                {message}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-500/80 border border-red-500 text-white hover:bg-red-500 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
