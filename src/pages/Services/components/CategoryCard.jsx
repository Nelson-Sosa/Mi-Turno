import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  Edit2,
  Trash2,
  Clock,
  CalendarPlus,
} from 'lucide-react'
import { formatCurrency } from '@/utils/formatters'

function CategoryCard({
  category,
  services = [],
  isAdmin,
  onEditCategory,
  onEditService,
  onDeleteService,
  onBook,
  defaultOpen = true,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="rounded-3xl border border-brand-border bg-white shadow-[0_4px_20px_rgba(30,27,46,0.03)] transition-all duration-200 overflow-hidden">
      {/* ── Category Header Row (Diseño Limpio y Minimalista) ────────── */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsOpen(!isOpen)
          }
        }}
        className="flex w-full items-center justify-between gap-4 px-6 sm:px-8 py-5 sm:py-6 text-left cursor-pointer select-none hover:bg-brand-bg/40 transition-colors"
      >
        {/* Left: Título de Categoría & Descripción (sin icono para máxima limpieza) */}
        <div className="min-w-0 flex-1">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-text truncate">
            {category.name}
          </h3>
          {category.description && (
            <p className="mt-1 text-sm text-brand-text-muted truncate">
              {category.description}
            </p>
          )}
        </div>

        {/* Right: Etiqueta de cantidad | Acciones Admin | Flecha colapsable */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Badge con la cantidad de servicios */}
          <span className="inline-flex items-center justify-center rounded-full bg-brand-pastel px-3.5 py-1 text-xs font-bold text-brand-primary">
            {services.length} {services.length === 1 ? 'servicio' : 'servicios'}
          </span>

          {/* Admin Edit Category */}
          {isAdmin && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onEditCategory(category)
                }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-text-muted hover:bg-brand-pastel hover:text-brand-primary transition-colors"
                title="Editar categoría"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Chevron expand/collapse toggle */}
          <div
            className={`transition-transform duration-300 text-brand-text-muted ${
              isOpen ? 'rotate-0' : '-rotate-90'
            }`}
          >
            <ChevronDown className="h-5 w-5 stroke-[2]" />
          </div>
        </div>
      </div>

      {/* ── Collapsible Services List ─────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="border-t border-brand-border/60" />

            {services.length === 0 ? (
              <div className="p-8 text-center text-sm text-brand-text-muted">
                No hay servicios en esta categoría todavía.
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-brand-border/50 px-6 sm:px-8 py-2">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 transition-colors"
                  >
                    {/* Left: Pink bullet dot + Name & Description */}
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <span className="h-2 w-2 rounded-full bg-brand-primary/60 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm sm:text-base font-semibold text-brand-text truncate">
                          {svc.name}
                        </p>
                        {svc.description && (
                          <p className="text-xs text-brand-text-muted truncate">
                            {svc.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Duration | Price (Green) | Admin Actions OR Client Reservar Button */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-6 shrink-0 pl-5 sm:pl-0">
                      {/* Duration with clock */}
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-brand-text-muted">
                        <Clock className="h-4 w-4 stroke-[1.8]" />
                        <span>{svc.duration} min</span>
                      </div>

                      {/* Price in Bold Green */}
                      <p className="text-sm sm:text-base font-bold text-brand-success tracking-tight">
                        {formatCurrency(svc.price)}
                      </p>

                      {/* Active Status Badge (Admin only) */}
                      {isAdmin && (
                        <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-100">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {svc.active !== false ? 'Activo' : 'Inactivo'}
                        </div>
                      )}

                      {/* Actions: Admin (Edit/Delete) vs Client (Reservar Button) */}
                      {isAdmin ? (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              onEditService(svc)
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-text-muted hover:bg-brand-pastel hover:text-brand-primary transition-colors"
                            title="Editar servicio"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeleteService(svc)
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-text-muted hover:bg-red-50 hover:text-red-500 transition-colors"
                            title="Eliminar servicio"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onBook?.(svc.id)}
                          className="flex items-center gap-1.5 rounded-xl bg-brand-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-sm shadow-brand-primary/20 hover:bg-brand-primary-hover active:scale-95 transition-all"
                        >
                          <CalendarPlus className="h-3.5 w-3.5" />
                          <span>Reservar</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CategoryCard
