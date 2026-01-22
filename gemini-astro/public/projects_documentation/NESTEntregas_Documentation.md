# 🏢 Sistema de Gestión de Entregas Inmobiliarias NEST

![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![SASS](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Gulp](https://img.shields.io/badge/Gulp-CF4647?style=for-the-badge&logo=gulp&logoColor=white)

## 📋 Descripción General

**Sistema de Gestión de Entregas NEST** es una aplicación web empresarial desarrollada en PHP con arquitectura MVC (Modelo-Vista-Controlador) diseñada para la gestión integral de entregas de proyectos inmobiliarios. La plataforma permite a desarrolladoras inmobiliarias administrar proyectos, departamentos, clientes y garantías de manera centralizada, proporcionando también un portal de cliente donde los compradores pueden acceder a documentación relevante de sus propiedades.

---

## 🎯 Problemática Resuelto

Las empresas desarrolladoras inmobiliarias enfrentan desafíos significativos en:

- **Gestión fragmentada** de información de proyectos y clientes
- **Dificultad en el seguimiento** de entregas de departamentos
- **Administración de garantías** post-venta dispersa
- **Comunicación ineficiente** con compradores sobre documentación
- **Control de archivos** como planos, manuales y videos explicativos

Este sistema centraliza todas estas operaciones en una sola plataforma intuitiva y segura.

---

## ✨ Características Principales

### 🔐 Sistema de Autenticación
- Login seguro con validación AJAX
- Gestión de sesiones con roles diferenciados
- Contraseñas hasheadas con `password_hash()` de PHP
- Redirección automática según tipo de usuario (Admin/Cliente)

### 👨‍💼 Panel Administrativo
- **Dashboard interactivo** con estadísticas en tiempo real
- **Monitoreo del sistema** con verificación de:
  - Estado de conexión a base de datos
  - Integridad del sistema de archivos
  - Espacio de almacenamiento disponible
  - Integridad de datos
- **Gestión completa CRUD** para:
  - 🏢 Proyectos inmobiliarios
  - 🏠 Departamentos/Unidades
  - 👤 Usuarios del sistema
  - 👥 Clientes y asignaciones
  - 🛡️ Garantías post-venta
  - 📁 Archivos y documentación

### 👤 Portal de Clientes
- Visualización personalizada de proyectos asignados
- Acceso a documentación por departamento:
  - 📘 Manuales de usuario
  - 🎬 Videos explicativos
  - 📋 Guías de mantenimiento
- Interfaz intuitiva con navegación por proyecto

### 📁 Gestión de Archivos
- Carga masiva de archivos con validación
- Clasificación automática por tipo de plan
- Sistema de sincronización de archivos
- Detección de archivos huérfanos
- Optimización automática de PDFs (corrección de colorspace JPX)

### 🛡️ Sistema de Garantías
- Generación automática de folios por proyecto
- Seguimiento de estados (Abierto/Cerrado)
- Vinculación con archivos firmados
- Historial de reportes por departamento

### 🔍 Búsqueda Avanzada
- Sistema de búsqueda AJAX en tiempo real
- Filtros dinámicos por múltiples criterios
- Ordenamiento personalizable
- Paginación de resultados

---

## 🛠️ Stack Tecnológico

### Backend
| Tecnología | Uso |
|------------|-----|
| **PHP 8+** | Lenguaje principal del servidor |
| **MySQL** | Base de datos relacional |
| **Arquitectura MVC** | Patrón de diseño personalizado |
| **Composer** | Gestión de dependencias |
| **PHPDotenv** | Variables de entorno |
| **SendGrid** | Envío de correos electrónicos |

### Frontend
| Tecnología | Uso |
|------------|-----|
| **HTML5/CSS3** | Estructura y estilos |
| **SASS/SCSS** | Preprocesador CSS modular |
| **JavaScript ES6+** | Interactividad |
| **jQuery** | Manipulación DOM y AJAX |
| **Fetch API** | Peticiones asíncronas |

### Herramientas de Desarrollo
| Herramienta | Función |
|-------------|---------|
| **Gulp** | Automatización de tareas |
| **Sharp** | Procesamiento de imágenes |
| **Terser** | Minificación de JavaScript |
| **qpdf** | Optimización de PDFs |

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE                               │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Login     │    │   Portal    │    │   Admin     │     │
│  │   (AJAX)    │    │   Cliente   │    │   Panel     │     │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘     │
└─────────┼───────────────────┼──────────────────┼────────────┘
          │                   │                  │
          ▼                   ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                       ROUTER MVC                             │
│         (Enrutamiento de URLs y Control de Acceso)          │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                     CONTROLADORES                            │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│  │   Login    │ │  Projects  │ │   Users    │ │  Files   │ │
│  │ Controller │ │ Controller │ │ Controller │ │Controller│ │
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘ │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ │
│  │ Guarantees │ │ Customers  │ │ Departments│ │   Ajax   │ │
│  │ Controller │ │ Controller │ │ Controller │ │Controller│ │
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘ │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                       MODELOS                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   ActiveRecord (Base)                   │ │
│  └────────────────────────────────────────────────────────┘ │
│       │                    │                    │           │
│  ┌────┴────┐         ┌─────┴─────┐        ┌────┴────┐      │
│  │Projects │         │   Users   │        │  Files  │      │
│  │Customers│         │Departments│        │Guarantees│     │
│  └─────────┘         └───────────┘        └─────────┘      │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                      BASE DE DATOS                           │
│                        MySQL                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │projects │ │  users  │ │ files   │ │guarantees│          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                       │
│  │departments│customer_ │ │plan_types│                      │
│  │          │ projects │ │         │                       │
│  └─────────┘ └─────────┘ └─────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Estructura del Proyecto

```
entregaswebsiteMVC/
│
├── 📁 controllers/              # Controladores MVC
│   ├── AdminController.php      # Panel administrativo
│   ├── AjaxController.php       # Endpoints AJAX
│   ├── CustomerCRUDController.php
│   ├── DepartmentCRUDController.php
│   ├── FilesController.php      # Gestión de archivos
│   ├── GuaranteesCRUDController.php
│   ├── LoginController.php      # Autenticación
│   ├── PlanTypesController.php
│   ├── ProjectCRUDController.php
│   ├── ProjectsController.php   # Portal cliente
│   └── UserController.php
│
├── 📁 models/                   # Modelos de datos
│   ├── ActiveRecord.php         # Clase base ORM
│   ├── Admin.php
│   ├── CustomerRecordCRUD.php
│   ├── DepartmentCRUD.php
│   ├── Files.php
│   ├── GuaranteesCRUD.php
│   ├── PlanTypesCRUD.php
│   ├── ProjectCRUD.php
│   ├── Projects.php
│   ├── SystemStatus.php         # Monitoreo del sistema
│   └── User.php
│
├── 📁 views/                    # Vistas (Templates)
│   ├── layout.php               # Layout principal
│   ├── login.php                # Página de acceso
│   ├── proyectos.php            # Portal cliente
│   ├── 📁 admin/                # Vistas administrativas
│   │   ├── index.php            # Dashboard
│   │   ├── 📁 users/
│   │   ├── 📁 projects/
│   │   ├── 📁 departments/
│   │   ├── 📁 customers/
│   │   ├── 📁 guarantees/
│   │   └── 📁 files/
│   └── 📁 proyectos/            # Vistas de proyectos
│
├── 📁 includes/                 # Configuración
│   ├── app.php                  # Bootstrap aplicación
│   ├── funciones.php            # Funciones helper
│   ├── 📁 config/
│   │   └── database.php         # Conexión BD
│   └── 📁 templates/
│       ├── Admin-navbar.php
│       ├── SEO.php
│       └── scripts.php
│
├── 📁 public/                   # Punto de entrada
│   ├── index.php                # Front controller
│   └── 📁 build/                # Assets compilados
│       ├── 📁 css/
│       ├── 📁 js/
│       ├── 📁 img/
│       ├── 📁 pdf/
│       ├── 📁 uploaded/
│       └── 📁 video/
│
├── 📁 src/                      # Assets fuente
│   ├── 📁 scss/                 # Estilos SASS
│   │   ├── app.scss
│   │   ├── 📁 base/
│   │   └── 📁 layout/
│   ├── 📁 js/                   # JavaScript
│   └── 📁 img/                  # Imágenes originales
│
├── 📁 vendor/                   # Dependencias PHP
├── Router.php                   # Sistema de rutas
├── composer.json                # Dependencias Composer
├── package.json                 # Dependencias NPM
└── gulpfile.js                  # Tareas automatizadas
```

---

## 🔒 Seguridad Implementada

| Característica | Implementación |
|----------------|----------------|
| **Autenticación** | Sistema de sesiones PHP con validación de rol |
| **Contraseñas** | Hash con `password_hash()` y `PASSWORD_BCRYPT` |
| **SQL Injection** | Prepared statements en todas las consultas |
| **XSS** | Escape de salida con `htmlspecialchars()` |
| **CSRF** | Validación de método HTTP en formularios |
| **Control de Acceso** | Middleware de verificación en Router |
| **Validación de Archivos** | Verificación de tipo y nombre |

---

## 📊 Modelo de Base de Datos

### Tablas Principales

```sql
-- Proyectos inmobiliarios
projects (id, project_name, location)

-- Unidades/Departamentos
departments (id, department_name, project_id, project_tower)

-- Usuarios del sistema
users (id, full_name, email, password_hash, phone, rol_id)

-- Roles
rol (id, rol)

-- Asignación cliente-proyecto-departamento
customer_projects (id, user_id, project_id, department_id)

-- Archivos subidos
files (id, file_name, file_path, plan_type)

-- Tipos de plan
plan_types (id, description, assigned_button)

-- Garantías
guarantees (id, project_id, department_id, num_folio, 
            report_date, report_status, signed_folio)
```

### Relaciones
- Un **proyecto** tiene muchos **departamentos**
- Un **usuario** puede tener múltiples asignaciones a **departamentos**
- Un **departamento** puede tener múltiples **garantías**
- Los **archivos** se clasifican por **tipos de plan**

---

## 🚀 Instalación y Configuración

### Requisitos Previos
- PHP 8.0 o superior
- MySQL 5.7 o superior
- Composer
- Node.js y NPM
- Servidor web (Apache/Nginx)

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/CesarTrev26/EntregasWebsite.git

# 2. Instalar dependencias PHP
composer install

# 3. Instalar dependencias Node.js
npm install

# 4. Configurar variables de entorno
# Crear archivo .env con:
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASS=tu_contraseña
DB_NAME=entregaswebsite

# 5. Importar base de datos
mysql -u usuario -p nombre_db < database.sql

# 6. Compilar assets
npm run build

# 7. Configurar virtual host apuntando a /public
```

---

## 📱 Capturas de Pantalla

### Login
> Página de acceso con diseño moderno y validación en tiempo real

### Dashboard Administrativo
> Panel con estadísticas, estado del sistema y accesos rápidos

### Gestión de Proyectos
> CRUD completo con búsqueda y filtros

### Portal de Cliente
> Vista personalizada con acceso a documentación

---

## 👨‍💻 Autor

**César Treviño**

- GitHub: [@CesarTrev26](https://github.com/CesarTrev26)

---

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

---

## 🔮 Futuras Mejoras

- [ ] API REST completa para integración móvil
- [ ] Sistema de notificaciones por correo
- [ ] Firma electrónica de documentos
- [ ] Calendario de citas para entregas
- [ ] App móvil para clientes
- [ ] Reportes exportables en PDF/Excel
- [ ] Chat en tiempo real entre admin y clientes
- [ ] Sistema de tickets de soporte

---

## 📞 Contacto

Para más información sobre este proyecto o consultas de desarrollo:

- 📧 Email: [contacto@ejemplo.com]
- 💼 LinkedIn: [perfil-linkedin]
- 🌐 Portfolio: [tu-portfolio.com]

---

<div align="center">
  <p>Desarrollado con ❤️ para el sector inmobiliario</p>
  <p>© 2024-2026 Sistema NEST</p>
</div>
