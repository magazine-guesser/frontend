import { useState, useEffect } from 'react'
import type { Magazine, RoundResult, DailyChallenge } from '../api/types'
import { api } from '../api'
import { calculateScore } from '../utils/scoring'
import { saveChallengeResult } from '../utils/storage'
import { getTodayDateStr } from '../utils/dateUtils'

export type GamePhase = 'loading' | 'viewing' | 'result' | 'complete'

export interface GameState {
  phase: GamePhase
  dateStr: string
  magazines: Magazine[]
  roundIndex: number
  rounds: RoundResult[]
  currentPage: number
  sliderYear: number
  totalScore: number
  error: string | null
}

export interface GameActions {
  submitGuess: (year: number) => void
  advanceRound: () => void
  nextPage: () => void
  prevPage: () => void
  setSliderYear: (year: number) => void
}


export function useGame(): GameState & GameActions {
  const dateStr = getTodayDateStr()
  const [phase, setPhase] = useState<GamePhase>('loading')
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null)
  const [roundIndex, setRoundIndex] = useState(0)
  const [rounds, setRounds] = useState<RoundResult[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [sliderYear, setSliderYear] = useState(1960)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .getDailyChallenge(dateStr)
      .then((c) => {
        setChallenge(c)
        setCurrentPage(c.magazines[0].startPage)
        setPhase('viewing')
      })
      .catch(() => setError('Failed to load daily challenge. Please try again.'))
  }, [dateStr])

  const magazines = challenge?.magazines ?? []
  const currentMag: Magazine | undefined = magazines[roundIndex]

  function submitGuess(year: number) {
    if (!currentMag) return
    const score = calculateScore(year, currentMag.year)
    const result: RoundResult = {
      magazineIdentifier: currentMag.identifier,
      magazineTitle: currentMag.title,
      actualYear: currentMag.year,
      guessedYear: year,
      score,
    }
    const newRounds = [...rounds, result]
    setRounds(newRounds)
    setPhase('result')
  }

  function advanceRound() {
    if (roundIndex === 2) {
      const totalScore = rounds.reduce((s, r) => s + r.score, 0)
      saveChallengeResult({ date: dateStr, totalScore, rounds })
      setPhase('complete')
    } else {
      const nextIdx = roundIndex + 1
      setRoundIndex(nextIdx)
      setCurrentPage(magazines[nextIdx]?.startPage ?? 0)
      setSliderYear(1960)
      setPhase('viewing')
    }
  }

  function nextPage() {
    if (!currentMag) return
    setCurrentPage((p) => Math.min(p + 2, currentMag.pageRange[1]))
  }

  function prevPage() {
    if (!currentMag) return
    setCurrentPage((p) => Math.max(p - 2, currentMag.pageRange[0]))
  }

  const totalScore = rounds.reduce((s, r) => s + r.score, 0)

  return {
    phase,
    dateStr,
    magazines,
    roundIndex,
    rounds,
    currentPage,
    sliderYear,
    totalScore,
    error,
    submitGuess,
    advanceRound,
    nextPage,
    prevPage,
    setSliderYear,
  }
}
