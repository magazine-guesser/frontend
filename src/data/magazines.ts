import type { Magazine } from '../api/types'

interface ChallengeEntry extends Magazine {
  date: string
}

export const challengeEntries: ChallengeEntry[] = [
  {
    date: '2026-04-28',
    nr: 1,
    identifier: 'sim_popular-science_1940-01_136_1',
    title: 'Popular Science',
    year: 1940,
    pageRange: [1, 7],
    startPage: 1,
    redactions: [{ page: 2, x: 300, y: 1570, width: 100, height: 40 }],
  },
  {
    date: '2026-04-28',
    nr: 2,
    identifier: 'Sports-Illustrated-1954-08-16',
    title: 'Sports Illustrated',
    year: 1954,
    pageRange: [58, 78],
    startPage: 60,
    redactions: [],
  },
  {
    date: '2026-04-28',
    nr: 3,
    identifier: 'vogue196506',
    title: 'Vogue',
    year: 1965,
    pageRange: [53, 73],
    startPage: 55,
    redactions: [],
  },
]
