import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../hooks/useGame'
import { MagazineViewer } from './MagazineViewer'
import { YearSlider } from './YearSlider'
import { RoundResult } from './RoundResult'
import { getTodayChallenge } from '../utils/storage'
import { getTodayDateStr } from '../utils/dateUtils'

export function GameScreen() {
  const navigate = useNavigate()
  const game = useGame()

  // Guard: already played today
  useEffect(() => {
    const existing = getTodayChallenge(getTodayDateStr())
    if (existing) {
      navigate('/result', { state: { challenge: existing }, replace: true })
    }
  }, [navigate])

  // Navigate to result when complete
  useEffect(() => {
    if (game.phase === 'complete') {
      const existing = getTodayChallenge(getTodayDateStr())
      navigate('/result', { state: { challenge: existing } })
    }
  }, [game.phase, navigate])

  if (game.error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-6 py-20">
        <p className="font-sans text-sepia-300 text-lg text-center">{game.error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-2 border border-gold-400/50 text-gold-400 font-sans rounded-sm hover:bg-gold-400/10 transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    )
  }

  if (game.phase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="w-10 h-10 border-2 border-sepia-300/20 border-t-gold-400 rounded-full animate-spin" />
        <p className="font-sans text-sepia-400">Loading…</p>
      </div>
    )
  }

  const currentMag = game.magazines[game.roundIndex]
  if (!currentMag) return null

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Round indicator */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-sepia-100/10 bg-charcoal-800/60 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < game.roundIndex
                  ? 'bg-gold-400'
                  : i === game.roundIndex
                  ? 'bg-gold-400 scale-125'
                  : 'bg-sepia-300/20'
              }`}
            />
          ))}
          <span className="font-mono text-xs text-sepia-300/60 ml-2">
            Magazine {game.roundIndex + 1} of 3
          </span>
        </div>
        <div className="font-mono text-xs text-sepia-300/60">
          Score: <span className="text-gold-400">{game.totalScore}</span>
        </div>
      </div>

      {game.phase === 'result' ? (
        <div className="flex-1 min-h-0 overflow-y-auto flex items-center justify-center bg-charcoal-900">
          <RoundResult
            result={game.rounds[game.rounds.length - 1]}
            roundIndex={game.rounds.length - 1}
            totalRounds={3}
            onContinue={game.advanceRound}
            isLast={game.rounds.length === 3}
          />
        </div>
      ) : (
        <>
          <MagazineViewer
            identifier={currentMag.identifier}
            currentPage={game.currentPage}
            pageRanges={currentMag.pageRanges}
            canNext={game.canNext}
            canPrev={game.canPrev}
            redactions={currentMag.redactions}
            onNext={game.nextPage}
            onPrev={game.prevPage}
          />
          <YearSlider
            value={game.sliderYear}
            onChange={game.setSliderYear}
            onSubmit={game.submitGuess}
          />
        </>
      )}
    </div>
  )
}
