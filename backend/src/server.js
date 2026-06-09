const express = require('express');
const cors = require('cors');
const compression = require('compression');
require('dotenv').config();

// Rutas
const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const ordenesRoutes = require('./routes/ordenes');
const usuariosRoutes = require('./routes/usuarios');
const reportesRoutes = require('./routes/reportes');

// Middleware de errores
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware globales
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ordenes', ordenesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/reportes', reportesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ API ejecutándose en http://localhost:${PORT}`);
  console.log(`📝 Base de datos: ${process.env.DB_NAME}`);
});
