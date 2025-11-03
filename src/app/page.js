"use client";

import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import OtpForm from "@/components/auth/OtpForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function AuthPage() {
  const [currentStep, setCurrentStep] = useState("login");
  const [userEmail, setUserEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

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
            onSuccess={() => window.location.href = "/dashboard"}
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative">
      {/* Fondos decorativos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      {renderCurrentStep()}
    </div>
  );
}