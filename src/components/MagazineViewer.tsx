import { useEffect, useRef, useState } from 'react'
import { PageImage } from './PageImage'
import { api } from '../api'

interface Props {
  identifier: string
  currentPage: number
  pageCount: number
  onNext: () => void
  onPrev: () => void
}

type Direction = 'next' | 'prev'

export function MagazineViewer({ identifier, currentPage, pageCount, onNext, onPrev }: Props) {
  const [displayPage, setDisplayPage] = useState(currentPage)
  const [transitioning, setTransitioning] = useState(false)
  const [showSkeleton, setShowSkeleton] = useState(false)
  const dirRef = useRef<Direction>('next')

  const canNext = currentPage + 2 < pageCount
  const canPrev = currentPage > 0

  useEffect(() => {
    if (currentPage === displayPage) return
    dirRef.current = currentPage > displayPage ? 'next' : 'prev'

    if (transitioning) return
    setTransitioning(true)
    setShowSkeleton(true)

    setTimeout(() => {
      setDisplayPage(currentPage)
      setTimeout(() => setShowSkeleton(false), 150)
      setTransitioning(false)
    }, 200)
  }, [currentPage])

  // Prefetch next
  useEffect(() => {
    if (currentPage + 2 < pageCount) {
      const a = new Image(); a.src = api.getPageUrl(identifier, currentPage + 2, 400)
      const b = new Image(); b.src = api.getPageUrl(identifier, currentPage + 3, 400)
    }
  }, [identifier, currentPage, pageCount])

  const spreadLabel = `${displayPage + 1}–${Math.min(displayPage + 2, pageCount)} / ${pageCount}`

  return (
    <div className="relative flex flex-col flex-1 min-h-0 bg-charcoal-900 overflow-hidden">
      {/* Outer centering wrapper */}
      <div className="flex flex-1 min-h-0 items-center justify-center p-3">

        <div className="flex h-full gap-1">
          {/* Aspect ratio reserves space for left page */}
          <div className="relative h-full overflow-hidden" style={{ aspectRatio: '0.72' }}>
            <PageImage
              key={`${identifier}-${displayPage}`}
              identifier={identifier}
              pageIndex={displayPage}
              side="left"
            />
          </div>

          {/* Right page */}
          {displayPage + 1 < pageCount ? (
            <div className="relative h-full overflow-hidden" style={{ aspectRatio: '0.72' }}>
              <PageImage
                key={`${identifier}-${displayPage + 1}`}
                identifier={identifier}
                pageIndex={displayPage + 1}
                side="right"
              />
            </div>
          ) : (
            <div className="h-full bg-charcoal-800" style={{ aspectRatio: '0.72' }} />
          )}
        </div>
      </div>

      {/* Loading overlay */}
      <div
        className={`absolute inset-0 bg-charcoal-900 flex items-center justify-center transition-opacity duration-150 pointer-events-none ${
          showSkeleton ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-8 h-8 border-2 border-sepia-300/20 border-t-gold-400 rounded-full animate-spin" />
      </div>

      {/* Nav buttons */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none px-2 sm:px-3">
        <button
          onClick={onPrev}
          disabled={!canPrev || transitioning}
          className={`pointer-events-auto w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-charcoal-900/75 border border-white/10 backdrop-blur-sm transition-all duration-150 ${
            canPrev && !transitioning
              ? 'text-sepia-100 hover:bg-charcoal-700 hover:border-gold-400/40 cursor-pointer'
              : 'text-sepia-100/15 cursor-not-allowed'
          }`}
          aria-label="Previous spread"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={onNext}
          disabled={!canNext || transitioning}
          className={`pointer-events-auto w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-charcoal-900/75 border border-white/10 backdrop-blur-sm transition-all duration-150 ${
            canNext && !transitioning
              ? 'text-sepia-100 hover:bg-charcoal-700 hover:border-gold-400/40 cursor-pointer'
              : 'text-sepia-100/15 cursor-not-allowed'
          }`}
          aria-label="Next spread"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Page counter */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-charcoal-900/70 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
        <span className="font-mono text-xs text-sepia-300/60">{spreadLabel}</span>
      </div>
    </div>
  )
}
