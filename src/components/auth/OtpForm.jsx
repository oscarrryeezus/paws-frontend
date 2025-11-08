"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { KeyRound, Loader2, ArrowLeft } from "lucide-react";

export default function OtpForm({ email, onSuccess, onBack }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login/otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          str_correo: email,
          str_codigo: otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || "Código OTP inválido o expirado");
        return;
      }

      localStorage.setItem("token", data.token);
      if (onSuccess) onSuccess();
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
      className="w-full max-w-xl"
    >
      <Card className="bg-white border-sky-200 shadow-2xl">
        <CardHeader className="space-y-4 pb-6">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-sky-600 transition-colors duration-200 mb-2 self-start"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver al login
          </button>
          
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <KeyRound className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
            Verificación OTP
          </CardTitle>
          <p className="text-center text-gray-600 text-sm">
            Ingresa el código OTP enviado a tu correo
          </p>
          <p className="text-center text-gray-700 text-xs">
            Enviado a: <span className="text-sky-600 font-medium">{email}</span>
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código OTP
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Ingresa tu código"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="pl-10 bg-sky-50 border-sky-200 text-gray-900 placeholder-gray-400 focus:border-emerald-400 focus:ring-emerald-400/20 transition-all duration-200"
                  required
                />
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
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-2.5 px-4 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar Código"
              )}
            </button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}