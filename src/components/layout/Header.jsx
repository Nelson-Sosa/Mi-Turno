import { Menu, Bell, ChevronDown, User as UserIcon } from 'lucide-react'
import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useUnreadCount } from '@/hooks/useNotifications'
import { cn } from '@/utils/cn'
import { getInitials } from '@/utils/formatters'
import { APP_NAME } from '@/constants/app'
import { ROUTES } from '@/routes/routes'
import { Z_INDEX } from '@/constants/zIndex'
import DropdownPortal from '@/components/ui/DropdownPortal'
import NotificationsPanel from '@/components/notifications/NotificationsPanel'
import UserMenuDropdown from './UserMenuDropdown'

function Header({ onMenuClick }) {
  const { user, userProfile, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const { data: unreadCount = 0 } = useUnreadCount()

  const bellRef = useRef(null)
  const avatarRef = useRef(null)

  const displayName = userProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || ''
  const email = user?.email || ''
  const initials = getInitials(displayName) || (user?.email ? user.email.slice(0, 2).toUpperCase() : '')
  const isAdmin = userProfile?.role === 'admin'

  const handleLogout = async () => {
    setIsUserMenuOpen(false)
    await logout()
    navigate(ROUTES.LOGIN)
  }

  const toggleNotifications = useCallback(() => {
    setIsNotificationsOpen((v) => {
      if (!v) setIsUserMenuOpen(false)
      return !v
    })
  }, [])

  const toggleUserMenu = useCallback(() => {
    setIsUserMenuOpen((v) => {
      if (!v) setIsNotificationsOpen(false)
      return !v
    })
  }, [])

  return (
    <header
      className="flex h-20 items-center justify-between border-b border-brand-border/70 bg-white/80 px-6 backdrop-blur-md lg:px-8"
      style={{ zIndex: Z_INDEX.HEADER }}
    >
      {/* ── Left: Hamburger (mobile) + Brand ──────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Abrir menú"
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl',
            'text-brand-text-muted transition-colors hover:bg-brand-pastel hover:text-brand-primary',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50',
            'lg:hidden'
          )}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <span className="text-base font-bold text-brand-text lg:hidden">
          {APP_NAME}
        </span>
      </div>

      {/* ── Spacer ────────────────────────────────────────────────────── */}
      <div className="flex-1" />

      {/* ── Right: Notifications Bell + User Profile ──────────────────── */}
      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            {/* Notification Bell */}
            <div>
              <button
                ref={bellRef}
                onClick={toggleNotifications}
                aria-label="Notificaciones"
                className={cn(
                  'relative flex h-11 w-11 items-center justify-center rounded-full border border-brand-border bg-white',
                  'text-brand-text transition-all duration-150 shadow-sm',
                  'hover:bg-brand-pastel/50 hover:text-brand-primary hover:border-brand-primary/30',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50',
                  isNotificationsOpen && 'bg-brand-pastel text-brand-primary border-brand-primary/40'
                )}
              >
                <Bell className="h-5 w-5 stroke-[1.8]" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute 1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-primary px-1 text-[10px] font-bold leading-none text-white animate-badge-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <DropdownPortal
                triggerRef={bellRef}
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                align="right"
              >
                <NotificationsPanel
                  isOpen={isNotificationsOpen}
                  onClose={() => setIsNotificationsOpen(false)}
                />
              </DropdownPortal>
            </div>

            {/* User Menu Trigger */}
            <div>
              <button
                ref={avatarRef}
                id="user-menu-button"
                onClick={toggleUserMenu}
                aria-haspopup="true"
                aria-expanded={isUserMenuOpen}
                aria-controls="user-menu"
                className={cn(
                  'flex items-center gap-3 rounded-full py-1.5 pl-1.5 pr-3 transition-all duration-150',
                  'hover:bg-brand-pastel/30',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50',
                  isUserMenuOpen && 'bg-brand-pastel/40'
                )}
              >
                {/* Avatar Circle with initials */}
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white shadow-sm shadow-brand-primary/25">
                  {initials || <UserIcon className="h-5 w-5" />}
                </div>

                {/* Name + Role */}
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-bold leading-tight text-brand-text">{displayName || 'Usuario'}</p>
                  <p className="text-xs leading-tight text-brand-text-muted mt-0.5">
                    {isAdmin ? 'Administrador' : 'Cliente'}
                  </p>
                </div>

                {/* Chevron icon */}
                <ChevronDown className="h-4 w-4 text-brand-text-muted stroke-[2] ml-0.5" />
              </button>

              <DropdownPortal
                triggerRef={avatarRef}
                isOpen={isUserMenuOpen}
                onClose={() => setIsUserMenuOpen(false)}
                align="right"
              >
                <UserMenuDropdown
                  isOpen={isUserMenuOpen}
                  onClose={() => setIsUserMenuOpen(false)}
                  displayName={displayName}
                  email={email}
                  initials={initials}
                  isAdmin={isAdmin}
                  onLogout={handleLogout}
                />
              </DropdownPortal>
            </div>
          </>
        ) : (
          /* Sesión no iniciada (Invitado / Público) */
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="rounded-xl border border-brand-border bg-white px-4 py-2 text-sm font-semibold text-brand-text hover:bg-brand-pastel/30 transition-colors shadow-sm"
            >
              Iniciar sesión
            </button>
            <button
              onClick={() => navigate(ROUTES.REGISTER)}
              className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-hover transition-colors shadow-sm shadow-brand-primary/20"
            >
              Registrarse
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
