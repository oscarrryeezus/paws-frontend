"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";

export default function Navbar() {
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
  };

  // No mostrar navbar en la página de login o en la raíz
  if (pathname === "/login" || pathname === "/") {
    return null;
  }

  return (
    <nav className="bg-white border-b border-sky-200 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-sky-400 to-blue-500 p-2 rounded-lg shadow-md">
              <Package className="size-6 text-white" />
            </div>
            <span className="text-gray-900 font-bold text-xl">PAWS</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button
                variant={pathname === "/dashboard" ? "default" : "ghost"}
                size="sm"
                className={pathname === "/dashboard" ? "bg-sky-500 hover:bg-sky-600 text-white" : "text-gray-700 hover:text-sky-600 hover:bg-sky-50"}
              >
                <Home className="size-4" />
                Dashboard
              </Button>
            </Link>

            <Link href="/productos">
              <Button
                variant={pathname === "/productos" ? "default" : "ghost"}
                size="sm"
                className={pathname === "/productos" ? "bg-sky-500 hover:bg-sky-600 text-white" : "text-gray-700 hover:text-sky-600 hover:bg-sky-50"}
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
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
