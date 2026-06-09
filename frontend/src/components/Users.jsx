import React, { useState, useEffect } from 'react';
import { usuariosAPI } from '../api/client';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

export default function Users() {
  const [usuarios, setUsuarios] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    nombre: '',
    password: '',
    rol: 'vendedor'
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await usuariosAPI.listar();
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleGuardar = async () => {
    try {
      if (editando) {
        const { password, ...dataActualizar } = formData;
        await usuariosAPI.actualizar(editando.id, dataActualizar);
      } else {
        await usuariosAPI.crear(formData);
      }
      cargarUsuarios();
      setModalAbierto(false);
      setEditando(null);
      setFormData({ email: '', nombre: '', password: '', rol: 'vendedor' });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEliminar = async (id) => {
    if (confirm('¿Estás seguro?')) {
      try {
        await usuariosAPI.eliminar(id);
        cargarUsuarios();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const abrirModal = (usuario = null) => {
    if (usuario) {
      setEditando(usuario);
      setFormData({
        email: usuario.email,
        nombre: usuario.nombre,
        password: '',
        rol: usuario.rol
      });
    } else {
      setEditando(null);
      setFormData({ email: '', nombre: '', password: '', rol: 'vendedor' });
    }
    setModalAbierto(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Usuarios</h2>
        <button
          onClick={() => abrirModal()}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition"
        >
          <FiPlus /> Nuevo Usuario
        </button>
      </div>

      <div className="bg-secondary rounded-lg border border-primary/20 overflow-x-auto">
        <table className="w-full text-light text-sm">
          <thead className="border-b border-primary/20 bg-dark">
            <tr>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Rol</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id} className="border-b border-primary/10 hover:bg-dark/50 transition">
                <td className="px-4 py-3 font-medium">{u.nombre}</td>
                <td className="px-4 py-3 text-light/60">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-bold">
                    {u.rol}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={u.activo ? 'text-green-400' : 'text-red-400'}>
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                  <button
                    onClick={() => abrirModal(u)}
                    className="text-primary hover:text-primary/70 transition"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleEliminar(u.id)}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-secondary rounded-lg p-6 max-w-md w-full border border-primary/20">
            <h3 className="text-xl font-bold text-white mb-4">
              {editando ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-light/60 text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-dark border border-primary/30 rounded-lg text-white"
                  disabled={editando}
                />
              </div>

              <div>
                <label className="block text-light/60 text-sm mb-2">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 bg-dark border border-primary/30 rounded-lg text-white"
                />
              </div>

              {!editando && (
                <div>
                  <label className="block text-light/60 text-sm mb-2">Contraseña</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 bg-dark border border-primary/30 rounded-lg text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-light/60 text-sm mb-2">Rol</label>
                <select
                  value={formData.rol}
                  onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                  className="w-full px-3 py-2 bg-dark border border-primary/30 rounded-lg text-white"
                >
                  <option value="vendedor">Vendedor</option>
                  <option value="gerente">Gerente</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setModalAbierto(false)}
                  className="flex-1 bg-dark text-light py-2 rounded-lg hover:bg-dark/80 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardar}
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
