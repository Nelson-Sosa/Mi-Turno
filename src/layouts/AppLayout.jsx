import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { cn } from '@/utils/cn'

/**
 * AppLayout — the main authenticated layout shell.
 * Matches desktop reference width (~280px sidebar, 80px header).
 */
function AppLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-brand-bg font-sans">
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((v) => !v)}
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
      />

      {/* ── Main content area ────────────────────────────────────────────── */}
      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden',
          'transition-all duration-300 ease-in-out',
          // Desktop sidebar width offset
          isCollapsed ? 'lg:ml-20' : 'lg:ml-[280px]'
        )}
      >
        {/* Header (80px height per reference) */}
        <Header onMenuClick={() => setIsMobileOpen(true)} />

        {/* Page content with generous padding (approx 28px) */}
        <main
          id="main-content"
          role="main"
          className="flex-1 overflow-y-auto"
        >
          <div className="min-h-full p-4 sm:p-6 lg:p-7 2xl:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppLayout
