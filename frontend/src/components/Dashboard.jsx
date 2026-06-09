import React, { useState, useEffect } from 'react';
import { reportesAPI } from '../api/client';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiTrendingUp, FiPackage, FiDollarSign, FiUsers } from 'react-icons/fi';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

export default function Dashboard() {
  const [reporteDiario, setReporteDiario] = useState(null);
  const [reporteMensual, setReporteMensual] = useState([]);
  const [reporteProductos, setReporteProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    try {
      const [diario, mensual, productos] = await Promise.all([
        reportesAPI.diario(),
        reportesAPI.mensual(),
        reportesAPI.productos()
      ]);

      setReporteDiario(diario.data);
      setReporteMensual(mensual.data);
      setReporteProductos(productos.data.slice(0, 10));
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-white">Dashboard</h2>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-secondary rounded-lg p-4 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-light/60 text-sm">Ventas Hoy</p>
              <p className="text-2xl font-bold text-primary">
                ${(reporteDiario?.total_ventas || 0).toLocaleString('es-CL', { maximumFractionDigits: 0 })}
              </p>
            </div>
            <FiDollarSign size={32} className="text-primary/40" />
          </div>
        </div>

        <div className="bg-secondary rounded-lg p-4 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-light/60 text-sm">Órdenes</p>
              <p className="text-2xl font-bold text-primary">
                {reporteDiario?.total_ordenes || 0}
              </p>
            </div>
            <FiPackage size={32} className="text-primary/40" />
          </div>
        </div>

        <div className="bg-secondary rounded-lg p-4 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-light/60 text-sm">IVA</p>
              <p className="text-2xl font-bold text-primary">
                ${(reporteDiario?.total_iva || 0).toLocaleString('es-CL', { maximumFractionDigits: 0 })}
              </p>
            </div>
            <FiTrendingUp size={32} className="text-primary/40" />
          </div>
        </div>

        <div className="bg-secondary rounded-lg p-4 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-light/60 text-sm">Vendedores</p>
              <p className="text-2xl font-bold text-primary">
                {reporteDiario?.vendedores || 0}
              </p>
            </div>
            <FiUsers size={32} className="text-primary/40" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Ventas Mensuales */}
        <div className="bg-secondary rounded-lg p-4 border border-primary/20">
          <h3 className="text-lg font-bold text-white mb-4">Ventas del Mes</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reporteMensual}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="fecha" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
              <Line type="monotone" dataKey="total_ventas" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Productos */}
        <div className="bg-secondary rounded-lg p-4 border border-primary/20">
          <h3 className="text-lg font-bold text-white mb-4">Top 10 Productos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reporteProductos}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="nombre_producto" stroke="#999" tick={{ fontSize: 12 }} />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
              <Bar dataKey="cantidad_vendida" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
