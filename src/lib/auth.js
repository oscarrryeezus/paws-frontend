import api from "./api";

export async function login(email, password) {
  const res = await api.post("/auth/login", { str_correo, str_pass });
  return res.data;
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

export function getToken() {
  return localStorage.getItem("token");
}

export async function verificarEmail(email, codigo) {
  const res = await api.post('/login/otp', { email, codigo });
  return res.data;
}

export async function logout() {
  try {
    await api.post("/logout"); 
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }
}