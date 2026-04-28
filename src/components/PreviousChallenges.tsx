import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getSortedChallenges } from '../utils/storage'
import { scoreToColor, SCORE_BAR_GRADIENT } from '../utils/scoring'
import type { CompletedChallenge } from '../api/types'

function ChallengeCard({ challenge }: { challenge: CompletedChallenge }) {
  const [expanded, setExpanded] = useState(false)
  const pct = (challenge.totalScore / 3000) * 100
  const dateLabel = new Date(challenge.date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="border border-sepia-100/10 bg-charcoal-800/40 rounded-sm overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-charcoal-700/40 transition-colors cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <p className="font-sans text-sepia-200 text-sm">{dateLabel}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex-1 h-1.5 bg-charcoal-600 rounded-full overflow-hidden relative">
              <div className="absolute inset-0" style={{ background: SCORE_BAR_GRADIENT }} />
              <div
                className="absolute inset-y-0 right-0 bg-charcoal-600"
                style={{ width: `${100 - pct}%` }}
              />
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span
            className="font-mono font-medium text-xl tabular-nums"
            style={{ color: scoreToColor(challenge.totalScore / 3) }}
          >
            {challenge.totalScore}
          </span>
          <span className="font-mono text-sepia-400/40 text-xs">/3000</span>
        </div>
        <svg
          className={`w-4 h-4 text-sepia-400/40 shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-sepia-100/10 divide-y divide-sepia-100/5">
          {challenge.rounds.map((r, i) => {
            const delta = Math.abs(r.guessedYear - r.actualYear)
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-charcoal-900/40">
                <span className="font-mono text-xs text-sepia-400/40 w-4 shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sepia-300/80 text-xs truncate">{r.magazineTitle}</p>
                  <p className="font-mono text-xs text-sepia-400/50 mt-0.5">
                    Guessed {r.guessedYear} - Actual {r.actualYear}
                    <span className="text-sepia-400/30">
                      {' '}
                      = {delta === 0 ? 'exact' : `${delta} ${delta === 1 ? 'year' : 'years'}`}
                    </span>
                  </p>
                </div>
                <span
                  className="font-mono text-sm font-medium tabular-nums shrink-0"
                  style={{ color: scoreToColor(r.score) }}
                >
                  {r.score}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function PreviousChallenges() {
  const challenges = getSortedChallenges()

  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-6 px-6 py-10 max-w-lg mx-auto w-full animate-fade-up">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="text-sepia-400/60 hover:text-sepia-300 transition-colors"
          aria-label="Back to menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <div>
          <h1 className="font-sans font-bold text-2xl text-sepia-100">Previous Challenges</h1>
          <p className="font-sans text-sepia-400/60 text-sm">{challenges.length} completed</p>
        </div>
      </div>

      {challenges.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-sans text-sepia-300/40 text-xl mb-2">No history yet</p>
          <Link
            to="/"
            className="inline-block mt-6 px-6 py-2 border border-gold-400/40 text-gold-400 font-sans rounded-sm hover:bg-gold-400/10 transition-colors text-sm"
          >
            Play Daily Challenge
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {challenges.map((c) => (
            <ChallengeCard key={c.date} challenge={c} />
          ))}
        </div>
      )}
    </div>
  )
}
