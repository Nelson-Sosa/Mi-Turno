import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import Spinner from '@/components/ui/Spinner'

/**
 * Variant → base class mapping
 */
const variantClasses = {
  primary:
    'bg-brand-primary text-white hover:bg-brand-primary-hover active:bg-brand-primary-hover shadow-sm shadow-brand-primary/25 border border-transparent font-semibold',
  secondary:
    'bg-white text-brand-text hover:bg-brand-pastel/30 active:bg-brand-pastel/50 border border-brand-border shadow-sm',
  outline:
    'border border-brand-border bg-white text-brand-text hover:bg-brand-pastel/30 active:bg-brand-pastel/50 hover:border-brand-primary/40',
  ghost:
    'text-brand-text-muted hover:bg-brand-pastel/30 hover:text-brand-primary active:bg-brand-pastel/50',
  danger:
    'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm shadow-red-500/10',
  success:
    'bg-brand-success text-white hover:bg-emerald-600 active:bg-emerald-700',
}

const sizeClasses = {
  xs: 'min-h-[36px] h-7 px-3 text-xs gap-1.5 rounded-xl',
  sm: 'min-h-[40px] h-9 px-3.5 text-sm gap-2 rounded-xl',
  md: 'min-h-[44px] h-10 px-5 text-sm gap-2.5 rounded-2xl',
  lg: 'min-h-[48px] h-12 px-6 text-base gap-2.5 rounded-2xl',
  xl: 'min-h-[52px] h-14 px-7 text-base gap-3 rounded-2xl',
}

const iconSizeMap = {
  xs: 'xs',
  sm: 'xs',
  md: 'sm',
  lg: 'sm',
  xl: 'md',
}

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className,
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={cn(
        'inline-flex items-center justify-center font-medium',
        'transition-all duration-200 ease-in-out cursor-pointer',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <Spinner size={iconSizeMap[size]} label="Cargando..." />
      ) : (
        leftIcon && <span aria-hidden="true" className="shrink-0">{leftIcon}</span>
      )}
      {children}
      {!loading && rightIcon && <span aria-hidden="true" className="shrink-0">{rightIcon}</span>}
    </button>
  )
})

export default Button
