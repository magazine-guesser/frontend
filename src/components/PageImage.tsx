import { useEffect, useRef, useState } from 'react'
import { api } from '../api'
import type { Redaction } from '../api/types'

interface Props {
  identifier: string
  pageIndex: number
  side: 'left' | 'right'
  redactions: Redaction[]
}

export function PageImage({ identifier, pageIndex, side, redactions }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    const img = new Image()

    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      ctx.drawImage(img, 0, 0)

      ctx.fillStyle = '#000'
      for (const r of redactions.filter((r) => r.page === pageIndex)) {
        ctx.fillRect(r.x, r.y, r.width, r.height)
      }

      setLoaded(true)
    }

    img.onerror = () => setLoadFailed(true)
    img.src = api.getPageUrl(identifier, pageIndex, 1200)

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [identifier, pageIndex, redactions])

  return (
    <div className="relative w-full h-full bg-charcoal-800">
      {!loaded && !loadFailed && (
        <div className="absolute inset-0 animate-pulse flex items-center justify-center bg-charcoal-800">
          <div className="w-7 h-7 border-2 border-sepia-300/20 border-t-gold-400 rounded-full animate-spin" />
        </div>
      )}
      {loadFailed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-sepia-400/40 gap-2 bg-charcoal-800">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="font-mono text-xs">Page {pageIndex + 1}</span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        aria-label={`Magazine page ${pageIndex + 1} (${side})`}
        className={`w-full h-full transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}
