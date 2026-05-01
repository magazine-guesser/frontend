export interface Redaction {
  page: number
  x: number
  y: number
  width: number
  height: number
}

export interface Magazine {
  nr: number
  identifier: string
  title: string
  pageRanges: [[number, number]]
  startPage: number
  redactions: Redaction[]
}

export interface DailyChallenge {
  date: string
  magazines: Magazine[]
}

export interface RoundResult {
  magazineIdentifier: string
  magazineTitle: string
  actualYear: number
  guessedYear: number
  score: number
}

export interface CompletedChallenge {
  date: string
  totalScore: number
  rounds: RoundResult[]
}

export interface GuessResult {
  correct_year: number
  score: number
  difference: number
}

export interface MagazineSource {
  getDailyChallenge(dateStr: string): Promise<DailyChallenge>
  getPageUrl(identifier: string, pageIndex: number, width?: number): string
  submitGuess(dateStr: string, nr: number, year: number): Promise<GuessResult>
}
