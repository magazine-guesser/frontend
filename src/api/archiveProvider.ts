import type { MagazineSource, DailyChallenge } from './types'
import { allMagazines } from '../data/magazines'

export class ArchiveProvider implements MagazineSource {
  getDailyChallenge(dateStr: string): Promise<DailyChallenge> {
    return Promise.resolve({ date: dateStr, magazines: allMagazines })
  }

  getPageUrl(identifier: string, pageIndex: number, width = 1200): string {
    return `https://archive.org/download/${identifier}/page/n${pageIndex}_w${width}.jpg`
  }
}
