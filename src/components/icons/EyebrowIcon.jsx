/* Cejas — uses the branded eyebrow-pencil illustration asset.
   Rendered as an <img> from the public folder so it scales cleanly
   (crisp at 2x on the small CategoryCard badge). */
export function EyebrowIcon({ className, ...props }) {
  return (
    <img
      src="/lapiz-de-cejas.png"
      alt="Cejas"
      draggable={false}
      className={className}
      {...props}
    />
  )
}

export default EyebrowIcon