import { useState } from 'react'
import type { MagazinePoolEntry } from '../../api/types'
import { MagazineEditor, defaultMagazine } from './MagazineEditor'

const BASE_URL = import.meta.env.VITE_API_URL

export function AdminPage() {
  const [adminKey, setAdminKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [magazines, setMagazines] = useState<MagazinePoolEntry[]>([defaultMagazine()])
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function updateMagazine(index: number, value: MagazinePoolEntry) {
    setMagazines((prev) => prev.map((m, i) => (i === index ? value : m)))
  }

  function addMagazine() {
    setMagazines((prev) => [...prev, defaultMagazine()])
  }

  function removeMagazine(index: number) {
    setMagazines((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit() {
    setSaving(true)
    setError(null)
    setSaveMsg(null)
    try {
      const res = await fetch(`${BASE_URL}/admin/pool`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: adminKey },
        body: JSON.stringify({ magazines }),
      })
      if (!res.ok) throw new Error(`Submit failed (${res.status})`)
      setSaveMsg(`Added ${magazines.length} magazine${magazines.length > 1 ? 's' : ''} to pool`)
      setMagazines([defaultMagazine()])
      setTimeout(() => setSaveMsg(null), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submit failed')
    } finally {
      setSaving(false)
    }
  }

  const canSubmit = magazines.every((m) => m.identifier && m.title && m.year)

  return (
    <div className="min-h-screen bg-charcoal-900 text-sepia-100 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <label className="flex flex-col gap-1 w-80">
          <div className="flex items-center justify-between">
            <span className="text-xs text-sepia-400 font-mono">Authorization</span>
            <button
              type="button"
              className="text-xs text-sepia-500 hover:text-sepia-300 font-mono"
              onClick={() => setShowKey((v) => !v)}
            >
              {showKey ? 'hide' : 'show'}
            </button>
          </div>
          <input
            type={showKey ? 'text' : 'password'}
            className="bg-charcoal-800 border border-charcoal-600 rounded px-2 py-1 text-sm font-mono text-sepia-100 focus:outline-none focus:border-gold-500"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
          />
        </label>

        {magazines.map((magazine, i) => (
          <div key={i} className="flex flex-col gap-4 p-4 border border-charcoal-700 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-sepia-500 font-mono">Magazine {i + 1}</span>
              {magazines.length > 1 && (
                <button
                  className="text-xs text-red-400 hover:text-red-300 font-mono"
                  onClick={() => removeMagazine(i)}
                >
                  Remove
                </button>
              )}
            </div>
            <MagazineEditor value={magazine} onChange={(v) => updateMagazine(i, v)} />
          </div>
        ))}

        <button
          className="self-start text-xs text-gold-400 hover:text-gold-300 font-mono"
          onClick={addMagazine}
        >
          + Add magazine
        </button>

        <div className="flex items-center gap-3 pt-2 border-t border-charcoal-700">
          <button
            onClick={handleSubmit}
            disabled={saving || !canSubmit}
            className="px-5 py-2 font-mono text-sm bg-gold-300 hover:bg-gold-400 text-charcoal-900 rounded disabled:opacity-50"
          >
            {saving ? 'Submitting…' : 'Add to pool'}
          </button>
          {saveMsg && <span className="text-xs text-green-400 font-mono">{saveMsg}</span>}
          {error && <span className="text-xs text-red-400 font-mono">{error}</span>}
        </div>
      </div>
    </div>
  )
}
