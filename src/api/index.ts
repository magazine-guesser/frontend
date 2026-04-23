import type { MagazineSource } from './types'
import { ArchiveProvider } from './archiveProvider'

// TODO: replace this with backend api call
export const api: MagazineSource = new ArchiveProvider()
