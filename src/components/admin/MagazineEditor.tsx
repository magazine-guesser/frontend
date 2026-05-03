import { useCallback, useEffect, useMemo, useState } from 'react'
import type { MagazinePoolEntry, Redaction } from '../../api/types'
import { RedactionCanvas } from './RedactionCanvas'
import { loadImage } from './imageCache'

interface Props {
  value: MagazinePoolEntry
  onChange: (value: MagazinePoolEntry) => void
}

export const defaultMagazine = (): MagazinePoolEntry => ({
  identifier: '',
  title: '',
  year: new Date().getFullYear(),
  pageRanges: [[1, 10]],
  redactions: [],
})

function buildPageList(pageRanges: MagazinePoolEntry['pageRanges']): number[] {
  const pages: number[] = [0]
  for (const [start, end] of pageRanges) {
    for (let p = start; p <= end; p += 1) {
      pages.push(p)
    }
  }
  return [...new Set(pages)].sort((a, b) => a - b)
}

export function MagazineEditor({ value, onChange }: Props) {
  const [seqIndex, setSeqIndex] = useState(0)
  const [loadProgress, setLoadProgress] = useState({ identifier: '', loaded: 0, total: 0 })

  const pages = useMemo(() => buildPageList(value.pageRanges), [value.pageRanges])

  useEffect(() => {
    if (!value.identifier || pages.length === 0) return
    let loaded = 0
    let cancelled = false
    const total = pages.length
    pages.forEach((pageIndex) => {
      loadImage(value.identifier, pageIndex)
        .catch(() => {})
        .finally(() => {
          if (!cancelled) {
            loaded += 1
            setLoadProgress({ identifier: value.identifier, loaded, total })
          }
        })
    })
    return () => {
      cancelled = true
    }
  }, [value.identifier, pages])

  const isLoading =
    !!value.identifier &&
    (loadProgress.identifier !== value.identifier || loadProgress.loaded < loadProgress.total)
  const loadedCount = loadProgress.identifier === value.identifier ? loadProgress.loaded : 0

  const activePageIndex = pages[Math.min(seqIndex, pages.length - 1)] ?? 0
  const canPrev = seqIndex > 0
  const canNext = seqIndex < pages.length - 1

  const handlePrev = useCallback(() => {
    if (canPrev) setSeqIndex((i) => i - 1)
  }, [canPrev])

  const handleNext = useCallback(() => {
    if (canNext) setSeqIndex((i) => i + 1)
  }, [canNext])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handlePrev, handleNext])

  function set<K extends keyof MagazinePoolEntry>(key: K, val: MagazinePoolEntry[K]) {
    onChange({ ...value, [key]: val })
  }

  function setPageRange(i: number, side: 0 | 1, val: number) {
    onChange({
      ...value,
      pageRanges: value.pageRanges.map((pair, idx) =>
        idx === i
          ? ([side === 0 ? val : pair[0], side === 1 ? val : pair[1]] as [number, number])
          : pair
      ),
    })
  }

  function handleAddRedaction(partial: Omit<Redaction, 'page'>) {
    onChange({
      ...value,
      redactions: [...value.redactions, { ...partial, page: activePageIndex }],
    })
  }

  function handleRemoveRedaction(indexInFull: number) {
    onChange({
      ...value,
      redactions: value.redactions.filter((_, i) => i !== indexInFull),
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Fields */}
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-sepia-400 font-mono">Identifier</span>
          <input
            className="bg-charcoal-800 border border-charcoal-600 rounded px-2 py-1 text-sm font-mono text-sepia-100 focus:outline-none focus:border-gold-500"
            value={value.identifier}
            onChange={(e) => set('identifier', e.target.value)}
            placeholder="e.g. vogue196506"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-sepia-400 font-mono">Title</span>
          <input
            className="bg-charcoal-800 border border-charcoal-600 rounded px-2 py-1 text-sm font-mono text-sepia-100 focus:outline-none focus:border-gold-500"
            value={value.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. Vogue"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-sepia-400 font-mono">Year (answer)</span>
          <input
            type="number"
            min={1850}
            max={2099}
            className="bg-charcoal-800 border border-charcoal-600 rounded px-2 py-1 text-sm font-mono text-sepia-100 focus:outline-none focus:border-gold-500"
            value={value.year || ''}
            onChange={(e) => set('year', parseInt(e.target.value, 10) || 0)}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-sepia-400 font-mono">Start page (optional)</span>
          <input
            type="number"
            min={0}
            className="bg-charcoal-800 border border-charcoal-600 rounded px-2 py-1 text-sm font-mono text-sepia-100 focus:outline-none focus:border-gold-500"
            value={value.startPage ?? ''}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10)
              set('startPage', isNaN(v) ? undefined : v)
            }}
          />
        </label>
      </div>

      {/* Page ranges */}
      <div className="flex flex-col gap-2">
        <span className="text-xs text-sepia-400 font-mono">Page ranges</span>
        {value.pageRanges.map((pair, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              className="w-20 bg-charcoal-800 border border-charcoal-600 rounded px-2 py-1 text-sm font-mono text-sepia-100 focus:outline-none focus:border-gold-500"
              value={pair[0]}
              onChange={(e) => setPageRange(i, 0, parseInt(e.target.value, 10) || 0)}
            />
            <span className="text-sepia-500 font-mono">–</span>
            <input
              type="number"
              min={0}
              className="w-20 bg-charcoal-800 border border-charcoal-600 rounded px-2 py-1 text-sm font-mono text-sepia-100 focus:outline-none focus:border-gold-500"
              value={pair[1]}
              onChange={(e) => setPageRange(i, 1, parseInt(e.target.value, 10) || 0)}
            />
            {value.pageRanges.length > 1 && (
              <button
                className="text-red-400 hover:text-red-300 text-xs font-mono"
                onClick={() =>
                  onChange({ ...value, pageRanges: value.pageRanges.filter((_, idx) => idx !== i) })
                }
              >
                x
              </button>
            )}
          </div>
        ))}
        <button
          className="self-start text-xs text-gold-400 hover:text-gold-300 font-mono"
          onClick={() => onChange({ ...value, pageRanges: [...value.pageRanges, [1, 2]] })}
        >
          + Add range
        </button>
      </div>

      {/* Page navigation + canvas */}
      {pages.length > 0 && value.identifier && (
        <div className="flex flex-col gap-2">
          {isLoading ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono text-sepia-400">
                <span>Loading pages…</span>
                <span>
                  {loadedCount} / {pages.length}
                </span>
              </div>
              <div className="h-1 w-full bg-charcoal-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-500 rounded-full transition-all duration-150"
                  style={{ width: `${(loadedCount / pages.length) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={!canPrev}
                  aria-label="Previous page"
                  className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                    canPrev
                      ? 'border-charcoal-500 text-sepia-200 hover:border-gold-400/60 hover:text-gold-300 cursor-pointer'
                      : 'border-charcoal-700 text-sepia-600 cursor-not-allowed'
                  }`}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <span className="font-mono text-xs text-sepia-600 min-w-[4rem] text-center">
                  {seqIndex + 1}/{pages.length}
                </span>
                <button
                  onClick={handleNext}
                  disabled={!canNext}
                  aria-label="Next page"
                  className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                    canNext
                      ? 'border-charcoal-500 text-sepia-200 hover:border-gold-400/60 hover:text-gold-300 cursor-pointer'
                      : 'border-charcoal-700 text-sepia-600 cursor-not-allowed'
                  }`}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              <RedactionCanvas
                identifier={value.identifier}
                pageIndex={activePageIndex}
                redactions={value.redactions}
                onAddRedaction={handleAddRedaction}
                onRemoveRedaction={handleRemoveRedaction}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
