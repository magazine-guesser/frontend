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
  year: number
  pageRange: [number, number]
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

export interface MagazineSource {
  getDailyChallenge(dateStr: string): Promise<DailyChallenge>
  getPageUrl(identifier: string, pageIndex: number, width?: number): string
}
