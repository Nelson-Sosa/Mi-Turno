import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

/**
 * Firebase configuration loaded from Vite environment variables.
 * All variables must be prefixed with VITE_ to be exposed to the client.
 * Project: Mi Turno (mi-turno-1fc86)
 */
const FALLBACK = {
  apiKey: 'PENDIENTE_CONFIGURAR',
  authDomain: 'PENDIENTE_CONFIGURAR.firebaseapp.com',
  projectId: 'PENDIENTE_CONFIGURAR',
  storageBucket: 'PENDIENTE_CONFIGURAR.firebasestorage.app',
  messagingSenderId: 'PENDIENTE_CONFIGURAR',
  appId: 'PENDIENTE_CONFIGURAR',
  measurementId: 'PENDIENTE_CONFIGURAR',
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || FALLBACK.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || FALLBACK.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || FALLBACK.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || FALLBACK.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || FALLBACK.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || FALLBACK.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || FALLBACK.measurementId,
}

// Validate before initializing
if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.authDomain) {
  console.error(
    '[FIREBASE] Configuración inválida:',
    { apiKey: !!firebaseConfig.apiKey, projectId: !!firebaseConfig.projectId, authDomain: !!firebaseConfig.authDomain }
  )
} else {
  console.log('[FIREBASE] Inicializando con projectId:', firebaseConfig.projectId)
}

// Prevent re-initialization in HMR (Hot Module Replacement) environments
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Initialize and export Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
