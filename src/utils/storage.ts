import type { CompletedChallenge } from '../api/types'

const STORAGE_KEY = 'magazineGuessr_challenges'

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
