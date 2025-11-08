"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import OtpForm from "@/components/auth/OtpForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function AuthPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState("login");
  const [userEmail, setUserEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isChecking, setIsChecking] = useState(true);

  // Verificar si el usuario ya está autenticado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Si ya tiene token, redirigir al dashboard
      router.replace("/dashboard");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  // Mostrar nada mientras verifica la autenticación
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100">
        <div className="text-gray-600">Cargando...</div>
      </div>
    );
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "login":
        return (
          <LoginForm
            onSuccess={(email) => {
              setUserEmail(email);
              setCurrentStep("otp");
            }}
            onForgotPassword={() => setCurrentStep("forgot-password")}
          />
        );
      case "otp":
        return (
          <OtpForm
            email={userEmail}
            onSuccess={() => (window.location.href = "/dashboard")}
            onBack={() => setCurrentStep("login")}
          />
        );
      case "forgot-password":
        return (
          <ForgotPasswordForm
            onSuccess={(email, token) => {
              setUserEmail(email);
              setResetToken(token);
              setCurrentStep("reset-password");
            }}
            onBack={() => setCurrentStep("login")}
          />
        );
      case "reset-password":
        return (
          <ResetPasswordForm
            email={userEmail}
            token={resetToken}
            onSuccess={() => setCurrentStep("login")}
            onBack={() => setCurrentStep("forgot-password")}
          />
        );
      default:
        return <LoginForm />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 p-4 relative">
      {/* Fondos decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">{renderCurrentStep()}</div>
    </div>
  );
}
