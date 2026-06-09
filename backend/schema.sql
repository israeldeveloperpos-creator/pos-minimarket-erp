-- Crear base de datos (si no existe)
-- CREATE DATABASE pos_minimarket;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(50) NOT NULL DEFAULT 'vendedor', -- admin, vendedor, gerente
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultimo_login TIMESTAMP NULL
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL UNIQUE,
  descripcion TEXT,
  color VARCHAR(7),
  activa BOOLEAN DEFAULT true,
  creada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio_costo DECIMAL(12, 2) DEFAULT 0,
  precio_venta DECIMAL(12, 2) NOT NULL,
  categoria_id INTEGER REFERENCES categorias(id),
  stock INTEGER DEFAULT 0,
  stock_minimo INTEGER DEFAULT 5,
  sku VARCHAR(100) UNIQUE,
  imagen_url VARCHAR(500),
  activo BOOLEAN DEFAULT true,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de órdenes/ventas
CREATE TABLE IF NOT EXISTS ordenes (
  id SERIAL PRIMARY KEY,
  numero_orden VARCHAR(50) UNIQUE NOT NULL,
  usuario_id INTEGER REFERENCES usuarios(id),
  cliente_nombre VARCHAR(255),
  cliente_email VARCHAR(255),
  cliente_telefono VARCHAR(20),
  subtotal DECIMAL(12, 2) DEFAULT 0,
  iva DECIMAL(12, 2) DEFAULT 0,
  total DECIMAL(12, 2) DEFAULT 0,
  descuento DECIMAL(12, 2) DEFAULT 0,
  metodo_pago VARCHAR(50), -- efectivo, tarjeta, transferencia, otro
  estado VARCHAR(50) DEFAULT 'pagada', -- pagada, pendiente, anulada
  monto_recibido DECIMAL(12, 2),
  vuelto DECIMAL(12, 2),
  notas TEXT,
  creada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  pagada_en TIMESTAMP NULL
);

-- Tabla de líneas de órdenes
CREATE TABLE IF NOT EXISTS orden_lineas (
  id SERIAL PRIMARY KEY,
  orden_id INTEGER REFERENCES ordenes(id) ON DELETE CASCADE,
  producto_id INTEGER REFERENCES productos(id),
  nombre_producto VARCHAR(255),
  precio_unitario DECIMAL(12, 2),
  cantidad INTEGER,
  descuento_porcentaje DECIMAL(5, 2) DEFAULT 0,
  subtotal DECIMAL(12, 2),
  creada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de auditoría
CREATE TABLE IF NOT EXISTS auditoria (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  entidad VARCHAR(100), -- orden, producto, usuario, etc
  accion VARCHAR(50), -- crear, actualizar, eliminar
  entidad_id INTEGER,
  cambios_anteriores JSONB,
  cambios_nuevos JSONB,
  ip_address VARCHAR(50),
  creada_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de movimientos de inventario
CREATE TABLE IF NOT EXISTS movimientos_inventario (
  id SERIAL PRIMARY KEY,
  producto_id INTEGER REFERENCES productos(id),
  tipo VARCHAR(50), -- entrada, salida, ajuste, devolucion
  cantidad INTEGER,
  motivo VARCHAR(255),
  usuario_id INTEGER REFERENCES usuarios(id),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_activo ON productos(activo);
CREATE INDEX idx_ordenes_usuario ON ordenes(usuario_id);
CREATE INDEX idx_ordenes_fecha ON ordenes(creada_en);
CREATE INDEX idx_orden_lineas_orden ON orden_lineas(orden_id);
CREATE INDEX idx_auditoria_usuario ON auditoria(usuario_id);
CREATE INDEX idx_auditoria_fecha ON auditoria(creada_en);
CREATE INDEX idx_movimientos_producto ON movimientos_inventario(producto_id);

-- Datos iniciales - Categorías
INSERT INTO categorias (nombre, descripcion, color) VALUES
  ('Bebidas', 'Bebidas variadas', '#FF6B6B'),
  ('Snacks', 'Snacks y frituras', '#4ECDC4'),
  ('Lácteos', 'Productos lácteos', '#FFE66D'),
  ('Higiene', 'Productos de higiene', '#95E1D3'),
  ('Otros', 'Otros productos', '#A8D8D8')
ON CONFLICT DO NOTHING;

-- Datos iniciales - Usuario Admin
INSERT INTO usuarios (email, nombre, password_hash, rol) VALUES
  ('admin@minimarket.cl', 'Administrador', '$2a$10$YuGVw6OGN7JKx8jCXYjlCOe6KKJFPjpR8YHaXv9sWW8gQ8l8.qPFS', 'admin')
ON CONFLICT DO NOTHING;

-- Datos iniciales - Productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio_costo, precio_venta, categoria_id, stock, sku, activo) 
SELECT 
  'Coca Cola 2L', 'Bebida refrescante', 900, 1200, 1, 50, 'COCA-2L', true
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE sku = 'COCA-2L')
UNION ALL
SELECT 'Sprite 2L', 'Bebida refrescante', 850, 1100, 1, 45, 'SPRITE-2L', true
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE sku = 'SPRITE-2L')
UNION ALL
SELECT 'Fanta Naranja 2L', 'Bebida refrescante', 800, 1050, 1, 40, 'FANTA-NAR', true
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE sku = 'FANTA-NAR')
UNION ALL
SELECT 'Doritos Naturales', 'Snack de maíz', 500, 790, 2, 100, 'DORI-NAT', true
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE sku = 'DORI-NAT')
UNION ALL
SELECT 'Papas Lays', 'Papas fritas clásicas', 450, 750, 2, 120, 'LAYS-CLASS', true
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE sku = 'LAYS-CLASS')
UNION ALL
SELECT 'Leche Soprole 1L', 'Leche entera', 700, 950, 3, 80, 'LECHE-SOF', true
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE sku = 'LECHE-SOF');
