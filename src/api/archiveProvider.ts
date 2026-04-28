import type { MagazineSource, DailyChallenge } from './types'
import { challengeEntries } from '../data/magazines'

export class ArchiveProvider implements MagazineSource {
  getDailyChallenge(dateStr: string): Promise<DailyChallenge> {
    const magazines = challengeEntries
      .filter((e) => e.date === dateStr)
      .sort((a, b) => a.nr - b.nr)
      .map(({ date: _date, ...mag }) => mag)
    return Promise.resolve({ date: dateStr, magazines })
  }

  getPageUrl(identifier: string, pageIndex: number, width = 1200): string {
    return `https://archive.org/download/${identifier}/page/n${pageIndex}_w${width}.jpg`
  }
}
