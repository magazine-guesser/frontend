import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useGame } from '../hooks/useGame'
import { api } from '../api'
import { DailyChallenge, Magazine } from '../api/types'

vi.mock('../api', () => ({
  api: {
    getDailyChallenge: vi.fn(),
    getPageUrl: vi.fn(() => 'http://fake-url.jpg'),
    submitGuess: vi.fn(),
  },
}))

const mockMagazine: Magazine = {
  nr: 1,
  identifier: 'mock mag',
  title: 'Mock Mag',
  pageRanges: [[2, 13]],
  startPage: 0,
  redactions: [],
}

const mockDaily: DailyChallenge = {
  date: '2000-01-01',
  magazines: [mockMagazine, mockMagazine, mockMagazine],
}

beforeEach(() => {
  vi.mocked(api.getDailyChallenge).mockResolvedValue(mockDaily)
})

describe('useGame', () => {
  it('starts at sequenceIndex 0', async () => {
    const { result } = renderHook(() => useGame())

    await waitFor(() => expect(result.current.phase).toBe('viewing'))

    expect(result.current.sequenceIndex).toBe(0)
  })

  it('nextPage increments sequenceIndex', async () => {
    const { result } = renderHook(() => useGame())
    await waitFor(() => expect(result.current.phase).toBe('viewing'))

    act(() => result.current.nextPage())

    expect(result.current.sequenceIndex).toBe(1)
  })

  it('prevPage does nothing at the start', async () => {
    const { result } = renderHook(() => useGame())
    await waitFor(() => expect(result.current.phase).toBe('viewing'))

    act(() => result.current.prevPage())

    expect(result.current.sequenceIndex).toBe(0)
  })
})
