import React, { useState, useEffect } from 'react';
import { productosAPI } from '../api/client';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

export default function Inventory() {
  const [productos, setProductos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    precio_venta: 0,
    stock: 0,
    categoria_id: 1
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await productosAPI.listar();
      setProductos(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleGuardar = async () => {
    try {
      if (editando) {
        await productosAPI.actualizar(editando.id, formData);
      } else {
        await productosAPI.crear(formData);
      }
      cargarProductos();
      setModalAbierto(false);
      setEditando(null);
      setFormData({ nombre: '', precio_venta: 0, stock: 0, categoria_id: 1 });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEliminar = async (id) => {
    if (confirm('¿Estás seguro?')) {
      try {
        await productosAPI.eliminar(id);
        cargarProductos();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const abrirModal = (producto = null) => {
    if (producto) {
      setEditando(producto);
      setFormData({
        nombre: producto.nombre,
        precio_venta: producto.precio_venta,
        stock: producto.stock,
        categoria_id: producto.categoria_id
      });
    } else {
      setEditando(null);
      setFormData({ nombre: '', precio_venta: 0, stock: 0, categoria_id: 1 });
    }
    setModalAbierto(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Inventario</h2>
        <button
          onClick={() => abrirModal()}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition"
        >
          <FiPlus /> Nuevo Producto
        </button>
      </div>

      <div className="bg-secondary rounded-lg border border-primary/20 overflow-x-auto">
        <table className="w-full text-light text-sm">
          <thead className="border-b border-primary/20 bg-dark">
            <tr>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Categoría</th>
              <th className="px-4 py-3 text-right">Precio</th>
              <th className="px-4 py-3 text-right">Stock</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id} className="border-b border-primary/10 hover:bg-dark/50 transition">
                <td className="px-4 py-3 font-medium">{p.nombre}</td>
                <td className="px-4 py-3 text-light/60">{p.categoria || '-'}</td>
                <td className="px-4 py-3 text-right text-primary">${p.precio_venta.toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  <span className={p.stock < 10 ? 'text-red-400' : 'text-green-400'}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                  <button
                    onClick={() => abrirModal(p)}
                    className="text-primary hover:text-primary/70 transition"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    onClick={() => handleEliminar(p.id)}
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
              {editando ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-light/60 text-sm mb-2">Nombre</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 bg-dark border border-primary/30 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-light/60 text-sm mb-2">Precio</label>
                <input
                  type="number"
                  value={formData.precio_venta}
                  onChange={(e) => setFormData({ ...formData, precio_venta: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-dark border border-primary/30 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-light/60 text-sm mb-2">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-dark border border-primary/30 rounded-lg text-white"
                />
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
