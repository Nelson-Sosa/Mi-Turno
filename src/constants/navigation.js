import {
  Home,
  CalendarDays,
  CalendarPlus,
  Users,
  Settings,
  UserCircle,
  LayoutGrid,
} from 'lucide-react'
import { ROUTES } from '@/routes/routes'

/**
 * Main navigation items for the Sidebar.
 * Clean, focused order:
 * 1. Inicio
 * 2. Turnos
 * 3. Clientes
 * 4. Servicios
 * 5. Configuración
 * 6. Mi Perfil
 */
export const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Inicio',
    path: ROUTES.DASHBOARD,
    icon: Home,
    description: 'Resumen general',
    roles: ['admin'],
  },
  {
    id: 'user-dashboard',
    label: 'Inicio',
    path: ROUTES.USER_DASHBOARD,
    icon: Home,
    description: 'Panel de fidelización',
    roles: ['user'],
  },
  {
    id: 'appointments',
    label: 'Turnos',
    path: ROUTES.APPOINTMENTS,
    icon: CalendarDays,
    description: 'Gestión de turnos',
    roles: ['admin', 'user'],
  },
  {
    id: 'clients',
    label: 'Clientes',
    path: ROUTES.CLIENTS,
    icon: Users,
    description: 'Base de clientes',
    roles: ['admin'],
  },
  {
    id: 'services',
    label: 'Servicios',
    path: ROUTES.SERVICES,
    icon: LayoutGrid,
    description: 'Servicios y precios',
    roles: ['admin', 'user'],
  },
  {
    id: 'booking',
    label: 'Reservar',
    path: ROUTES.BOOKING,
    icon: CalendarPlus,
    description: 'Reservar un turno',
    roles: ['user'],
  },
  {
    id: 'settings',
    label: 'Configuración',
    path: ROUTES.SETTINGS,
    icon: Settings,
    description: 'Ajustes del sistema',
    roles: ['admin'],
  },
  {
    id: 'profile',
    label: 'Mi Perfil',
    path: ROUTES.PROFILE,
    icon: UserCircle,
    description: 'Datos y preferencias',
    roles: ['admin', 'user'],
  },
]
