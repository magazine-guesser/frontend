export const SCORE_COLOR_HIGH = '#8fbe5a'
export const SCORE_COLOR_MID = '#f59e0b'
export const SCORE_COLOR_LOW = '#e05555'
export const SCORE_BAR_GRADIENT = `linear-gradient(to right, ${SCORE_COLOR_LOW}, ${SCORE_COLOR_MID}, ${SCORE_COLOR_HIGH})`

export function scoreToColor(score: number): string {
  if (score >= 700) return SCORE_COLOR_HIGH
  if (score >= 400) return SCORE_COLOR_MID
  return SCORE_COLOR_LOW
}
