interface ProgressBarProps {
  percent: number
  label?: string
  colorClass?: string
  sizeClass?: string
  showPercentLabel?: boolean
}

export function ProgressBar({
  percent,
  label,
  colorClass = 'bg-brand-500',
  sizeClass = 'h-2.5',
  showPercentLabel = false,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent))
  return (
    <div className="w-full">
      {(label || showPercentLabel) && (
        <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-500">
          {label && <span>{label}</span>}
          {showPercentLabel && <span>{clamped}%</span>}
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-slate-100 ${sizeClass}`} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`h-full rounded-full ${colorClass} transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
