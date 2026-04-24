import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import type { CompletedChallenge } from '../api/types'
import { scoreToColor, SCORE_BAR_GRADIENT } from '../utils/scoring'

export function FinalScore() {
  const location = useLocation()
  const navigate = useNavigate()
  const challenge: CompletedChallenge | undefined = (
    location.state as { challenge?: CompletedChallenge }
  )?.challenge

  const [totalDisplayed, setTotalDisplayed] = useState(0)
  const [copied, setCopied] = useState(false)

  // Animate final score
  useEffect(() => {
    if (!challenge) {
      navigate('/', { replace: true })
      return
    }
    const total = challenge.totalScore
    const start = performance.now()
    const duration = 1800

    function tick(now: number) {
      const elapsed = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - elapsed, 3)
      setTotalDisplayed(Math.round(eased * total))
      if (elapsed < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [challenge, navigate])

  if (!challenge) return null

  const { rounds, /*date,*/ totalScore } = challenge

  function handleShare() {
    const text = 'Multiline result, play at magazine.guessr'

    if (navigator.share) {
      navigator.share({ text }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  //const pct = (totalScore / 3000) * 100

  return (
    <div className="flex-1 overflow-y-auto flex flex-col items-center gap-8 px-6 py-12 animate-fade-up">
      <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto">
        <div className="text-center">
          <h1 className="font-sans font-bold text-4xl sm:text-5xl text-sepia-100">Final Score</h1>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-end gap-2">
            <span
              className="font-mono font-medium text-8xl sm:text-9xl tabular-nums leading-none"
              style={{ color: scoreToColor(totalScore / 3) }}
            >
              {totalDisplayed}
            </span>
            <span className="font-mono text-sepia-400 text-2xl pb-2">/3000</span>
          </div>

          {/* Score bar */}
          <div className="w-full max-w-xs mt-4 h-2 rounded-full bg-charcoal-600 overflow-hidden relative">
            <div className="absolute inset-0" style={{ background: SCORE_BAR_GRADIENT }} />
            <div
              className="absolute inset-y-0 right-0 bg-charcoal-600 transition-all duration-1000 ease-out"
              style={{ width: `${100 - (totalDisplayed / 3000) * 100}%` }}
            />
          </div>
        </div>

        <div className="w-full divide-y divide-sepia-100/10 border border-sepia-100/10 rounded-sm overflow-hidden">
          {rounds.map((r, i) => {
            const delta = Math.abs(r.guessedYear - r.actualYear)
            return (
              <div key={i} className="flex items-center gap-4 px-4 py-3 bg-charcoal-800/40">
                <div className="w-6 h-6 rounded-full border border-sepia-100/20 flex items-center justify-center">
                  <span className="font-mono text-xs text-sepia-300/60">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sepia-200 text-sm leading-snug truncate">
                    {r.magazineTitle}
                  </p>
                  <p className="font-mono text-xs text-sepia-400/60 mt-0.5">
                    Guessed {r.guessedYear} | Actual {r.actualYear}
                    <span className="text-sepia-400/40">
                      {' '}
                      | {delta === 0 ? 'exact' : `${delta} ${delta === 1 ? 'year' : 'years'}`}
                    </span>
                  </p>
                </div>
                <div
                  className="font-mono font-medium text-lg tabular-nums shrink-0"
                  style={{ color: scoreToColor(r.score) }}
                >
                  {r.score}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={handleShare}
            className="flex-1 py-3 border border-gold-400/50 text-gold-400 font-sans font-semibold tracking-wide rounded-sm hover:bg-gold-400/10 transition-all duration-200 cursor-pointer"
          >
            {copied ? 'Copied!' : 'Share Results'}
          </button>
          <Link
            to="/"
            className="flex-1 py-3 bg-charcoal-700 hover:bg-charcoal-600 text-sepia-200 font-sans font-semibold tracking-wide rounded-sm text-center transition-all duration-200"
          >
            Back to Menu
          </Link>
        </div>

        <Link
          to="/history"
          className="font-sans text-sepia-400/60 hover:text-sepia-300 text-sm underline underline-offset-4 decoration-sepia-400/30 transition-colors"
        >
          View all previous challenges
        </Link>
      </div>
    </div>
  )
}
