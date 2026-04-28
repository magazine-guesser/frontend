export interface Magazine {
  identifier: string
  title: string
  publication: string
  year: number
  pageCount: number
  startPage: number
}

export interface DailyChallenge {
  date: string
  magazines: Magazine[]
}

export interface RoundResult {
  magazineIdentifier: string
  magazineTitle: string
  publication: string
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
