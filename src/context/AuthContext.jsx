"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { getToken, logout } from "@/lib/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    // Aquí podrías decodificar JWT si quieres extraer datos
    setUser({ token });
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
