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
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)
  const [zoom, setZoom] = useState<{ x: number; y: number; tx: number; ty: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef<{ mouseX: number; mouseY: number; tx: number; ty: number } | null>(null)
  const wasDrag = useRef(false)

  function clamp(tx: number, ty: number, x: number, y: number) {
    const el = containerRef.current
    if (!el) return { tx, ty }
    const { width: W, height: H } = el.getBoundingClientRect()
    const EXTRA = 1.2
    const ox = (x / 100) * W
    const oy = (y / 100) * H
    return {
      tx: Math.min(Math.max(tx, -(EXTRA * (W - ox))), EXTRA * ox),
      ty: Math.min(Math.max(ty, -(EXTRA * (H - oy))), EXTRA * oy),
    }
  }

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

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (!zoom) return
    wasDrag.current = false
    dragStart.current = { mouseX: e.clientX, mouseY: e.clientY, tx: zoom.tx, ty: zoom.ty }
    setDragging(true)
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!dragStart.current || !zoom) return
    const dx = e.clientX - dragStart.current.mouseX
    const dy = e.clientY - dragStart.current.mouseY
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) wasDrag.current = true
    const { tx, ty } = clamp(dragStart.current.tx + dx, dragStart.current.ty + dy, zoom.x, zoom.y)
    setZoom({ ...zoom, tx, ty })
  }

  function handleMouseUp() {
    dragStart.current = null
    setDragging(false)
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (wasDrag.current) return
    if (zoom) {
      setZoom(null)
      return
    }
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoom({ x, y, tx: 0, ty: 0 })
  }

  const cursor = zoom ? (dragging ? 'grabbing' : 'grab') : 'zoom-in'

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-charcoal-800"
      style={{ cursor }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
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
        className={`w-full h-full ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          transform: zoom ? `translate(${zoom.tx}px, ${zoom.ty}px) scale(2.2)` : 'scale(1)',
          transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : 'center',
          transition: dragging ? 'opacity 0.3s' : 'transform 0.25s ease, opacity 0.3s',
        }}
      />
    </div>
  )
}
