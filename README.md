# 🏪 POS Minimarket ERP

Sistema completo de **Punto de Venta (POS)** para minimarket con autenticación, reportes, gestión de inventario y auditoría.

**Stack:** React + Vite + Node.js/Express + PostgreSQL + Docker

---

## 🎯 Características

✅ **Autenticación JWT** - Login seguro con roles (Admin, Vendedor)  
✅ **Sistema POS** - Venta rápida con carrito, cálculo IVA y múltiples métodos de pago  
✅ **Dashboard** - Gráficas de ventas en tiempo real  
✅ **Inventario** - Gestión de productos, stock, categorías  
✅ **Reportes** - Ventas diarias, mensuales, anuales con exportación  
✅ **Usuarios** - Administración de vendedores y permisos  
✅ **Auditoría** - Registro de todas las transacciones  
✅ **Docker** - Deploy con un comando  
✅ **Responsive** - Funciona en desktop, tablet y mobile  

---

## 📋 Requisitos

- **Node.js** v18+
- **Docker & Docker Compose** (recomendado)
- **Git**

---

## 🚀 Instalación Rápida (Docker)

### 1. Clonar repositorio
```bash
git clone https://github.com/israeldeveloperpos-creator/pos-minimarket-erp.git
cd pos-minimarket-erp
```

### 2. Configurar variables de entorno
```bash
cp backend/.env.example backend/.env
```

Editar `backend/.env`:
```
DB_HOST=postgres
DB_PORT=5432
DB_USER=pos_user
DB_PASSWORD=pos_password_123
DB_NAME=pos_minimarket
JWT_SECRET=tu_secreto_muy_seguro_aqui
PORT=3001
NODE_ENV=development
```

### 3. Ejecutar con Docker Compose
```bash
docker-compose up -d
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Base de datos: localhost:5432

---

## 🔧 Instalación Manual

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend disponible en: `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponible en: `http://localhost:5173`

### Base de datos

Importar `backend/schema.sql` en PostgreSQL:
```bash
psql -U postgres -d pos_minimarket -f backend/schema.sql
```

---

## 🔐 Credenciales por defecto

**Usuario:** `admin@minimarket.cl`  
**Contraseña:** `admin123`

⚠️ **IMPORTANTE:** Cambiar en producción

---

## 📱 Funcionalidades

### 🛒 Punto de Venta
- Búsqueda rápida de productos
- Carrito editable
- Numpad: Cantidad / Descuento / Precio
- Métodos de pago: Efectivo (con vuelto) / Tarjeta / Transferencia
- IVA 19% automático
- Impresión de recibos

### 📊 Dashboard
- Ventas del día
- Gráficas de tendencias
- Top productos
- Resumen de ingresos

### 📦 Inventario
- CRUD de productos
- Control de stock
- Categorías
- Búsqueda avanzada

### 👥 Usuarios
- Crear/editar vendedores
- Asignar roles y permisos
- Cambiar contraseñas
- Ver últimas actividades

### 📈 Reportes
- Ventas por período
- Productos más vendidos
- Comparativas
- Exportar a CSV/PDF

### 📝 Auditoría
- Registro de todas las ventas
- Movimientos de inventario
- Cambios de usuarios
- Historial completo

---

## 🗂️ Estructura de carpetas

```
pos-minimarket-erp/
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── context/         # Context API (Auth)
│   │   ├── api/             # Cliente HTTP
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/                 # Node.js + Express
│   ├── src/
│   │   ├── routes/          # Rutas API
│   │   ├── middleware/      # Auth, errors
│   │   ├── server.js
│   │   └── db.js
│   ├── schema.sql           # Base de datos
│   └── package.json
│
├── docker-compose.yml       # Orquestación Docker
├── .gitignore
└── README.md
```

---

## 📡 API Endpoints

### Autenticación
```
POST   /api/auth/login           # Login
POST   /api/auth/logout          # Logout
GET    /api/auth/me              # Usuario actual
```

### Productos
```
GET    /api/productos            # Listar productos
GET    /api/productos/:id        # Obtener producto
POST   /api/productos            # Crear producto
PUT    /api/productos/:id        # Actualizar producto
DELETE /api/productos/:id        # Eliminar producto
```

### Órdenes/Ventas
```
GET    /api/ordenes              # Listar ventas
GET    /api/ordenes/:id          # Detalle venta
POST   /api/ordenes              # Crear venta
POST   /api/ordenes/:id/pagar    # Procesar pago
```

### Reportes
```
GET    /api/reportes/diario      # Ventas del día
GET    /api/reportes/mensual     # Ventas del mes
GET    /api/reportes/productos   # Más vendidos
```

### Usuarios
```
GET    /api/usuarios             # Listar usuarios
POST   /api/usuarios             # Crear usuario
PUT    /api/usuarios/:id         # Actualizar usuario
DELETE /api/usuarios/:id         # Eliminar usuario
```

---

## 🔑 Variables de Entorno

**Backend** (`backend/.env`):
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=pos_user
DB_PASSWORD=pos_password
DB_NAME=pos_minimarket
JWT_SECRET=tu_secreto_super_seguro
PORT=3001
NODE_ENV=development
```

---

## 🐳 Docker Compose

Servicios incluidos:
- **pos-frontend** - React en puerto 5173
- **pos-backend** - Express en puerto 3001
- **pos-postgres** - Base de datos en puerto 5432

Comandos útiles:
```bash
docker-compose up -d          # Iniciar
docker-compose logs -f        # Ver logs
docker-compose down           # Detener
docker-compose ps             # Estado
```

---

## 📚 Documentación adicional

- [INSTALL.md](./INSTALL.md) - Guía de instalación paso a paso
- [API.md](./docs/API.md) - Documentación completa de API
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Arquitectura del proyecto

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver `LICENSE` para más detalles.

---

## 💬 Soporte

¿Problemas? Revisa:
- [INSTALL.md](./INSTALL.md) - Troubleshooting
- Issues en GitHub

---

**Hecho con ❤️ para minimarkets**
