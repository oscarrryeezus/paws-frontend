"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Redirigir a la página principal de autenticación
export default function LoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <p className="text-white">Redirigiendo...</p>
    </div>
  );
}
