export default function Header() {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">Panel de Monitoreo</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Usuario: Admin</span>
      </div>
    </header>
  );
}