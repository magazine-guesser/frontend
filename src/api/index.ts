import type { MagazineSource } from './types'
import { ArchiveProvider } from './archiveProvider'

const BASE_URL = import.meta.env.VITE_API_URL

export const api: MagazineSource = new ArchiveProvider(BASE_URL)
