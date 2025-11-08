"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // No mostrar navbar en la página de login o en la raíz
  if (pathname === "/login" || pathname === "/") {
    return null;
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Package className="size-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl">PAWS</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button
                variant={pathname === "/dashboard" ? "default" : "ghost"}
                size="sm"
                className={pathname === "/dashboard" ? "bg-blue-600" : "text-gray-300"}
              >
                <Home className="size-4" />
                Dashboard
              </Button>
            </Link>

            <Link href="/productos">
              <Button
                variant={pathname === "/productos" ? "default" : "ghost"}
                size="sm"
                className={pathname === "/productos" ? "bg-blue-600" : "text-gray-300"}
              >
                <Package className="size-4" />
                Productos
              </Button>
            </Link>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
            >
              <LogOut className="size-4" />
              Salir
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
