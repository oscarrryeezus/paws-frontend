"use client";
import { useState } from "react";
import { login } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Credenciales inválidas o servidor no disponible");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Card className="w-full max-w-sm shadow-lg border border-gray-700">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-center text-white">Iniciar Sesión</h2>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input placeholder="Correo electrónico" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Entrar</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
