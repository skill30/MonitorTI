import { useEffect } from "react";
import * as jwtDecode from "jwt-decode";

export default function ProtectedRoute({ children }) {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const decoded = jwtDecode.default(token);
      if (decoded.exp < currentTime) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    } catch (err) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }, []);

  return <>{children}</>;
}
