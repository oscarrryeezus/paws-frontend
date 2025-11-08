"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, AlertTriangle, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      router.push("/");
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">
            Bienvenido, {user?.nombre || "Usuario"}
          </h1>
          <p className="text-gray-400 mt-1">
            Sistema de Gestión de Inventario PAWS
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-gray-700 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-sm font-medium">
                  Total Productos
                </CardTitle>
                <Package className="size-5 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">-</div>
              <p className="text-gray-400 text-xs mt-1">Productos activos</p>
            </CardContent>
          </Card>

          <Card className="border-gray-700 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-sm font-medium">
                  Stock Bajo
                </CardTitle>
                <AlertTriangle className="size-5 text-yellow-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-400">-</div>
              <p className="text-gray-400 text-xs mt-1">Requieren atención</p>
            </CardContent>
          </Card>

          <Card className="border-gray-700 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-sm font-medium">
                  Movimientos Hoy
                </CardTitle>
                <TrendingUp className="size-5 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400">-</div>
              <p className="text-gray-400 text-xs mt-1">Entradas/Salidas</p>
            </CardContent>
          </Card>

          <Card className="border-gray-700 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-sm font-medium">
                  Proveedores
                </CardTitle>
                <Users className="size-5 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-400">-</div>
              <p className="text-gray-400 text-xs mt-1">Proveedores activos</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Acciones Rápidas</CardTitle>
              <CardDescription className="text-gray-400">
                Accede a las funciones principales del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/productos">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Package className="size-4" />
                  Gestionar Productos
                </Button>
              </Link>
              <Button variant="outline" className="w-full" disabled>
                <TrendingUp className="size-4" />
                Ver Movimientos
              </Button>
              <Button variant="outline" className="w-full" disabled>
                <Users className="size-4" />
                Proveedores
              </Button>
              <Button variant="outline" className="w-full" disabled>
                <AlertTriangle className="size-4" />
                Alertas
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Actividad Reciente</CardTitle>
              <CardDescription className="text-gray-400">
                Últimos movimientos en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-400 text-sm text-center py-8">
                  No hay actividad reciente
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
