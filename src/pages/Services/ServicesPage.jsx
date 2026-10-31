import { useState, useMemo } from 'react'
import { Scissors, Plus, Search, X, FolderPlus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAuth } from '@/hooks/useAuth'
import { useServices, useAllServices, useDeleteService } from '@/hooks/useServices'
import { useCategories } from '@/hooks/useServiceCategories'
import { ROUTES } from '@/routes/routes'
import { USER_ROLES } from '@/constants/app'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import CategoryCard from './components/CategoryCard'
import ServiceModal from './components/ServiceModal'
import CategoryModal from './components/CategoryModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import toast from 'react-hot-toast'

function ServicesPage() {
  usePageTitle('Servicios')
  const navigate = useNavigate()

  const { role } = useAuth()
  const isAdmin = role === USER_ROLES.ADMIN

  const [serviceModalOpen, setServiceModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [preSelectedCategoryId, setPreSelectedCategoryId] = useState(null)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [serviceToDelete, setServiceToDelete] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const allServicesQuery = useAllServices({ enabled: isAdmin })
  const activeServicesQuery = useServices({ enabled: !isAdmin })
  const { data: rawServices, isLoading } = isAdmin ? allServicesQuery : activeServicesQuery
  const { data: categories } = useCategories()
  const { mutateAsync: deleteService, isPending: isDeleting } = useDeleteService()

  const grouped = useMemo(() => {
    if (!rawServices) return { categories: [], uncategorized: [] }

    const query = searchQuery.toLowerCase().trim()

    // Create a map of categories for quick lookup
    const categoryMap = (categories || []).reduce((acc, cat) => {
      acc[cat.id] = cat
      return acc
    }, {})

    // Filter services based on query
    const filteredServices = rawServices.filter((svc) => {
      if (!query) return true

      const serviceNameMatch = svc.name?.toLowerCase().includes(query)
      const serviceDescMatch = svc.description?.toLowerCase().includes(query)
      const cat = categoryMap[svc.categoryId]
      const categoryMatch = cat?.name?.toLowerCase().includes(query)

      return serviceNameMatch || serviceDescMatch || categoryMatch
    })

    const catMap = {}
    const uncategorized = []

    filteredServices.forEach((svc) => {
      const catId = svc.categoryId
      if (catId && categoryMap[catId]) {
        if (!catMap[catId]) catMap[catId] = []
        catMap[catId].push(svc)
      } else {
        uncategorized.push(svc)
      }
    })

    const result = (categories || [])
      .map((cat) => ({
        category: cat,
        services: catMap[cat.id] || [],
      }))
      .filter((g) => g.services.length > 0 || (isAdmin && (!query || g.category.name.toLowerCase().includes(query))))

    return { categories: result, uncategorized }
  }, [rawServices, categories, isAdmin, searchQuery])

  const handleBookService = (serviceId) => {
    navigate(ROUTES.BOOKING, { state: { selectedServiceId: serviceId } })
  }

  const handleEditService = (service) => {
    setSelectedService(service)
    setPreSelectedCategoryId(null)
    setServiceModalOpen(true)
  }

  const handleAddServiceInCategory = (category) => {
    setSelectedService(null)
    setPreSelectedCategoryId(category.id)
    setServiceModalOpen(true)
  }

  const handleAddServiceGeneric = () => {
    setSelectedService(null)
    setPreSelectedCategoryId(null)
    setServiceModalOpen(true)
  }

  const handleEditCategory = (category) => {
    setSelectedCategory(category)
    setCategoryModalOpen(true)
  }

  const handleCloseServiceModal = () => {
    setSelectedService(null)
    setPreSelectedCategoryId(null)
    setServiceModalOpen(false)
  }

  const handleCloseCategoryModal = () => {
    setSelectedCategory(null)
    setCategoryModalOpen(false)
  }

  const handleDeleteService = async () => {
    if (!serviceToDelete) return
    try {
      await deleteService(serviceToDelete.id)
      toast.success('Servicio eliminado')
      setServiceToDelete(null)
    } catch {
      toast.error('Ocurrió un error al eliminar')
    }
  }

  const hasAnyServices = rawServices?.length > 0
  const hasFilteredServices = grouped.categories.length > 0 || grouped.uncategorized.length > 0

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Main 88x88px icon box per reference */}
          <div className="flex h-16 w-16 sm:h-[88px] sm:w-[88px] shrink-0 items-center justify-center rounded-3xl bg-brand-pastel text-brand-primary shadow-sm shadow-brand-primary/10">
            <Scissors className="h-8 w-8 sm:h-11 sm:w-11 stroke-[1.8]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-text">
              Catálogo de Servicios
            </h1>
            <p className="mt-1 text-sm sm:text-base text-brand-text-muted">
              Explorá nuestros servicios y reservá tu turno.
            </p>
          </div>
        </div>

        {isAdmin && (
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="md"
              leftIcon={<FolderPlus className="h-4 w-4" />}
              onClick={() => setCategoryModalOpen(true)}
              className="border-brand-border bg-white text-brand-text hover:bg-brand-pastel/30 rounded-2xl"
            >
              Nueva Categoría
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={handleAddServiceGeneric}
              className="rounded-2xl"
            >
              Nuevo Servicio
            </Button>
          </div>
        )}
      </div>

      {/* ── Search Bar (approx 575px width on desktop) ──────────────────────── */}
      {hasAnyServices && (
        <div className="relative w-full max-w-[575px]">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-brand-text-muted/70 stroke-[2]" />
          </div>
          <input
            type="text"
            className="w-full rounded-full border border-brand-border bg-white py-3 pl-12 pr-11 text-sm text-brand-text placeholder-brand-text-muted/70 shadow-sm transition-all focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            placeholder="Buscar por nombre, descripción o categoría..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-brand-text-muted hover:text-brand-text transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* ── Categories List ─────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : hasAnyServices ? (
        hasFilteredServices ? (
          <div className="flex flex-col gap-6">
            {/* Grouped by category */}
            {grouped.categories.map(({ category, services }) => (
              <CategoryCard
                key={category.id}
                category={category}
                services={services}
                isAdmin={isAdmin}
                onEditCategory={handleEditCategory}
                onAddService={handleAddServiceInCategory}
                onEditService={handleEditService}
                onDeleteService={setServiceToDelete}
                onBook={handleBookService}
                defaultOpen
              />
            ))}

            {/* Uncategorized section */}
            {grouped.uncategorized.length > 0 && (
              <CategoryCard
                category={{ name: 'Sin categoría', description: 'Servicios generales' }}
                services={grouped.uncategorized}
                isAdmin={isAdmin}
                onEditCategory={() => {}}
                onAddService={handleAddServiceGeneric}
                onEditService={handleEditService}
                onDeleteService={setServiceToDelete}
                onBook={handleBookService}
                defaultOpen={grouped.categories.length === 0}
              />
            )}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-brand-border bg-white p-8 text-center shadow-sm">
            <Search className="mb-3 h-10 w-10 text-brand-text-muted/40" />
            <p className="text-lg font-bold text-brand-text">No se encontraron servicios</p>
            <p className="mt-1 text-sm text-brand-text-muted">Intentá con otros términos de búsqueda.</p>
          </div>
        )
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-brand-border bg-white p-8 text-center shadow-sm">
          <Scissors className="mb-3 h-10 w-10 text-brand-text-muted/40" />
          <p className="text-lg font-bold text-brand-text">No hay servicios disponibles</p>
          <p className="mt-1 text-sm text-brand-text-muted">Creá tu primera categoría y servicio desde los botones superiores.</p>
        </div>
      )}

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      {(serviceModalOpen || selectedService) && (
        <ServiceModal
          isOpen={serviceModalOpen || !!selectedService}
          onClose={handleCloseServiceModal}
          service={selectedService}
          defaultCategoryId={preSelectedCategoryId}
        />
      )}

      {(categoryModalOpen || selectedCategory) && (
        <CategoryModal
          isOpen={categoryModalOpen || !!selectedCategory}
          onClose={handleCloseCategoryModal}
          category={selectedCategory}
        />
      )}

      <ConfirmDialog
        isOpen={!!serviceToDelete}
        onClose={() => setServiceToDelete(null)}
        onConfirm={handleDeleteService}
        title="Eliminar Servicio"
        message={`¿Estás seguro que querés eliminar el servicio "${serviceToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default ServicesPage
