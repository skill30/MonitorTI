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
  const [profile, setProfile] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [newUser, setNewUser] = useState({ nombre: "", rol: "", password: "" });
  const [passChange, setPassChange] = useState({ nueva: "", confirmar: "" });
  const API_USERS = "/api/usuarios/";

  const getCurrentUsername = () => {
    try {
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        const u = JSON.parse(rawUser);
        if (u && u.nombre) return u.nombre;
      }
      const token = localStorage.getItem("access_token") || localStorage.getItem("token");
      if (!token) return null;
      const parts = token.split(".");
      if (parts.length < 2) return null;
      const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
      return payload.sub || payload.nombre || payload.username || null;
    } catch (e) {
      return null;
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(API_USERS);
      if (!res.ok) return;
      const data = await res.json();
      const currentName = getCurrentUsername();
      let profileUser = null;
      if (currentName) profileUser = data.find((u) => u.nombre === currentName) || null;
      if (!profileUser) profileUser = data[0] || null;
      const excludedName = profileUser?.nombre ?? currentName;
      const filtered = data.filter((u) => u.nombre !== excludedName);
      setProfile(profileUser);
      setUsers(filtered);
    } catch (e) {}
  };

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
    feather.replace();
    fetchUsers();
    return () => {
      if (window._vantaEffect?.destroy) window._vantaEffect.destroy();
    };
  }, []);

  const abrirEditar = (u) => {
    setEditUser({ ...u });
    setIsModalOpen(true);
    setTimeout(() => feather.replace(), 0);
  };
  const abrirNuevo = () => {
    setNewUser({ nombre: "", rol: "", password: "" });
    setIsNewOpen(true);
    setTimeout(() => feather.replace(), 0);
  };
  const cerrarModal = () => {
    setIsModalOpen(false);
    setEditUser(null);
  };
  const cerrarNuevo = () => {
    setIsNewOpen(false);
    setNewUser({ nombre: "", rol: "", password: "" });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUser((p) => ({ ...p, [name]: value }));
  };
  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewUser((p) => ({ ...p, [name]: value }));
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
      if (profile && profile.id === updated.id) setProfile(updated);
      else setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      cerrarModal();
    } catch (err) {
      console.error(err);
    }
  };

  const guardarNuevo = async () => {
    if (!newUser.nombre || !newUser.password) return alert("Nombre y contraseña requeridos");
    try {
      const res = await fetch(API_USERS + "register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Error creando usuario");
      }
      const created = await res.json();
      // si no hay perfil asignado, y el creador es el actual, recargar; en cualquier caso refrescar lista
      await fetchUsers();
      cerrarNuevo();
    } catch (err) {
      console.error(err);
      alert("Error creando usuario");
    }
  };

  const eliminarUsuario = async (id) => {
    if (!confirm("Eliminar usuario?")) return;
    try {
      const res = await fetch(`${API_USERS}${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error eliminando");
      // refrescar lista
      await fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Error eliminando usuario");
    }
  };

  const cambiarPasswordPerfil = async () => {
    if (!profile || !profile.id) return;
    if (!passChange.nueva) return alert("Ingresa la nueva contraseña");
    if (passChange.nueva !== passChange.confirmar) return alert("Las contraseñas no coinciden");
    try {
      const res = await fetch(`${API_USERS}${profile.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passChange.nueva }),
      });
      if (!res.ok) throw new Error("Error cambiando contraseña");
      // opcional: notificar éxito
      alert("Contraseña actualizada");
      setPassChange({ nueva: "", confirmar: "" });
    } catch (err) {
      console.error(err);
      alert("Error al cambiar la contraseña");
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
                <img src="https://i.pravatar.cc/150?img=12" alt="avatar" className="w-28 h-28 rounded-full border-4 border-indigo-100 object-cover" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{profile?.nombre ?? "—"}</h3>
              <span className="mt-1 text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{profile?.rol ?? "—"}</span>

              <div className="w-full mt-6 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Nombre de usuario</label>
                  <p className="mt-1 font-semibold">{profile?.nombre ?? "—"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Rol</label>
                  <p className="mt-1 font-semibold">{profile?.rol ?? "—"}</p>
                </div>

                <div className="pt-4">
                  <h4 className="text-sm font-medium mb-2">Cambiar contraseña</h4>
                  <input type="password" placeholder="Nueva contraseña" value={passChange.nueva} onChange={(e) => setPassChange(p => ({...p, nueva: e.target.value}))} className="w-full px-3 py-2 border rounded mb-2" />
                  <input type="password" placeholder="Confirmar contraseña" value={passChange.confirmar} onChange={(e) => setPassChange(p => ({...p, confirmar: e.target.value}))} className="w-full px-3 py-2 border rounded mb-3" />
                  <button onClick={cambiarPasswordPerfil} className="px-4 py-2 bg-indigo-600 text-white rounded">Cambiar contraseña</button>
                </div>
              </div>
            </div>
          </section>

          {/* Usuarios y acciones */}
          <section className="col-span-2 bg-white rounded-xl shadow-md p-6" data-aos="fade-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Gestión de usuarios</h3>
              <button onClick={abrirNuevo} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2">
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
                    <tr><td colSpan="3" className="px-4 py-6 text-center text-sm text-gray-500">No hay usuarios</td></tr>
                  ) : (
                    users.map((u) => (
                      <tr key={u.id} className="border-t">
                        <td className="px-4 py-3">{u.nombre}</td>
                        <td className="px-4 py-3">{u.rol ?? "—"}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => abrirEditar(u)} className="text-indigo-600 hover:underline mr-3">Editar</button>
                          <button onClick={() => eliminarUsuario(u.id)} className="text-red-600 hover:underline">Eliminar</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
              <div>
                <label className="block text-sm font-medium text-gray-600">Nueva Contraseña</label>
                <input name="password" type="password" value={editUser.password || ""} onChange={handleEditChange} className="mt-1 px-3 py-2 border rounded w-full" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={cerrarModal} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
                <button onClick={guardarEdicion} className="px-4 py-2 bg-indigo-600 text-white rounded">Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal nuevo usuario */}
      {isNewOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Crear nuevo usuario</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600">Nombre</label>
                <input name="nombre" value={newUser.nombre} onChange={handleNewChange} className="mt-1 px-3 py-2 border rounded w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Rol</label>
                <select name="rol" value={newUser.rol} onChange={handleNewChange} className="mt-1 px-3 py-2 border rounded w-full">
                  <option value="">-- seleccionar --</option>
                  <option value="admin">admin</option>
                  <option value="user">user</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Contraseña</label>
                <input name="password" type="password" value={newUser.password} onChange={handleNewChange} className="mt-1 px-3 py-2 border rounded w-full" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={cerrarNuevo} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
                <button onClick={guardarNuevo} className="px-4 py-2 bg-indigo-600 text-white rounded">Crear</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
