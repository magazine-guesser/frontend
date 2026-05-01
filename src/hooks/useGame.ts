import { useState, useEffect } from 'react'
import type { Magazine, RoundResult, DailyChallenge } from '../api/types'
import { api } from '../api'
import { saveChallengeResult } from '../utils/storage'
import { getTodayDateStr } from '../utils/dateUtils'

export type GamePhase = 'loading' | 'viewing' | 'result' | 'complete'

export interface GameState {
  phase: GamePhase
  dateStr: string
  magazines: Magazine[]
  roundIndex: number
  rounds: RoundResult[]
  sequenceIndex: number
  pageSequence: number[]
  canNext: boolean
  canPrev: boolean
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

function buildPageSequence(pageRanges: [number, number][]): number[] {
  const sequence: number[] = [0]
  for (const [start, end] of pageRanges) {
    for (let page = start; page <= end; page += 2) {
      sequence.push(page)
    }
  }
  return sequence
}

export function useGame(): GameState & GameActions {
  const dateStr = getTodayDateStr()
  const [phase, setPhase] = useState<GamePhase>('loading')
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null)
  const [roundIndex, setRoundIndex] = useState(0)
  const [rounds, setRounds] = useState<RoundResult[]>([])
  const [sequenceIndex, setSequenceIndex] = useState(0)
  const [sliderYear, setSliderYear] = useState(1960)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const challenge = await api.getDailyChallenge(dateStr)
        setChallenge(challenge)
        setSequenceIndex(challenge?.magazines[0].startPage ?? 0)
        setPhase('viewing')
      } catch {
        setError('Failed to load daily challange. Please try again')
      }
    }
    load()
  }, [dateStr])

  const magazines = challenge?.magazines ?? []
  const currentMag: Magazine | undefined = magazines[roundIndex]
  const pageSequence = buildPageSequence(currentMag?.pageRanges ?? [])
  const canNext = sequenceIndex < pageSequence.length - 1
  const canPrev = sequenceIndex > 0

  async function submitGuess(year: number) {
    if (!currentMag) return

    const guessResult = await api.submitGuess(dateStr, currentMag.nr, year)
    const result: RoundResult = {
      magazineIdentifier: currentMag.identifier,
      magazineTitle: currentMag.title,
      actualYear: guessResult.correct_year,
      guessedYear: year,
      score: guessResult.score,
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
      setSequenceIndex(magazines[nextIdx]?.startPage ?? 0)
      setSliderYear(1960)
      setPhase('viewing')
    }
  }

  function nextPage() {
    setSequenceIndex(index => Math.min(index + 1, pageSequence.length - 1))
  }
  function prevPage() {
    setSequenceIndex(index => Math.max(index - 1, 0))
  }

  const totalScore = rounds.reduce((s, r) => s + r.score, 0)

  return {
    phase,
    dateStr,
    magazines,
    roundIndex,
    rounds,
    sequenceIndex,
    pageSequence, 
    canNext,
    canPrev,
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
