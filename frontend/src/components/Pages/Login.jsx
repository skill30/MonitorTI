import { useState, useEffect } from "react";

export default function Loginx() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Initialize Vanta.js effect
    if (typeof window.VANTA !== 'undefined') {
      window.VANTA.NET({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x4f46e5,
        backgroundColor: 0xf8fafc,
        points: 12.00,
        maxDistance: 20.00,
        spacing: 16.00
      });
    }
    
    // Initialize Feather icons
    if (typeof window.feather !== 'undefined') {
      window.feather.replace();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: username, password })
      });

      if (!response.ok) throw new Error("Credenciales inválidas");

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      window.location.href = "/main";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div id="vanta-bg" className="absolute w-full h-full"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="animate-bg bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 p-8 text-center">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shield">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">Monitor TI</h1>
            <p className="text-blue-100 mt-2">Centralización inteligente de datos de monitoreo</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8">
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            
            <div className="mb-6">
              <label htmlFor="username" className="block text-gray-700 text-sm font-medium mb-2">Nombre de usuario</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i data-feather="user" className="text-gray-400"></i>
                </div>
                <input 
                  type="text" 
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-highlight w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
                  placeholder="Nombre de usuario"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i data-feather="lock" className="text-gray-400"></i>
                </div>
                <input 
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-highlight w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-150 ease-in-out"
            >
              Iniciar sesión
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-gray-500 text-xs">
          <p>© 2023 Monitor TI. Todos los derechos reservados.</p>
          <p className="mt-1">Protegido por cifrado de grado bancario.</p>
        </div>
      </div>

      <style>{`
        .animate-bg {
          animation: gradientBG 15s ease infinite;
          background-size: 400% 400%;
        }
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .input-highlight {
          transition: all 0.3s ease;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
        }
        .input-highlight:focus {
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.4);
        }
      `}</style>
    </div>
  );
}
