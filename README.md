# MagazineGuessr Frontend

A daily browser game where you guess the publication year of magazines sourced from the [Internet Archive](https://archive.org). Inspired by other games like TimeGuessr and FoodGuessr.

## Development Setup

### Getting Started

```bash
npm install
npm run dev
```

### Recommended VS Code Extensions

- **ESLint**: gives you inline error and warning highlights as you type
- **Prettier ESLint**: auto-formats files on save using Prettier + ESLint (follow the setup guide on the extension page)

### Tech Stack

**Framework**: React 18 + TypeScript **Build tool**: Vite 6
**Styling**: Tailwind CSS v3

## Scoring

Each round is scored with 1000 points minus a penalty of 40 points per year off.

```
score = max(0, 1000 − (guessYear − actualYear) × 40)
```

The total score for a daily challenge is the sum of all three round scores (max 3000).

## Magazine Data

The magazine list (`src/data/magazines.ts`) contains 3 magazines from Archive.org.

Each magazine is structured:

```ts
interface Magazine {
  identifier: string // Archive.org ID
  title: string // Magazine title
  publication: string // Publication name
  year: number // Actual publication year
  pageCount: number // Total number of magazine pages
  startPage: number // Page index the magazine is opened
}
```

The single pages are received by calling `https://archive.org/download/${identifier}/page/n${pageIndex}_w${width}.jpg`.

## localStorage Schema

### Completed challenges

Completed daily challenges are stored under the key `magazineGuessr_challenges`:

```json
{
  "challenges": {
    "2026-04-23": {
      "date": "2026-04-23",
      "totalScore": 2480,
      "rounds": [
        {
          "magazineIdentifier": "vogue196506",
          "magazineTitle": "Vogue, June 1965",
          "publication": "Vogue",
          "actualYear": 1965,
          "guessedYear": 1962,
          "score": 880
        },
        .
        .
        .
      ]
    },
    "2026-04-24": { ... }
  }
}
```

### Game checkpoint

An game session is saved under the key `magazineGuessr_checkpoint`. This object is updated after each guess and at the start of a new round. On page load, if a checkpoint exists for todays date it is restored, returning the player to the round and phase they left. The checkpoint is cleared on challenge completion or on the next day.

```json
{
  "dateStr": "2026-04-23",
  "roundIndex": 1,
  "phase": "viewing",
  "rounds": [
    {
      "magazineIdentifier": "vogue196506",
      "magazineTitle": "Vogue, June 1965",
      "actualYear": 1965,
      "guessedYear": 1962,
      "score": 880
    }
  ]
}
```

`phase` is either `"viewing"` (player is browsing the magazine) or `"result"` (player has submitted a guess and is seeing the round result).
