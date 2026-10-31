import { TrendingUp, Users, CalendarDays, Landmark, Clock } from 'lucide-react'
import BenefitsCard from './components/BenefitsCard'
import LoyaltyAdminPanel from './components/LoyaltyAdminPanel'
import { useAuth } from '@/hooks/useAuth'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import { formatCurrency } from '@/utils/formatters'
import { APPOINTMENT_STATUS, STATUS_CONFIG } from '@/constants/app'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/routes'

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

function DashboardPage() {
  usePageTitle('Inicio')

  const { user, userProfile } = useAuth()
  const { data: stats, isLoading } = useDashboardStats()

  const displayName = userProfile?.displayName || user?.displayName || 'Bienvenida'
  const firstName = displayName.split(' ')[0]

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'
  const dateStr = `${DAYS[now.getDay()]} ${now.getDate()} de ${MONTHS[now.getMonth()]}`

  const totalDone = stats?.topServices?.reduce((sum, s) => sum + s.count, 0) || 1

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto animate-fade-in">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-text">
            {greeting}, {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-brand-text-muted">
            Resumen operativo del salón &bull; <span className="capitalize">{dateStr}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-brand-border bg-white px-4 py-1.5 text-xs font-semibold text-brand-text shadow-sm">
          <span className="h-2 w-2 rounded-full bg-brand-success" />
          En vivo
        </div>
      </div>

      {/* ── Metric Cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { icon: CalendarDays, value: stats?.todayAppointmentsCount ?? 0, label: 'Turnos hoy', color: 'text-brand-primary', bg: 'bg-brand-pastel' },
          { icon: Users, value: stats?.totalClients ?? 0, label: 'Clientes totales', color: 'text-sky-500', bg: 'bg-sky-50' },
          { icon: TrendingUp, value: formatCurrency(stats?.todayIncome ?? 0), label: 'Ingresos hoy', color: 'text-brand-success', bg: 'bg-emerald-50' },
          { icon: Landmark, value: formatCurrency(stats?.monthIncome ?? 0), label: 'Ingresos del mes', color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map(({ icon: Icon, value, label, color, bg }) => (
          <div
            key={label}
            className="group flex flex-col rounded-3xl border border-brand-border bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(30,27,46,0.03)] transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${bg}`}>
              <Icon className={`h-5 w-5 ${color} stroke-[2]`} />
            </div>
            <p className="truncate text-xl font-bold tracking-tight text-brand-text sm:text-2xl xl:text-3xl">{value}</p>
            <p className="mt-1 truncate text-xs font-medium text-brand-text-muted">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Loyalty Program (Admin Panel) ──────────────────────────────────── */}
      <LoyaltyAdminPanel />

      {/* ── Main Content Grid ──────────────────────────────────────────────── */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Agenda de Hoy (spans 2 cols) */}
        <div className="xl:col-span-2">
          <Card>
            <Card.Header
              title="Agenda de Hoy"
              action={
                <Link to={ROUTES.APPOINTMENTS} className="text-xs font-bold text-brand-primary hover:underline">
                  Ver todos &rarr;
                </Link>
              }
            />
            <Card.Body className="space-y-3">
              {stats?.todayAppointmentsList?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CalendarDays className="mb-3 h-8 w-8 text-brand-text-muted/40" />
                  <p className="text-sm font-medium text-brand-text-muted">No hay turnos agendados para hoy.</p>
                </div>
              ) : (
                stats?.todayAppointmentsList?.slice(0, 5).map((app) => {
                  const cfg = STATUS_CONFIG[app.status] || STATUS_CONFIG[APPOINTMENT_STATUS.PENDING]
                  const initial = (app.clientName || '?')[0].toUpperCase()
                  return (
                    <div
                      key={app.id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-brand-border/60 bg-white p-4 transition-all hover:bg-brand-bg/40"
                    >
                      {/* Left: Time + Avatar + Info */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span className="text-sm font-bold text-brand-text w-12 shrink-0">{app.time}</span>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-pastel text-xs font-bold text-brand-primary">
                          {initial}
                        </div>
                        <div className="min-w-0 truncate">
                          <p className="font-semibold text-brand-text truncate">{app.clientName}</p>
                          <p className="text-xs text-brand-text-muted truncate">{app.serviceName}</p>
                        </div>
                      </div>

                      {/* Right: Price + Status */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-bold text-brand-success">{formatCurrency(app.price)}</span>
                        <Badge variant={cfg.variant} size="sm">{cfg.label}</Badge>
                      </div>
                    </div>
                  )
                })
              )}
            </Card.Body>
          </Card>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <BenefitsCard />

          {/* Próximo Turno */}
          <Card>
            <Card.Header title="Próximo Turno" />
            <Card.Body>
              {stats?.nextAppointment ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-50">
                      <Clock className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold tracking-tight text-brand-text">
                        {stats.nextAppointment.time}
                      </p>
                      <p className="text-sm text-brand-text-muted">{stats.nextAppointment.clientName}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-brand-border bg-brand-bg/50 px-4 py-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-brand-text-muted">Servicio</span>
                      <span className="font-semibold text-brand-text">{stats.nextAppointment.serviceName}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-brand-text-muted text-sm">
                  <Clock className="mb-2 h-6 w-6 text-brand-text-muted/40" />
                  No hay próximos turnos.
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
