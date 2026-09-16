import { useMemo, useState } from 'react'
import { Zap, Shuffle, ArrowRight, ArrowLeft, RotateCw } from 'lucide-react'
import { rapidFireQuestions } from '../data'
import { SearchBar } from '../components/SearchBar'

function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function RapidFire() {
  const [order, setOrder] = useState<string[]>(() => rapidFireQuestions.map((q) => q.id))
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [search, setSearch] = useState('')
  const [knownCount, setKnownCount] = useState(0)

  const byId = useMemo(() => new Map(rapidFireQuestions.map((q) => [q.id, q])), [])

  const filteredIds = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return order
    return order.filter((id) => {
      const q = byId.get(id)!
      return `${q.question} ${q.answer} ${q.tags.join(' ')}`.toLowerCase().includes(term)
    })
  }, [order, search, byId])

  const current = filteredIds.length > 0 ? byId.get(filteredIds[index % filteredIds.length]) : undefined

  function goNext(known: boolean) {
    if (known) setKnownCount((c) => c + 1)
    setFlipped(false)
    setIndex((i) => (filteredIds.length === 0 ? 0 : (i + 1) % filteredIds.length))
  }

  function goPrevious() {
    setFlipped(false)
    setIndex((i) => (filteredIds.length === 0 ? 0 : (i - 1 + filteredIds.length) % filteredIds.length))
  }

  function handleShuffle() {
    setOrder(shuffle(rapidFireQuestions.map((q) => q.id)))
    setIndex(0)
    setFlipped(false)
    setKnownCount(0)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Zap size={18} className="text-amber-500" />
            <h1 className="text-xl font-bold text-navy-900">Rapid Fire</h1>
          </div>
          <p className="text-sm text-slate-500">
            {rapidFireQuestions.length} short technical questions with short, memorable answers. Click a card to
            reveal the answer.
          </p>
        </div>
        <button
          type="button"
          onClick={handleShuffle}
          className="focus-ring flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50"
        >
          <Shuffle size={16} />
          Shuffle
        </button>
      </div>

      <div className="max-w-md">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setIndex(0); setFlipped(false) }} placeholder="Search rapid fire questions..." />
      </div>

      {!current ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">No rapid fire questions match your search.</p>
        </div>
      ) : (
        <div className="mx-auto max-w-xl">
          <p className="mb-3 text-center text-xs font-semibold text-slate-400">
            Card {(index % filteredIds.length) + 1} of {filteredIds.length} • Known this round: {knownCount}
          </p>
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="focus-ring flex min-h-[220px] w-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all hover:shadow-md"
          >
            {!flipped ? (
              <>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-600">Question</p>
                <p className="text-xl font-semibold text-navy-900">{current.question}</p>
                <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
                  <RotateCw size={13} /> Click to reveal answer
                </p>
              </>
            ) : (
              <>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-emerald-600">Answer</p>
                <p className="text-lg font-medium leading-snug text-navy-900">{current.answer}</p>
              </>
            )}
          </button>

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={goPrevious}
              className="focus-ring flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <ArrowLeft size={16} />
              Previous
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => goNext(false)}
                className="focus-ring rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Review Again
              </button>
              <button
                type="button"
                onClick={() => goNext(true)}
                className="focus-ring flex items-center gap-1.5 rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
              >
                I Knew It
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
