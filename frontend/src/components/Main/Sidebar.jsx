import { Home, BarChart2, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav className="space-y-4">
        <a href="#" className="flex items-center space-x-2 hover:text-gray-300">
          <Home size={18} /> <span>Inicio</span>
        </a>

        <a href="/reportes" className="flex items-center space-x-2 hover:text-gray-300">
          <BarChart2 size={18} /> <span>Reportes</span>
        </a>

        <a href="/configuracion" className="flex items-center space-x-2 hover:text-gray-300">
          <Settings size={20} /> <span>Configuración</span>
        </a>
      </nav>
    </aside>
  );
}
 