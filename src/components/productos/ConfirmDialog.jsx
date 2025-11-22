"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ title, message, onConfirm, onCancel, loading = false }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white border-red-200 shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-3 rounded-full border border-red-200">
              <AlertTriangle className="size-6 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-gray-900">{title}</CardTitle>
              <CardDescription className="text-gray-600 mt-1">
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
            className="flex-1 bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 border border-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
