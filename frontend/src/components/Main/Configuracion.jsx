export default function Configuracion() {
  return (
    <div className="space-y-8">
      {/* Perfil de Usuario */}
      <section className="p-6 bg-white rounded-md shadow flex items-center space-x-6">
        <img
          src="https://i.pravatar.cc/100?img=12"
          alt="Foto de perfil"
          className="w-20 h-20 rounded-full border"
        />
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Perfil</h2>
          <p className="text-gray-600">Aquí puedes ver tu información personal.</p>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Nombre de usuario</span>
              <p className="text-lg font-semibold">admin_user</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Correo electrónico</span>
              <p className="text-lg font-semibold">admin@correo.com</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Rol</span>
              <p className="text-lg font-semibold">Administrador</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Último inicio de sesión</span>
              <p className="text-lg font-semibold">12/09/2025 - 10:45 AM</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gestión de VLANs */}
      <section className="p-6 bg-gray-100 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-4">Gestión de VLANs</h2>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Nombre de VLAN"
            className="px-3 py-2 border rounded-md flex-1"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Crear
          </button>
        </div>
        <ul className="mt-4 space-y-2">
          <li className="flex justify-between items-center bg-white p-3 rounded-md shadow">
            <span>VLAN-1</span>
            <button className="text-red-500 hover:text-red-700">Eliminar</button>
          </li>
          <li className="flex justify-between items-center bg-white p-3 rounded-md shadow">
            <span>VLAN-2</span>
            <button className="text-red-500 hover:text-red-700">Eliminar</button>
          </li>
        </ul>
      </section>

      {/* Configuración de Usuario */}
      <section className="p-6 bg-gray-100 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-4">Usuario</h2>
        <label className="block text-sm font-medium">Nombre de usuario</label>
        <input
          type="text"
          placeholder="Nuevo nombre de usuario"
          className="mt-2 px-3 py-2 border rounded-md w-full"
        />
        <label className="block text-sm font-medium mt-4">Correo</label>
        <input
          type="email"
          placeholder="usuario@correo.com"
          className="mt-2 px-3 py-2 border rounded-md w-full"
        />
        <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Guardar cambios
        </button>
      </section>

      <section className="p-6 bg-gray-100 rounded-md shadow">
              <h2 className="text-xl font-semibold">Preferencias del sistema</h2>
              <p className="text-sm text-gray-600">Personalice el comportamiento de la plataforma.</p>

              <div className="mt-4 flex items-center justify-between">
                <span>Modo oscuro</span>
                <button
                  type="button"
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300"
                >
                  <span className="sr-only">Toggle dark mode</span>
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1 transition" />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span>Notificaciones por correo</span>
                <button
                  type="button"
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300"
                >
                  <span className="sr-only">Toggle email notifications</span>
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1 transition" />
                </button>
              </div>
      </section>

      {/* Seguridad */}
      <section className="p-6 bg-gray-100 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-4">Seguridad</h2>
        <div className="space-y-3">
          <label className="block">
            <span className="text-sm font-medium">Cambiar contraseña</span>
            <input
              type="password"
              placeholder="Nueva contraseña"
              className="mt-1 px-3 py-2 border rounded-md w-full"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Confirmar contraseña</span>
            <input
              type="password"
              placeholder="Repite la contraseña"
              className="mt-1 px-3 py-2 border rounded-md w-full"
            />
          </label>
          <button className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Actualizar contraseña
          </button>
        </div>
      </section>
    </div>
  );
}
