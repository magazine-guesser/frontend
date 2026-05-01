import type { MagazineSource, DailyChallenge, GuessResult } from './types'

export class ArchiveProvider implements MagazineSource {
  private readonly baseurl

  constructor(baseurl: string) {
    this.baseurl = baseurl
  }

  async getDailyChallenge(dateStr: string): Promise<DailyChallenge> {
    const res = await fetch(`${this.baseurl}/daily/${dateStr}`)
    if (!res.ok) throw new Error('Failed to fetch daily challenge')
    const magazines = await res.json()
    return { date: dateStr, magazines }
  }

  async submitGuess(dateStr: string, nr: number, year: number): Promise<GuessResult> {
    const res = await fetch(`${this.baseurl}/daily/${dateStr}/${nr}/guess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year }),
    })
    return res.json()
  }

  getPageUrl(identifier: string, pageIndex: number, width = 1200): string {
    return `https://archive.org/download/${identifier}/page/n${pageIndex}_w${width}.jpg`
  }
}
