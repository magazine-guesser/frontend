import { useEffect, useRef, useState } from 'react'
import type { Redaction } from '../../api/types'
import { loadImage } from './imageCache'

interface Props {
  identifier: string
  pageIndex: number
  redactions: Redaction[]
  onAddRedaction: (r: Omit<Redaction, 'page'>) => void
  onRemoveRedaction: (indexInFull: number) => void
}

type Mode = 'draw' | 'delete'

function clientToCanvas(
  e: React.MouseEvent<HTMLCanvasElement>,
  canvas: HTMLCanvasElement
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  return {
    x: Math.round((e.clientX - rect.left) * scaleX),
    y: Math.round((e.clientY - rect.top) * scaleY),
  }
}

function findRedactionAt(
  pos: { x: number; y: number },
  redactions: Redaction[],
  pageIndex: number
): number | null {
  for (let i = redactions.length - 1; i >= 0; i--) {
    const r = redactions[i]
    if (r.page !== pageIndex) continue
    if (pos.x >= r.x && pos.x <= r.x + r.width && pos.y >= r.y && pos.y <= r.y + r.height) {
      return i
    }
  }
  return null
}

export function RedactionCanvas({
  identifier,
  pageIndex,
  redactions,
  onAddRedaction,
  onRemoveRedaction,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [mode, setMode] = useState<Mode>('draw')
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null)
  const [drawCurrent, setDrawCurrent] = useState<{ x: number; y: number } | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    loadImage(identifier, pageIndex)
      .then((image) => {
        if (!cancelled) setImg(image)
      })
      .catch(() => {
        if (!cancelled) setImg(null)
      })
    return () => {
      cancelled = true
    }
  }, [identifier, pageIndex])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight

    ctx.drawImage(img, 0, 0)

    ctx.fillStyle = '#000'
    for (const r of redactions) {
      if (r.page === pageIndex) ctx.fillRect(r.x, r.y, r.width, r.height)
    }

    if (mode === 'delete' && hoveredIndex !== null) {
      const r = redactions[hoveredIndex]
      if (r && r.page === pageIndex) {
        ctx.fillStyle = 'rgba(220, 38, 38, 0.6)'
        ctx.fillRect(r.x, r.y, r.width, r.height)
      }
    }

    if (drawStart && drawCurrent) {
      const x = Math.min(drawStart.x, drawCurrent.x)
      const y = Math.min(drawStart.y, drawCurrent.y)
      const w = Math.abs(drawCurrent.x - drawStart.x)
      const h = Math.abs(drawCurrent.y - drawStart.y)
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.9)'
      ctx.fillStyle = 'rgba(59, 130, 246, 0.15)'
      ctx.lineWidth = 2
      ctx.setLineDash([6, 3])
      ctx.fillRect(x, y, w, h)
      ctx.strokeRect(x, y, w, h)
      ctx.setLineDash([])
    }
  }, [img, redactions, drawStart, drawCurrent, hoveredIndex, mode, pageIndex])

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return
    const pos = clientToCanvas(e, canvas)
    if (mode === 'draw') {
      setDrawStart(pos)
      setDrawCurrent(pos)
    } else {
      const idx = findRedactionAt(pos, redactions, pageIndex)
      if (idx !== null) onRemoveRedaction(idx)
    }
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return
    const pos = clientToCanvas(e, canvas)
    if (mode === 'draw' && drawStart) {
      setDrawCurrent(pos)
    } else if (mode === 'delete') {
      setHoveredIndex(findRedactionAt(pos, redactions, pageIndex))
    }
  }

  function handleMouseUp(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas || mode !== 'draw' || !drawStart || !drawCurrent) return
    const pos = clientToCanvas(e, canvas)
    const x = Math.min(drawStart.x, pos.x)
    const y = Math.min(drawStart.y, pos.y)
    const w = Math.abs(pos.x - drawStart.x)
    const h = Math.abs(pos.y - drawStart.y)
    if (w > 4 && h > 4) {
      onAddRedaction({ x, y, width: w, height: h })
    }
    setDrawStart(null)
    setDrawCurrent(null)
  }

  function handleMouseLeave() {
    setDrawStart(null)
    setDrawCurrent(null)
    setHoveredIndex(null)
  }

  const pageRedactionCount = redactions.filter((r) => r.page === pageIndex).length

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="flex rounded overflow-hidden border border-charcoal-600">
          <button
            className={`px-3 py-1 text-sm font-mono ${mode === 'draw' ? 'bg-blue-600 text-white' : 'bg-charcoal-700 text-sepia-300 hover:bg-charcoal-600'}`}
            onClick={() => setMode('draw')}
          >
            Draw
          </button>
          <button
            className={`px-3 py-1 text-sm font-mono ${mode === 'delete' ? 'bg-red-700 text-white' : 'bg-charcoal-700 text-sepia-300 hover:bg-charcoal-600'}`}
            onClick={() => setMode('delete')}
          >
            Delete
          </button>
        </div>
        <span className="text-xs text-sepia-400 font-mono">
          {pageRedactionCount} redaction{pageRedactionCount !== 1 ? 's' : ''} on this page
        </span>
      </div>

      {!img && (
        <div className="flex items-center justify-center h-48 bg-charcoal-800 rounded text-sepia-400 text-sm">
          Loading page…
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="w-full block"
        style={{
          display: img ? 'block' : 'none',
          cursor: mode === 'draw' ? 'crosshair' : 'pointer',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  )
}
