import { useEffect, useState } from "react";
import * as jwtDecode from "jwt-decode";

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const decoded = jwtDecode.default(token);
      const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos

      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        setIsAuthenticated(true);
      }
    } catch (err) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }, []);

  // Solo renderiza los componentes hijos si el usuario está autenticado
  if (!isAuthenticated) {
    return <div className="p-6 text-center">Verificando sesión...</div>;
  }
  return children;
}
