import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import feather from "feather-icons";

export default function ConfiguracionPage() {
  const [showPasswords, setShowPasswords] = useState({
    actual: false,
    nueva: false,
    confirmar: false,
  });
  const [users, setUsers] = useState([]);
  const [profile, setProfile] = useState(null); // usuario de sesión mostrado en perfil
  const [editUser, setEditUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_USERS = "/api/usuarios/";

  // Intenta obtener el nombre de usuario actual desde localStorage o token JWT
  const getCurrentUsername = () => {
    try {
      // formato: localStorage.setItem('user', JSON.stringify({nombre: 'Abel'}))
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        const u = JSON.parse(rawUser);
        if (u && u.nombre) return u.nombre;
      }

      // revisar tokens comunes
      const token = localStorage.getItem("access_token") || localStorage.getItem("token");
      if (!token) return null;

      // decodificar JWT (payload)
      const parts = token.split(".");
      if (parts.length < 2) return null;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      // buscar claim sub o nombre
      return payload.sub || payload.nombre || payload.username || null;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
    feather.replace();

    (async () => {
      try {
        const res = await fetch(API_USERS);
        if (!res.ok) return;
        const data = await res.json();

        const currentName = getCurrentUsername();
        // determinar perfil: si hay usuario de sesión, usar ese; si no, usar el primero
        let profileUser = null;
        if (currentName) {
          profileUser = data.find((u) => u.nombre === currentName) || null;
        }
        if (!profileUser) profileUser = data[0] || null;

        // lista de usuarios: excluir el usuario de sesión (por nombre si existe) o el perfil mostrado
        const excludedName = profileUser?.nombre ?? currentName;
        const filtered = data.filter((u) => u.nombre !== excludedName);

        setProfile(profileUser);
        setUsers(filtered);
      } catch (e) {
        // silent
      }
    })();

    return () => {
      if (window._vantaEffect?.destroy) window._vantaEffect.destroy();
    };
  }, []);

  // abrir modal de edición con copia del usuario
  const abrirEditar = (u) => {
    setEditUser({ ...u });
    setIsModalOpen(true);
    setTimeout(() => feather.replace(), 0);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEditUser(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUser((p) => ({ ...p, [name]: value }));
  };

  const guardarEdicion = async () => {
    if (!editUser || !editUser.id) return;
    try {
      const res = await fetch(`${API_USERS}${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editUser),
      });
      if (!res.ok) throw new Error("Error guardando usuario");
      const updated = await res.json();

      // Si hemos editado el usuario de perfil, actualizar perfil
      if (profile && profile.id === updated.id) {
        setProfile(updated);
      } else {
        // actualizar lista de usuarios (excluimos usuario de sesión)
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      }

      cerrarModal();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 pt-16">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">Configuración del Sistema</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Perfil */}
          <section className="bg-white rounded-xl shadow-md p-6" data-aos="fade-up">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src="https://i.pravatar.cc/150?img=12"
                  alt="avatar"
                  className="w-28 h-28 rounded-full border-4 border-indigo-100 object-cover"
                />
                <button
                  onClick={() => document.getElementById("file-input")?.click()}
                  className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition"
                >
                  <i data-feather="edit-2" className="w-4 h-4"></i>
                </button>
                <input id="file-input" type="file" className="hidden" accept="image/*" />
              </div>

              <h3 className="mt-4 text-lg font-semibold">{profile?.nombre ?? "—"}</h3>
              <span className="mt-1 text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {profile?.rol ?? "—"}
              </span>

              <div className="w-full mt-6 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Nombre de usuario</label>
                  <p className="mt-1 font-semibold">{profile?.nombre ?? "—"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Rol</label>
                  <p className="mt-1 font-semibold">{profile?.rol ?? "—"}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Preferencias y seguridad (centro) */}
          <section className="col-span-2 bg-white rounded-xl shadow-md p-6" data-aos="fade-up">
            <h2 className="text-xl font-semibold mb-4">Preferencias y Seguridad</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Preferencias</h3>
                  <p className="text-sm text-gray-500">Ajustes generales</p>
                </div>
                <div className="text-sm text-gray-400">—</div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium mb-2">Cambiar contraseña</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Contraseña actual</label>
                    <div className="relative">
                      <input type={showPasswords.actual ? "text" : "password"} placeholder="••••••••" className="mt-1 px-4 py-2 border rounded-lg w-full" />
                      <button type="button" onClick={() => setShowPasswords((p) => ({ ...p, actual: !p.actual }))} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <i data-feather={showPasswords.actual ? "eye-off" : "eye"} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Nueva contraseña</label>
                      <div className="relative">
                        <input type={showPasswords.nueva ? "text" : "password"} placeholder="••••••••" className="mt-1 px-4 py-2 border rounded-lg w-full" />
                        <button type="button" onClick={() => setShowPasswords((p) => ({ ...p, nueva: !p.nueva }))} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          <i data-feather={showPasswords.nueva ? "eye-off" : "eye"} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-600">Confirmar contraseña</label>
                      <div className="relative">
                        <input type={showPasswords.confirmar ? "text" : "password"} placeholder="••••••••" className="mt-1 px-4 py-2 border rounded-lg w-full" />
                        <button type="button" onClick={() => setShowPasswords((p) => ({ ...p, confirmar: !p.confirmar }))} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          <i data-feather={showPasswords.confirmar ? "eye-off" : "eye"} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Guardar cambios</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Usuarios */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Gestión de usuarios</h3>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2">
                  <i data-feather="plus" className="w-4 h-4" /> Nuevo Usuario
                </button>
              </div>

              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Nombre</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Rol</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="px-4 py-6 text-center text-sm text-gray-500">No hay usuarios</td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="border-t">
                          <td className="px-4 py-3">{u.nombre}</td>
                          <td className="px-4 py-3">{u.rol ?? "—"}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => abrirEditar(u)} className="text-indigo-600 hover:underline mr-3">Editar</button>
                            <button className="text-red-600 hover:underline">Eliminar</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modal edición usuario */}
      {isModalOpen && editUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Editar usuario</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600">Nombre</label>
                <input name="nombre" value={editUser.nombre || ""} onChange={handleEditChange} className="mt-1 px-3 py-2 border rounded w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Rol</label>
                <select name="rol" value={editUser.rol || ""} onChange={handleEditChange} className="mt-1 px-3 py-2 border rounded w-full">
                  <option value="">-- seleccionar --</option>
                  <option value="admin">admin</option>
                  <option value="user">user</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button onClick={cerrarModal} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
                <button onClick={guardarEdicion} className="px-4 py-2 bg-indigo-600 text-white rounded">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
