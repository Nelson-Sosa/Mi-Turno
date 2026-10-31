import { useState } from 'react'
import { Plus, ChevronLeft, ChevronRight, Calendar, Columns2 } from 'lucide-react'
import { format, addDays, subDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { useAppointmentsByDate } from '@/hooks/useAppointments'
import { useServices } from '@/hooks/useServices'
import { cn } from '@/utils/cn'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import AppointmentCard from './AppointmentCard'
import NewAppointmentModal from './NewAppointmentModal'
import WeeklyAgendaView from './WeeklyAgendaView'

export default function AdminAgendaView() {
  const [viewMode, setViewMode] = useState('weekly')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState(null)

  const { data: appointments, isLoading } = useAppointmentsByDate(selectedDate)
  const { data: services } = useServices()

  const servicePriceMap = {}
  if (services) {
    services.forEach((s) => { servicePriceMap[s.id] = s.price })
  }

  const handlePrevDay = () => setSelectedDate(subDays(selectedDate, 1))
  const handleNextDay = () => setSelectedDate(addDays(selectedDate, 1))
  const handleToday = () => setSelectedDate(new Date())

  if (viewMode === 'weekly') {
    return <WeeklyAgendaView />
  }

  return (
    <div className="flex h-full flex-col gap-6 max-w-7xl mx-auto">
      {/* ── Header & Actions ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-text">Agenda de Turnos</h1>
            <p className="mt-1 text-sm text-brand-text-muted">
              Gestioná los turnos del día y actualizá sus estados.
            </p>
          </div>
          <div className="flex shrink-0 rounded-2xl border border-brand-border bg-white p-1 shadow-sm">
            <button
              onClick={() => setViewMode('weekly')}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all',
                viewMode === 'weekly'
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-brand-text-muted hover:text-brand-text'
              )}
            >
              <Columns2 className="h-3.5 w-3.5" />
              Semanal
            </button>
            <button
              onClick={() => setViewMode('daily')}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all',
                viewMode === 'daily'
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'text-brand-text-muted hover:text-brand-text'
              )}
            >
              <Calendar className="h-3.5 w-3.5" />
              Diario
            </button>
          </div>
        </div>
        <Button 
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => {
            setEditingAppointment(null)
            setIsModalOpen(true)
          }}
          className="rounded-2xl"
        >
          Nuevo Turno
        </Button>
      </div>

      {/* ── Date Navigator ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-2 rounded-2xl border border-brand-border bg-white p-3 shadow-sm">
        <Button variant="ghost" size="sm" onClick={handlePrevDay} leftIcon={<ChevronLeft className="h-5 w-5" />} />
        
        <div className="min-w-0 flex-1 flex flex-col items-center px-1">
          <span className="text-sm sm:text-base font-bold capitalize text-brand-text truncate max-w-full">
            {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
          </span>
          <button onClick={handleToday} className="text-xs font-medium text-brand-primary hover:underline whitespace-nowrap">
            Ir a Hoy
          </button>
        </div>

        <Button variant="ghost" size="sm" onClick={handleNextDay} leftIcon={<ChevronRight className="h-5 w-5" />} />
      </div>

      {/* ── Appointments List ─────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : appointments?.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-brand-border bg-white p-8 text-center shadow-sm">
          <Calendar className="mb-3 h-10 w-10 text-brand-text-muted/40" />
          <p className="text-base font-bold text-brand-text">No hay turnos para este día</p>
          <p className="mt-1 text-xs text-brand-text-muted">Creá un nuevo turno usando el botón superior.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {appointments?.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              price={servicePriceMap[apt.serviceId]}
              onEdit={() => {
                setEditingAppointment(apt)
                setIsModalOpen(true)
              }}
            />
          ))}
        </div>
      )}

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      <NewAppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingAppointment(null)
        }}
        appointment={editingAppointment}
        preselectedDate={selectedDate}
      />
    </div>
  )
}
