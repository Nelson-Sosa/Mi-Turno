import { cn } from '@/utils/cn'

/**
 * Card component with header, body, and footer slot support.
 * Features 24px rounded corners (`rounded-3xl`), white surface,
 * subtle border and light elevation matching the reference visual style.
 */
function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-brand-border bg-white',
        'shadow-[0_2px_12px_rgba(30,27,46,0.03)]',
        'transition-all duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Card.Header — Title + optional action slot
 */
Card.Header = function CardHeader({ title, description, action, className }) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 border-b border-brand-border/60 px-6 py-5',
        className
      )}
    >
      <div>
        {title && <h3 className="text-lg font-bold text-brand-text">{title}</h3>}
        {description && (
          <p className="mt-0.5 text-sm text-brand-text-muted">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}

/**
 * Card.Body — Main content area with default padding
 */
Card.Body = function CardBody({ children, className, noPadding = false }) {
  return (
    <div className={cn(!noPadding && 'px-6 py-5', className)}>{children}</div>
  )
}

/**
 * Card.Footer — Footer area with border separator
 */
Card.Footer = function CardFooter({ children, className }) {
  return (
    <div
      className={cn(
        'border-t border-brand-border/60 px-6 py-4',
        className
      )}
    >
      {children}
    </div>
  )
}

export default Card
