import { Star } from 'lucide-react'

interface FavoriteButtonProps {
  isFavorite: boolean
  onToggle: () => void
}

export function FavoriteButton({ isFavorite, onToggle }: FavoriteButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isFavorite}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      className={[
        'focus-ring rounded-full p-1.5 transition-colors',
        isFavorite ? 'text-amber-500 hover:bg-amber-50' : 'text-slate-300 hover:bg-slate-100 hover:text-amber-500',
      ].join(' ')}
    >
      <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} />
    </button>
  )
}
