import { Link, useNavigate } from 'react-router-dom'
import { getTodayChallenge } from '../utils/storage'
import { getTodayDateStr } from '../utils/dateUtils'
import { scoreToColor } from '../utils/scoring'

export function MainMenu() {
  const navigate = useNavigate()
  const todayStr = getTodayDateStr()
  const todayChallenge = getTodayChallenge(todayStr)
  const dateLabel = new Date(todayStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  function handlePlay() {
    if (todayChallenge) {
      navigate('/result', { state: { challenge: todayChallenge } })
    } else {
      navigate('/game')
    }
  }

  return (
    <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-6 py-16 gap-10">
      {/* Headline */}
      <div className="text-center max-w-xl">

        <h1 className="font-sans font-black text-5xl sm:text-7xl leading-none text-sepia-100 mb-3">
          Magazine
          <br />
          <span className="text-gold-400">Guessr</span>
        </h1>

        <p className="font-sans text-sepia-300/70 text-lg sm:text-xl leading-relaxed">
          Guess when these magazines were published.
        </p>
      </div>

      {/* Daily challenge card */}
      <div className="w-full max-w-sm">
        <div className="border border-sepia-100/10 bg-charcoal-800/60 rounded-sm overflow-hidden backdrop-blur-sm">
          <div className="px-5 pt-4 pb-2 border-b border-sepia-100/10">
            <p className="font-mono text-xs text-sepia-400/60 tracking-widest uppercase">Today</p>
            <p className="font-sans text-sepia-200 text-base mt-0.5">{dateLabel}</p>
          </div>

          <div className="p-5">
            {todayChallenge ? (
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-mono text-xs text-sepia-400/60 tracking-widest uppercase mb-1">Your score</p>
                  <p
                    className="font-mono font-medium text-3xl tabular-nums"
                    style={{ color: scoreToColor(todayChallenge.totalScore / 3) }}
                  >
                    {todayChallenge.totalScore}
                    <span className="text-sepia-400/50 text-base font-normal">/3000</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs text-sepia-400/60 tracking-widest uppercase mb-1">Rounds</p>
                  <div className="flex gap-1 justify-end">
                    {todayChallenge.rounds.map((r, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-sm flex items-center justify-center font-mono text-xs font-medium"
                        style={{ background: scoreToColor(r.score) + '22', color: scoreToColor(r.score) }}
                      >
                        {Math.round(r.score / 100)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-sepia-300/20" />
                  ))}
                </div>
                <p className="font-sans text-sepia-400/60 text-sm">3 magazines await</p>
              </div>
            )}

            <button
              onClick={handlePlay}
              className="w-full py-3.5 bg-gold-400 hover:bg-gold-300 text-charcoal-900 font-sans font-semibold text-lg tracking-wide rounded-sm transition-all duration-200 shadow-[0_0_30px_rgba(201,168,76,0.2)] hover:shadow-[0_0_40px_rgba(201,168,76,0.4)] cursor-pointer"
            >
              {todayChallenge ? 'View Results' : 'Play Daily Challenge'}
            </button>
          </div>
        </div>
      </div>

      {/* Previous challenges link */}
      <Link
        to="/history"
        className="flex items-center gap-2 font-sans text-sepia-400/60 hover:text-sepia-300 text-base transition-colors group"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="underline underline-offset-4 decoration-sepia-400/30 group-hover:decoration-sepia-300">
          Previous Challenges
        </span>
      </Link>

      {/* Footer */}
      <footer className="w-full max-w-sm text-center mt-auto pt-4 flex justify-center items-center gap-3">
        <Link
          to="/legal-notice"
          className="font-sans text-sepia-400/30 hover:text-sepia-400/60 text-xs transition-colors"
        >
          Legal Notice
        </Link>
        <span className="text-sepia-400/20 text-xs">|</span>
        <Link
          to="/privacy"
          className="font-sans text-sepia-400/30 hover:text-sepia-400/60 text-xs transition-colors"
        >
          Privacy Policy
        </Link>
        <span className="text-sepia-400/20 text-xs">|</span>
        <Link
          to="/terms"
          className="font-sans text-sepia-400/30 hover:text-sepia-400/60 text-xs transition-colors"
        >
          Terms of Service
        </Link>
      </footer>

    </div>
  )
}
