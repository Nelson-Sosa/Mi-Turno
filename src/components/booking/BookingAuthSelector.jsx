import { useState } from 'react'
import { LogIn, UserRound, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/utils/cn'
import Button from '@/components/ui/Button'
import GuestForm from './GuestForm'

/**
 * BookingAuthSelector — ofrece las dos vías de identificación antes de confirmar:
 *   1) Continuar como invitado (abierto por defecto automáticamente)
 *   2) Ingresar con mi cuenta
 *
 * @param {Object} props
 * @param {(e: React.MouseEvent) => void} props.onLogin - Navegar al login
 * @param {(values: {name: string, phone: string, email: string}) => void} props.onGuestSubmit
 * @param {boolean} props.guestSubmitting
 */
export default function BookingAuthSelector({ onLogin, onGuestSubmit, guestSubmitting = false }) {
  // Abierto automáticamente por defecto para agilizar la confirmación directa del cliente
  const [showGuestForm, setShowGuestForm] = useState(true)

  return (
    <div className="space-y-4">
      {/* ── Opción 1: Invitado (Abierto por defecto) ─────────────────────── */}
      <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm">
        <button
          type="button"
          onClick={() => setShowGuestForm((v) => !v)}
          className="flex w-full items-center gap-3.5 text-left cursor-pointer select-none"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-pastel">
            <UserRound className="h-5 w-5 text-brand-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-brand-text">Continuar como invitado</p>
            <p className="mt-0.5 text-xs text-brand-text-muted">
              Solo necesitamos tu nombre y teléfono para confirmar la reserva y enviarte
              información del turno.
            </p>
          </div>
          {showGuestForm ? (
            <ChevronUp className="h-5 w-5 text-brand-text-muted shrink-0" />
          ) : (
            <ChevronDown className="h-5 w-5 text-brand-text-muted shrink-0" />
          )}
        </button>

        <div className={cn('grid transition-all duration-200', showGuestForm ? 'mt-5 grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
          <div className="overflow-hidden">
            {showGuestForm && (
              <GuestForm loading={guestSubmitting} onSubmit={onGuestSubmit} />
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-brand-border" />
        <span className="text-xs font-medium text-brand-text-muted">o si ya tenés cuenta</span>
        <div className="h-px flex-1 bg-brand-border" />
      </div>

      {/* ── Opción 2: Login ─────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-pastel">
            <LogIn className="h-5 w-5 text-brand-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-brand-text">Ingresar con mi cuenta</p>
            <p className="mt-0.5 text-xs text-brand-text-muted">
              Accedé para ver tus turnos, reprogramar citas y acumular beneficios automáticamente.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          fullWidth
          size="md"
          className="mt-4 rounded-xl border-brand-border hover:bg-brand-pastel/30"
          onClick={onLogin}
          leftIcon={<LogIn className="h-4 w-4" />}
        >
          Iniciar sesión
        </Button>
      </div>
    </div>
  )
}
