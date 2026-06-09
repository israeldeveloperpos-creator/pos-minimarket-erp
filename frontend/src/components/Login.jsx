import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('admin@minimarket.cl');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-secondary to-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-secondary rounded-lg shadow-2xl p-8 border border-primary/20">
          <h1 className="text-4xl font-bold text-white mb-2 text-center">POS</h1>
          <p className="text-light/60 text-center mb-8">Minimarket ERP</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-light text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-dark border border-primary/30 rounded-lg text-white placeholder-light/40 focus:outline-none focus:border-primary transition"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-light text-sm font-medium mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-dark border border-primary/30 rounded-lg text-white placeholder-light/40 focus:outline-none focus:border-primary transition"
                placeholder="••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="text-light/60 text-sm text-center mt-6">
            Demo: admin@minimarket.cl / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
