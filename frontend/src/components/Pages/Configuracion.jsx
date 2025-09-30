import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import feather from "feather-icons";

export default function ConfiguracionPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    actual: false,
    nueva: false,
    confirmar: false,
  });

  // Detectar preferencia inicial
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      setDarkMode(JSON.parse(saved));
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Aplicar dark mode al <html> y guardar en localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
    feather.replace();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white flex items-center justify-center py-10">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Configuración del Sistema
        </h1>

        <div className="space-y-6">
          {/* Perfil de Usuario */}
          <section
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md"
            data-aos="fade-up"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <img
                  src="https://i.pravatar.cc/150?img=12"
                  alt="Foto de perfil"
                  className="w-24 h-24 rounded-full border-4 border-blue-100 dark:border-gray-600"
                />
                <button className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg">
                  <i data-feather="edit-2" className="w-4 h-4"></i>
                </button>
              </div>
              <div className="flex-1 w-full">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  Perfil de Usuario
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Administra tu información personal y credenciales
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Nombre de usuario
                    </span>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      admin_user
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Correo electrónico
                    </span>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      admin@correo.com
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Rol
                    </span>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      Administrador
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Último inicio
                    </span>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                      12/09/2025 - 10:45 AM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Preferencias del sistema */}
          <section
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md"
            data-aos="fade-up"
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Preferencias del sistema
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Personalice el comportamiento de la plataforma
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">
                    Modo oscuro
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Cambiar el tema de la interfaz
                  </p>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Seguridad */}
          <section
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md"
            data-aos="fade-up"
          >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Seguridad
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contraseña actual
              </label>
              <div className="relative">
                <input
                  type={showPasswords.actual ? "text" : "password"}
                  placeholder="••••••••"
                  className="mt-1 px-4 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      actual: !prev.actual,
                    }))
                  }
                >
                  <i
                    data-feather={showPasswords.actual ? "eye-off" : "eye"}
                    className="w-5 h-5"
                  ></i>
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
