import { NavLink } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'
import { NAV_ITEMS } from '@/constants/navigation'
import { APP_NAME } from '@/constants/app'
import { useAuth } from '@/hooks/useAuth'
import InstagramLink from './InstagramLink'

/**
 * Flower of Lotus SVG Icon matching the top-left logo in the reference.
 */
function LotusLogoIcon({ className }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Central petal */}
      <path
        d="M24 6C24 6 18 16 18 27C18 33 21 36 24 38C27 36 30 33 30 27C30 16 24 6 24 6Z"
        stroke="#E94F89"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left petal */}
      <path
        d="M21 16C15 19 8 26 10 33C11 36 14 38 19 38C21 38 23 37.5 24 37"
        stroke="#E94F89"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right petal */}
      <path
        d="M27 16C33 19 40 26 38 33C37 36 34 38 29 38C27 38 25 37.5 24 37"
        stroke="#E94F89"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Outer base leaves */}
      <path
        d="M6 34C9 39 16 41 24 41C32 41 39 39 42 34"
        stroke="#E94F89"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Sidebar({ isCollapsed, onToggleCollapse, isMobileOpen, onMobileClose }) {
  const { role, loadingRole } = useAuth()

  // Retain only unique and role-allowed items
  const filteredItems = NAV_ITEMS.filter((item) => item.roles.includes(role))

  return (
    <>
      {/* ── Mobile Overlay Backdrop ─────────────────────────────────────── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/25 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar Panel ───────────────────────────────────────────────── */}
      <aside
        id="main-sidebar"
        aria-label="Navegación principal"
        className={cn(
          'fixed top-0 left-0 z-[100] flex h-[100dvh] flex-col',
          'border-r border-brand-border bg-white',
          'transition-all duration-300 ease-in-out',
          'hidden lg:flex',
          isCollapsed ? 'lg:w-20' : 'lg:w-[280px]',
          'lg:!flex',
          isMobileOpen
            ? 'flex !w-[280px] translate-x-0'
            : 'translate-x-[-100%] lg:translate-x-0'
        )}
      >
        {/* ── Logo / Brand ───────────────────────────────────────────── */}
        <div
          className={cn(
            'flex h-20 items-center border-b border-brand-border/60 transition-all',
            isCollapsed ? 'justify-center px-2' : 'gap-3.5 px-6'
          )}
        >
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center">
            <LotusLogoIcon className="h-10 w-10 text-brand-primary" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xl font-bold tracking-tight text-brand-text leading-tight">
                {APP_NAME}
              </span>
              <span className="text-xs text-brand-text-muted font-normal leading-tight">
                Tu tiempo, tu belleza
              </span>
            </div>
          )}
        </div>

        {/* ── Navigation Items ───────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-5 px-3">
          {loadingRole ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-pastel border-t-brand-primary" />
            </div>
          ) : (
            <ul className="flex flex-col gap-1.5" role="list">
              {filteredItems.map((item) => (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    title={isCollapsed ? item.label : undefined}
                    onClick={() => {
                      if (isMobileOpen) onMobileClose()
                    }}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex items-center rounded-2xl transition-all duration-200',
                        'min-h-[48px] font-medium text-sm',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50',
                        isCollapsed ? 'justify-center px-2' : 'px-4 gap-3.5',
                        isActive
                          ? 'bg-brand-pastel text-brand-primary font-semibold'
                          : 'text-brand-text-muted hover:bg-brand-pastel/35 hover:text-brand-text'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Vertical Indicator on active (left edge) */}
                        {isActive && (
                          <span
                            aria-hidden="true"
                            className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-brand-primary"
                          />
                        )}
                        <item.icon
                          className={cn(
                            'h-5 w-5 flex-shrink-0 stroke-[2] transition-colors duration-200',
                            isActive
                              ? 'text-brand-primary'
                              : 'text-brand-text-muted group-hover:text-brand-text'
                          )}
                          aria-hidden="true"
                        />
                        {!isCollapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </nav>

        {/* ── Bottom Section: Pro Plan Banner + Instagram + Collapse ──────────── */}
        <div className="flex flex-col gap-3 border-t border-brand-border/60 p-4">

          {/* Instagram link */}
          <InstagramLink isCollapsed={isCollapsed} onMobileClose={onMobileClose} />

          {/* Collapse Toggle Button */}
          <div className="hidden lg:block">
            <button
              onClick={onToggleCollapse}
              title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
              aria-label={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
              aria-expanded={!isCollapsed}
              aria-controls="main-sidebar"
              className={cn(
                'flex w-full items-center rounded-xl px-3 py-2 min-h-[40px]',
                'text-xs text-brand-text-muted transition-colors duration-200',
                'hover:bg-brand-pastel/30 hover:text-brand-primary',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50',
                isCollapsed ? 'justify-center' : 'gap-2.5'
              )}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  <span>Colapsar menú</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
