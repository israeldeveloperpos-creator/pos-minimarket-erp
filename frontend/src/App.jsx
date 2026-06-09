import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiPackage, FiBarChart3, FiUsers } from 'react-icons/fi';
import Login from './Login';
import Dashboard from './Dashboard';
import POS from './POS';
import Inventory from './Inventory';
import Users from './Users';
import Navbar from './Navbar';

export default function App() {
  const { token, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark">
        <p className="text-primary text-xl">Cargando...</p>
      </div>
    );
  }

  if (!token) {
    return <Login />;
  }

  const pages = {
    dashboard: { component: Dashboard, label: 'Dashboard', icon: FiHome },
    pos: { component: POS, label: 'POS', icon: FiPackage },
    inventory: { component: Inventory, label: 'Inventario', icon: FiPackage },
    reports: { component: Dashboard, label: 'Reportes', icon: FiBarChart3 },
    users: { component: Users, label: 'Usuarios', icon: FiUsers }
  };

  const CurrentComponent = pages[currentPage]?.component || Dashboard;

  return (
    <div className="min-h-screen bg-dark">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-secondary border-r border-primary/20 p-6 space-y-2">
          {Object.entries(pages).map(([key, page]) => {
            const Icon = page.icon;
            return (
              <button
                key={key}
                onClick={() => setCurrentPage(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  currentPage === key
                    ? 'bg-primary text-white'
                    : 'text-light/60 hover:bg-dark/50'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{page.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 bg-dark">
          <CurrentComponent />
        </div>
      </div>
    </div>
  );
}
