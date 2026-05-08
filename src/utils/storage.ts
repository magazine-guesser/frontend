import type { CompletedChallenge, RoundResult } from '../api/types'

const STORAGE_KEY = 'magazineGuessr_challenges'
const CHECKPOINT_KEY = 'magazineGuessr_checkpoint'

export interface GameCheckpoint {
  dateStr: string
  roundIndex: number
  rounds: RoundResult[]
  phase: 'viewing' | 'result'
}

interface StoredData {
  challenges: Record<string, CompletedChallenge>
}

function load(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { challenges: {} }
    return JSON.parse(raw) as StoredData
  } catch {
    return { challenges: {} }
  }
}

function save(data: StoredData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    console.error('Could not access local storage')
  }
}

export function loadChallenges(): Record<string, CompletedChallenge> {
  return load().challenges
}

export function getTodayChallenge(dateStr: string): CompletedChallenge | null {
  return load().challenges[dateStr] ?? null
}

export function saveChallengeResult(result: CompletedChallenge): void {
  const data = load()
  data.challenges[result.date] = result
  save(data)
}

export function getSortedChallenges(): CompletedChallenge[] {
  const challenges = load().challenges
  return Object.values(challenges).sort((a, b) => b.date.localeCompare(a.date))
}

export function saveGameCheckpoint(checkpoint: GameCheckpoint): void {
  try {
    localStorage.setItem(CHECKPOINT_KEY, JSON.stringify(checkpoint))
  } catch {
    console.error('Could not save game checkpoint')
  }
}

export function loadGameCheckpoint(dateStr: string): GameCheckpoint | null {
  try {
    const raw = localStorage.getItem(CHECKPOINT_KEY)
    if (!raw) return null
    const checkpoint = JSON.parse(raw) as GameCheckpoint
    if (checkpoint.dateStr !== dateStr) {
      localStorage.removeItem(CHECKPOINT_KEY)
      return null
    }
    return checkpoint
  } catch {
    return null
  }
}

export function clearGameCheckpoint(): void {
  try {
    localStorage.removeItem(CHECKPOINT_KEY)
  } catch {
    console.error('Could not clear game checkpoint')
  }
}
