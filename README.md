# Mi Turno — Sistema de Gestión de Turnos para Salones de Belleza

**Mi Turno** es un sistema completo de gestión de turnos desarrollado específicamente para salones de belleza. Permite administrar servicios, clientes, reservas, pagos y programa de fidelización desde una interfaz moderna y responsiva.

**Desarrollado por:** CodigoPy

---

## 🎯 Características Principales

### Para Administradores
- ✅ Panel administrativo completo
- ✅ Gestión de servicios y categorías
- ✅ Gestión de clientes
- ✅ Control de turnos y disponibilidad
- ✅ Configuración de horarios dinámicos
- ✅ Sistema de pagos con señas
- ✅ Programa de fidelización configurable
- ✅ Portfolio de trabajos con carga de imágenes
- ✅ Notificaciones en tiempo real

### Para Clientes
- ✅ Reserva de turnos online (con o sin cuenta)
- ✅ Visualización de servicios disponibles
- ✅ Carga de comprobante de seña
- ✅ Historial de turnos
- ✅ Programa de beneficios
- ✅ Galería de trabajos

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 19 + Vite 8
- **UI:** Tailwind CSS v4 + Framer Motion
- **Backend:** Firebase (Firestore, Authentication, Hosting, Storage)
- **Imágenes:** Cloudinary
- **Enrutamiento:** React Router v7
- **Gestión de Estado:** React Query (TanStack Query)
- **Formularios:** React Hook Form + Zod
- **Iconos:** Lucide React + Phosphor Icons
- **Notificaciones:** React Hot Toast

---

## 🚀 Instalación y Configuración

### 1. Requisitos Previos
- Node.js 18+ y npm/pnpm
- Cuenta de Firebase
- Cuenta de Cloudinary (para carga de imágenes)

### 2. Clonar el Repositorio
```bash
git clone https://github.com/tuusuario/mi-turno.git
cd mi-turno
```

### 3. Instalar Dependencias
```bash
npm install
```

### 4. Configurar Variables de Entorno

Copia el archivo de ejemplo y completa con tus credenciales:

```bash
cp .env.example .env.local
```

Edita `.env.local` y completa:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id

# App Configuration
VITE_APP_ENV=development

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=tu_upload_preset
```

### 5. Configurar Firebase

#### 5.1 Crear Proyecto Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita **Authentication** (Email/Password)
4. Habilita **Firestore Database**
5. Habilita **Storage**

#### 5.2 Configurar Firestore

**Reglas de Seguridad:**
Despliega las reglas desde `firestore.rules`:
```bash
firebase deploy --only firestore:rules
```

**Índices:**
Despliega los índices desde `firestore.indexes.json`:
```bash
firebase deploy --only firestore:indexes
```

#### 5.3 Datos Iniciales (Colecciones)

Crea las siguientes colecciones en Firestore:

**`settings/salon`** (Configuración de horarios):
```json
{
  "slotDuration": 60,
  "schedule": {
    "0": { "isOpen": false, "blocks": [] },
    "1": { "isOpen": true, "blocks": [{ "start": "09:00", "end": "18:00" }] },
    "2": { "isOpen": true, "blocks": [{ "start": "09:00", "end": "18:00" }] },
    "3": { "isOpen": true, "blocks": [{ "start": "09:00", "end": "18:00" }] },
    "4": { "isOpen": true, "blocks": [{ "start": "09:00", "end": "18:00" }] },
    "5": { "isOpen": true, "blocks": [{ "start": "09:00", "end": "18:00" }] },
    "6": { "isOpen": false, "blocks": [] }
  }
}
```

**`settings/payments`** (Configuración de pagos):
```json
{
  "requireDeposit": true,
  "depositPercent": 30,
  "bankAccount": {
    "bankName": "Banco Nacional",
    "accountNumber": "123456789",
    "accountHolder": "Tu Nombre",
    "accountType": "Ahorros",
    "accountAlias": "SALON"
  }
}
```

**`settings/business`** (Información del negocio):
```json
{
  "name": "Mi Salón de Belleza",
  "phone": "595984925322",
  "address": "Tu Dirección",
  "description": "Salón de belleza profesional",
  "socialMedia": {
    "instagram": "@miturno.oficial",
    "whatsapp": "595984925322"
  }
}
```

**Crear Usuario Administrador:**
1. Registra un usuario desde la interfaz
2. Ve a Firestore → `users` → busca tu usuario
3. Cambia el campo `role` de `"user"` a `"admin"`

### 6. Configurar Cloudinary

1. Crea una cuenta en [Cloudinary](https://cloudinary.com/)
2. Ve a Settings → Upload
3. Crea un **Upload Preset** con:
   - **Mode:** Unsigned
   - **Preset name:** `miturno_uploads` (o el que prefieras)
   - **Folder:** `miturno/works`
4. Copia el **Cloud Name** y el **Upload Preset** a tu `.env.local`

### 7. Actualizar Firebase Project ID

Edita `.firebaserc` y reemplaza con tu project ID:
```json
{
  "projects": {
    "default": "tu-proyecto-firebase"
  }
}
```

---

## 🎮 Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Linter
npm run lint
```

---

## 🌐 Despliegue

### Firebase Hosting

```bash
# Build
npm run build

# Desplegar
firebase deploy --only hosting
```

---

## 📂 Estructura del Proyecto

```
mi-turno/
├── public/                 # Archivos estáticos (imágenes, favicon, etc.)
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── booking/        # Componentes de reserva
│   │   ├── common/         # Componentes comunes
│   │   ├── icons/          # Iconos personalizados
│   │   ├── layout/         # Layout (Header, Sidebar)
│   │   ├── notifications/  # Notificaciones
│   │   └── ui/             # Componentes UI base
│   ├── constants/          # Constantes globales
│   ├── firebase/           # Configuración Firebase
│   ├── hooks/              # Custom React Hooks
│   ├── layouts/            # Layouts de página
│   ├── pages/              # Páginas de la aplicación
│   ├── routes/             # Configuración de rutas
│   ├── services/           # Servicios (Cloudinary, etc.)
│   ├── utils/              # Utilidades
│   ├── App.jsx             # Componente raíz
│   ├── index.css           # Estilos globales
│   └── main.jsx            # Entry point
├── .env.example            # Template de variables de entorno
├── .firebaserc             # Configuración de Firebase
├── firebase.json           # Configuración de hosting
├── firestore.rules         # Reglas de seguridad Firestore
├── firestore.indexes.json  # Índices de Firestore
├── index.html              # HTML principal
├── package.json
├── tailwind.config.js      # Configuración Tailwind
└── vite.config.js          # Configuración Vite
```

---

## 🔐 Seguridad

- ✅ Reglas de Firestore configuradas para proteger datos
- ✅ Autenticación obligatoria para rutas sensibles
- ✅ Validación de roles (admin/user)
- ✅ Cloudinary con unsigned presets (sin exponer API secrets)
- ✅ Variables de entorno para credenciales

---

## 📝 Flujo de Reservas

1. **Cliente** navega por los servicios
2. **Cliente** selecciona servicio y horario disponible
3. **Cliente** puede reservar como invitado o con cuenta
4. Si requiere seña, **Cliente** sube comprobante
5. **Admin** recibe notificación
6. **Admin** revisa y aprueba el comprobante
7. Turno confirmado → Cliente recibe confirmación

---

## 🎨 Personalización

### Colores (Tailwind CSS)

Edita `src/index.css` para cambiar los colores de la marca:

```css
@theme {
  --color-brand-primary: #d4a5a5;      /* Rosa empolvado */
  --color-brand-secondary: #f5e6e8;    /* Rosa claro */
  --color-brand-accent: #c89595;       /* Rosa oscuro */
  /* ... más colores */
}
```

### Logotipo

Reemplaza los siguientes archivos en `public/`:
- `favicon.svg` (icono del navegador)
- Logo principal del sidebar

---

## 🤝 Contribuciones

Este proyecto fue desarrollado como producto independiente y reutilizable. Para adaptarlo a un negocio específico:

1. Configura las variables de entorno
2. Personaliza colores y logotipo
3. Ajusta los datos iniciales en Firestore
4. Actualiza información de contacto y redes sociales

---

## 📄 Licencia

Proyecto desarrollado por **CodigoPy**.

---

## 📞 Soporte

Para consultas sobre implementación o personalización:
- Email: contacto@codigopy.com
- WhatsApp: +595 984 925 322

---

## 🚨 Notas Importantes

- **No usar en producción sin configurar tus propias credenciales**
- Las credenciales FALLBACK en el código están marcadas como `PENDIENTE_CONFIGURAR`
- Revisar y ajustar las reglas de Firestore según tus necesidades
- Configurar backup automático de Firestore
- Habilitar monitoreo de Firebase para producción

---

## 📚 Recursos

- [Documentación Firebase](https://firebase.google.com/docs)
- [Documentación Cloudinary](https://cloudinary.com/documentation)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---

**Desarrollado con ❤️ por CodigoPy**
