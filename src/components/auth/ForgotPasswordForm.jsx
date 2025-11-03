"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordForm({ onSuccess, onBack }) {
  const [correo, setCorreo] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restablecerPassword/solicitarRecuperarPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          str_correo: correo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || "Error al solicitar recuperación de contraseña");
        return;
      }

      setSuccessMsg(data.mensaje || "Código de verificación enviado a tu correo");
      
      // Pasar al siguiente paso con el código (si está disponible en la respuesta)
      if (onSuccess) {
        onSuccess(correo, data.codigo);
      }
    } catch (error) {
      setErrorMsg("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-2xl">
        <CardHeader className="space-y-4 pb-6">
          <button
            onClick={onBack}
            className="flex items-center text-slate-400 hover:text-yellow-400 transition-colors duration-200 mb-2 self-start"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver al login
          </button>
          
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Mail className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
            Recuperar Contraseña
          </CardTitle>
          <p className="text-center text-slate-400 text-sm">
            Ingresa tu correo electrónico para recibir un código de verificación
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  type="email"
                  placeholder="usuario@empresa.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="pl-10 bg-white/5 border-slate-600 text-white placeholder-slate-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {errorMsg && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-200">
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}

            {successMsg && (
              <Alert className="bg-green-500/10 border-green-500/20 text-green-200">
                <AlertDescription>{successMsg}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando código...
                </>
              ) : (
                "Enviar Código de Verificación"
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-slate-400">
              Te enviaremos un código de 6 dígitos a tu correo electrónico
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}