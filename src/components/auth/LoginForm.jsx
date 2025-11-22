"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function LoginForm({ onSuccess, onForgotPassword }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const data = await api.post("/login", {
        str_correo: correo,
        str_pass: password,
      });

      if (data.error) {
        setErrorMsg(data.error);
        return;
      }

      console.log(data);

      if (data.ok) {
        onSuccess(correo);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/dashboard";
      }
    } catch (error) {
      setErrorMsg(error.error || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl"
    >
      <Card className="bg-white border-sky-200 shadow-2xl">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">P</span>
            </div>
          </div>
          <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
            PAWS Inventario
          </CardTitle>
          <p className="text-center text-gray-600 text-sm">
            Ingresa tus credenciales para continuar
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="email"
                  placeholder="usuario@empresa.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="pl-10 bg-sky-50 border-sky-200 text-gray-900 placeholder-gray-400 focus:border-sky-400 focus:ring-sky-400/20 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-sky-50 border-sky-200 text-gray-900 placeholder-gray-400 focus:border-sky-400 focus:ring-sky-400/20 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-700">
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold py-2.5 px-4 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-gray-600 hover:text-sky-600 transition-colors duration-200"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <p className="text-gray-500 text-sm">
          © 2024 PAWS Inventario. Todos los derechos reservados.
        </p>
      </div>
    </motion.div>
  );
}