export const MAX_SCORE = 1000
export const PENALTY_PER_YEAR = 40

export const SCORE_COLOR_HIGH = '#8fbe5a'
export const SCORE_COLOR_MID = '#f59e0b'
export const SCORE_COLOR_LOW = '#e05555'
export const SCORE_BAR_GRADIENT = `linear-gradient(to right, ${SCORE_COLOR_LOW}, ${SCORE_COLOR_MID}, ${SCORE_COLOR_HIGH})`

export function calculateScore(guessYear: number, actualYear: number): number {
  return Math.max(0, MAX_SCORE - Math.abs(guessYear - actualYear) * PENALTY_PER_YEAR)
}

export function scoreToColor(score: number): string {
  if (score >= 700) return SCORE_COLOR_HIGH
  if (score >= 400) return SCORE_COLOR_MID
  return SCORE_COLOR_LOW
}
