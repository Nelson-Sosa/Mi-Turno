# 📋 GUÍA DE CONFIGURACIÓN — MI TURNO

Esta guía te ayudará a configurar completamente el proyecto Mi Turno desde cero, desvinculándolo del proyecto PatyNails original.

---

## ⚠️ IMPORTANTE: DESVINCULACIÓN COMPLETA

Este proyecto **NO debe conectarse** a las credenciales del proyecto PatyNails original.

**Estado actual:**
- ✅ Código refactorizado
- ✅ Referencias comerciales eliminadas
- ⚠️ **PENDIENTE:** Configurar nuevas credenciales de Firebase
- ⚠️ **PENDIENTE:** Configurar nueva cuenta de Cloudinary
- ⚠️ **PENDIENTE:** Crear repositorio Git independiente

---

## 📍 PASO 1: CREAR NUEVO PROYECTO FIREBASE

### 1.1 Crear el Proyecto

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Click en **"Agregar proyecto"**
3. Nombre sugerido: `mi-turno-prod` (o el que prefieras)
4. Desactiva Google Analytics (opcional para un MVP)
5. Click en **"Crear proyecto"**

### 1.2 Configurar Firebase Authentication

1. En el menú lateral, ve a **Build → Authentication**
2. Click en **"Comenzar"**
3. Habilita **Email/Password**
4. **NO** habilites "Email link (passwordless sign-in)"
5. Guarda los cambios

### 1.3 Crear Firestore Database

1. En el menú lateral, ve a **Build → Firestore Database**
2. Click en **"Crear base de datos"**
3. Selecciona **"Iniciar en modo de producción"**
4. Elige la ubicación más cercana (ej: `southamerica-east1` para Paraguay/Argentina)
5. Click en **"Habilitar"**

### 1.4 Configurar Reglas de Firestore

Reemplaza las reglas predeterminadas con el contenido del archivo `firestore.rules`:

```bash
# Desde la terminal del proyecto:
firebase deploy --only firestore:rules
```

O copia manualmente el contenido de `firestore.rules` en:
- Firebase Console → Firestore → Reglas

### 1.5 Configurar Índices de Firestore

Los índices son necesarios para consultas compuestas.

```bash
firebase deploy --only firestore:indexes
```

O copia manualmente el contenido de `firestore.indexes.json` en:
- Firebase Console → Firestore → Índices

### 1.6 Habilitar Storage (opcional)

Si planeas usar Firebase Storage en el futuro:

1. Ve a **Build → Storage**
2. Click en **"Comenzar"**
3. Acepta las reglas predeterminadas

### 1.7 Obtener Credenciales de Firebase

1. Ve a **Configuración del proyecto** (ícono de engranaje)
2. En la sección **"Tus aplicaciones"**, click en **"Web"** (ícono `</>`)
3. Registra una app web:
   - Nombre: `Mi Turno Web`
   - **NO** marcar "Configurar Firebase Hosting"
4. Copia todas las credenciales:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "mi-turno-prod.firebaseapp.com",
  projectId: "mi-turno-prod",
  storageBucket: "mi-turno-prod.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:...",
  measurementId: "G-..."
};
```

### 1.8 Actualizar `.firebaserc`

Edita el archivo `.firebaserc` en la raíz del proyecto:

```json
{
  "projects": {
    "default": "mi-turno-prod"
  }
}
```

Reemplaza `mi-turno-prod` con el **Project ID** de tu proyecto Firebase.

---

## 📍 PASO 2: CONFIGURAR CLOUDINARY

### 2.1 Crear Cuenta Cloudinary

1. Ve a [Cloudinary](https://cloudinary.com/)
2. Crea una cuenta gratuita
3. Confirma tu email

### 2.2 Obtener Cloud Name

1. En el Dashboard, busca tu **Cloud Name**
2. Cópialo (ej: `dqwerty123`)

### 2.3 Crear Upload Preset

1. Ve a **Settings → Upload**
2. Scroll hasta **"Upload presets"**
3. Click en **"Add upload preset"**
4. Configura:
   - **Preset name:** `miturno_uploads`
   - **Signing Mode:** `Unsigned`
   - **Folder:** `miturno/works`
   - **Use filename or externally defined Public ID:** ✅ activado
   - **Unique filename:** ✅ activado
5. Click en **"Save"**

### 2.4 Configurar Carpetas (Opcional)

Cloudinary creará las carpetas automáticamente al subir archivos, pero puedes pre-crearlas:

- `miturno/works/` → Para trabajos de clientes
- `miturno/comprobantes/` → Para comprobantes de pago
- `miturno/portfolio/` → Para galería pública

---

## 📍 PASO 3: CONFIGURAR VARIABLES DE ENTORNO

### 3.1 Crear Archivo `.env.local`

En la raíz del proyecto, crea el archivo `.env.local`:

```bash
cp .env.example .env.local
```

### 3.2 Completar Variables

Edita `.env.local` con tus credenciales:

```env
# ══════════════════════════════════════════════════════════════════
# Mi Turno — Environment Variables
# ══════════════════════════════════════════════════════════════════
# IMPORTANTE: Este archivo NO debe commitearse (está en .gitignore)
# ══════════════════════════════════════════════════════════════════

# ── Firebase Configuration ────────────────────────────────────────
VITE_FIREBASE_API_KEY=AIza...TU_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=mi-turno-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mi-turno-prod
VITE_FIREBASE_STORAGE_BUCKET=mi-turno-prod.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:...
VITE_FIREBASE_MEASUREMENT_ID=G-...

# ── App Configuration ─────────────────────────────────────────────
VITE_APP_ENV=development

# ── Cloudinary (Módulo Trabajos) ──────────────────────────────────
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=miturno_uploads
```

### 3.3 Verificar que `.gitignore` Proteja el Archivo

Asegúrate de que `.env.local` esté en `.gitignore`:

```
.env.local
.env.*.local
```

---

## 📍 PASO 4: CONFIGURAR DATOS INICIALES EN FIRESTORE

### 4.1 Estructura de Colecciones

Crea las siguientes colecciones y documentos en Firestore:

#### **Colección: `settings`**

**Documento: `salon`**
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

**Documento: `payments`**
```json
{
  "requireDeposit": true,
  "depositPercent": 30,
  "depositEnabled": true,
  "bankAccount": {
    "bankName": "Banco Nacional de Fomento",
    "accountNumber": "123456789",
    "accountHolder": "TU NOMBRE O NEGOCIO",
    "accountType": "Cuenta Corriente",
    "accountAlias": "SALON"
  }
}
```

**Documento: `business`**
```json
{
  "name": "Mi Salón de Belleza",
  "phone": "595984925322",
  "address": "Av. Principal 1234, Asunción, Paraguay",
  "description": "Salón de belleza profesional especializado en manicura, pedicura y diseño de uñas.",
  "email": "contacto@misalon.com",
  "socialMedia": {
    "instagram": "@miturno.oficial",
    "whatsapp": "595984925322",
    "facebook": ""
  },
  "location": {
    "lat": -25.2637,
    "lng": -57.5759,
    "embedUrl": "https://www.google.com/maps/embed?pb=..."
  }
}
```

**Documento: `loyalty`** (Programa de fidelización)
```json
{
  "enabled": true,
  "accumulation": "visits",
  "condition": 6,
  "benefit": "discount",
  "discountPercent": 20,
  "validityDays": 90,
  "description": "Cada 6 turnos completados, obtenés un 20% de descuento en tu próximo servicio.",
  "updatedAt": {
    "seconds": 1234567890,
    "nanoseconds": 0
  }
}
```

### 4.2 Crear Categorías de Servicios

**Colección: `serviceCategories`**

Crea 2-3 categorías de ejemplo:

**Documento 1: ID automático**
```json
{
  "name": "Manicura",
  "description": "Servicios de cuidado y embellecimiento de manos",
  "icon": "manicure",
  "order": 1,
  "isActive": true,
  "createdAt": [Timestamp actual],
  "updatedAt": [Timestamp actual]
}
```

**Documento 2: ID automático**
```json
{
  "name": "Pedicura",
  "description": "Servicios de cuidado y embellecimiento de pies",
  "icon": "pedicure",
  "order": 2,
  "isActive": true,
  "createdAt": [Timestamp actual],
  "updatedAt": [Timestamp actual]
}
```

### 4.3 Crear Servicios de Ejemplo

**Colección: `services`**

Crea 2-3 servicios vinculados a las categorías:

**Servicio 1:**
```json
{
  "name": "Manicura Clásica",
  "description": "Limado, pulido y esmaltado tradicional",
  "price": 50000,
  "duration": 60,
  "categoryId": "[ID de la categoría Manicura]",
  "categoryName": "Manicura",
  "isActive": true,
  "createdAt": [Timestamp actual],
  "updatedAt": [Timestamp actual]
}
```

**Servicio 2:**
```json
{
  "name": "Manicura Semi-Permanente",
  "description": "Esmaltado de larga duración con lámpara UV",
  "price": 80000,
  "duration": 90,
  "categoryId": "[ID de la categoría Manicura]",
  "categoryName": "Manicura",
  "isActive": true,
  "createdAt": [Timestamp actual],
  "updatedAt": [Timestamp actual]
}
```

---

## 📍 PASO 5: CREAR USUARIO ADMINISTRADOR

### 5.1 Registrar Usuario

1. Ejecuta el proyecto:
```bash
npm run dev
```

2. Abre http://localhost:5173
3. Ve a **"Registrarse"**
4. Completa el formulario con tus datos

### 5.2 Asignar Rol de Administrador

1. Ve a Firebase Console → Firestore
2. Abre la colección **`users`**
3. Busca el documento con tu email
4. Edita el campo `role`:
   - Cambia `"user"` por `"admin"`
5. Guarda los cambios

### 5.3 Verificar Acceso

1. Cierra sesión en la app
2. Vuelve a iniciar sesión
3. Deberías ver el **Dashboard Administrativo** completo

---

## 📍 PASO 6: CONFIGURAR FIREBASE HOSTING (OPCIONAL)

### 6.1 Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 6.2 Login

```bash
firebase login
```

### 6.3 Inicializar Hosting (si no está configurado)

```bash
firebase init hosting
```

Selecciona:
- **Public directory:** `dist`
- **Single-page app:** `Yes`
- **Automatic builds with GitHub:** `No` (o sí si quieres CI/CD)

### 6.4 Desplegar

```bash
npm run build
firebase deploy --only hosting
```

---

## 📍 PASO 7: ACTUALIZAR INFORMACIÓN PERSONALIZADA

### 7.1 Logo e Imágenes

Reemplaza estos archivos en `public/`:

- `favicon.svg` → Tu favicon
- `MiTurno.png` → Logo del sidebar (recomendado: 200x50px, fondo transparente)

### 7.2 Información de Contacto

Edita `src/components/common/WhatsAppFloatingButton.jsx`:

```javascript
const PHONE_NUMBER = '595984925322' // Tu número de WhatsApp
```

Edita `src/components/layout/InstagramLink.jsx`:

```javascript
href="https://www.instagram.com/miturno.oficial/" // Tu Instagram
```

### 7.3 Mapa de Ubicación

Edita `src/components/common/LocationSection.jsx`:

1. Obtén el **embed URL** de Google Maps:
   - Busca tu dirección en Google Maps
   - Click en **"Compartir"**
   - Click en **"Insertar un mapa"**
   - Copia el `src` del iframe

2. Reemplaza en el componente

### 7.4 Colores de Marca (Opcional)

Edita `src/index.css` para cambiar los colores:

```css
@theme {
  --color-brand-primary: #d4a5a5;      /* Tu color primario */
  --color-brand-secondary: #f5e6e8;    /* Tu color secundario */
  /* ... más colores */
}
```

---

## ✅ CHECKLIST FINAL

Antes de usar en producción, verifica:

- [ ] Firebase configurado con nuevo proyecto
- [ ] Cloudinary configurado con nueva cuenta
- [ ] Variables de entorno en `.env.local` actualizadas
- [ ] Reglas de Firestore desplegadas
- [ ] Índices de Firestore desplegados
- [ ] Datos iniciales (`settings`, categorías, servicios) creados
- [ ] Usuario administrador creado y rol asignado
- [ ] Logo y favicon actualizados
- [ ] Información de contacto actualizada
- [ ] Build ejecutado sin errores: `npm run build`
- [ ] Proyecto probado en desarrollo: `npm run dev`
- [ ] `.env.local` NO incluido en Git
- [ ] Repositorio Git independiente creado

---

## 🚨 ADVERTENCIAS DE SEGURIDAD

### NO hacer en producción:

❌ Usar las credenciales FALLBACK del código (están marcadas como `PENDIENTE_CONFIGURAR`)  
❌ Commitear `.env.local` al repositorio  
❌ Conectarse al proyecto Firebase de PatyNails  
❌ Usar el Cloud Name de Cloudinary del proyecto anterior  
❌ Publicar API Secrets de Cloudinary en el frontend  
❌ Mantener las reglas de Firestore en modo test (`allow read, write: if true`)  

### Hacer SIEMPRE:

✅ Configurar tus propias credenciales  
✅ Proteger `.env.local` con `.gitignore`  
✅ Desplegar las reglas de seguridad de Firestore  
✅ Crear índices compuestos para las consultas  
✅ Configurar backup automático de Firestore en producción  
✅ Monitorear costos de Firebase y Cloudinary  

---

## 📞 SOPORTE

Si necesitas ayuda:

- **Email:** contacto@codigopy.com
- **WhatsApp:** +595 984 925 322

---

**¡Tu instancia de Mi Turno está lista para usar! 🎉**
