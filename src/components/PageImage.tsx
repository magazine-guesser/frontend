import { useState } from 'react'
import { api } from '../api'

interface Props {
  identifier: string
  pageIndex: number
  side: 'left' | 'right'
}

export function PageImage({ identifier, pageIndex, side }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)
  const src = api.getPageUrl(identifier, pageIndex, 1200)

  return (
    // Partent sets container size
    <div className="relative w-full h-full bg-charcoal-800">
      {!loaded && !loadFailed && (
        <div className="absolute inset-0 animate-pulse flex items-center justify-center bg-charcoal-800">
          <div className="w-7 h-7 border-2 border-sepia-300/20 border-t-gold-400 rounded-full animate-spin" />
        </div>
      )}
      {loadFailed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-sepia-400/40 gap-2 bg-charcoal-800">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-mono text-xs">Page {pageIndex + 1}</span>
        </div>
      )}
      <img
        src={src}
        alt={`Magazine page ${pageIndex + 1} (${side})`}
        className={`w-full h-full object-contain transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
        onError={() => { setLoadFailed(true); setLoaded(true) }}
      />
    </div>
  )
}
