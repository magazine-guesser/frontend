import { useEffect, useState } from 'react'
import type { RoundResult as RoundResultType } from '../api/types'
import { scoreToColor, SCORE_BAR_GRADIENT } from '../utils/scoring'

interface Props {
  result: RoundResultType
  roundIndex: number
  totalRounds: number
  onContinue: () => void
  isLast: boolean
}

export function RoundResult({ result, roundIndex, totalRounds, onContinue, isLast }: Props) {
  const [displayed, setDisplayed] = useState(0)
  const { score, guessedYear, actualYear, magazineTitle } = result
  const delta = Math.abs(guessedYear - actualYear)
  const color = scoreToColor(score)

  useEffect(() => {
    const startTime = performance.now()
    const duration = 1400

    function tick(now: number) {
      const elapsed = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - elapsed, 3)
      setDisplayed(Math.round(eased * score))
      if (elapsed < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [score])

  return (
    <div className="flex flex-col items-center gap-6 px-6 py-10 animate-fade-up">
      <div className="text-center">
        <p className="font-sans text-sepia-300/70 text-sm tracking-widest uppercase mb-1">
          Round {roundIndex + 1} of {totalRounds}
        </p>
        <p className="font-sans text-sepia-200 text-lg leading-snug max-w-xs">{magazineTitle}</p>
      </div>

      {/* Score display */}
      <div className="animate-score-reveal flex flex-col items-center">
        <span
          className="font-mono font-medium text-7xl sm:text-8xl tabular-nums leading-none"
          style={{ color }}
        >
          {displayed}
        </span>
        <span className="font-sans text-sepia-400 text-base mt-1">out of 1 000</span>
      </div>

      {/* Score bar */}
      <div className="w-full max-w-xs">
        <div className="h-2 rounded-full bg-charcoal-600 overflow-hidden relative">
          <div className="absolute inset-0" style={{ background: SCORE_BAR_GRADIENT }} />
          <div
            className="absolute inset-y-0 right-0 bg-charcoal-600 transition-all duration-1000 ease-out"
            style={{ width: `${100 - (displayed / 1000) * 100}%` }}
          />
        </div>
      </div>

      {/* Year comparison */}
      <div className="flex items-center gap-8 font-mono">
        <div className="text-center">
          <div className="text-sepia-400/60 text-xs tracking-widest uppercase mb-1">Your guess</div>
          <div className="text-sepia-100 text-3xl font-medium">{guessedYear}</div>
        </div>
        <div className="text-center">
          <div className="text-sepia-400/60 text-xs tracking-widest uppercase mb-1">
            {delta === 0 ? 'Exact' : `${delta} year${delta !== 1 ? 's' : ''} off`}
          </div>
          <div className="w-px h-8 bg-sepia-300/20 mx-auto" />
        </div>
        <div className="text-center">
          <div className="text-sepia-400/60 text-xs tracking-widest uppercase mb-1">
            Actual year
          </div>
          <div className="text-gold-400 text-3xl font-medium">{actualYear}</div>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="mt-2 px-10 py-3 bg-gold-400 hover:bg-gold-300 text-charcoal-900 font-sans font-semibold text-lg tracking-wide rounded-sm transition-all duration-200 shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] cursor-pointer"
      >
        {isLast ? 'See Final Score' : 'Next Round'}
      </button>
    </div>
  )
}
