import { Link } from 'react-router-dom'

export function LegalNotice() {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-6 px-6 py-10 max-w-lg mx-auto w-full animate-fade-up">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="text-sepia-400/60 hover:text-sepia-300 transition-colors"
          aria-label="Back to menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <h1 className="font-sans font-bold text-2xl text-sepia-100">Legal Notice</h1>
      </div>

      <div className="font-sans text-sepia-300/60 text-sm leading-relaxed flex flex-col gap-5">
        <section className="flex flex-col gap-1">
          <h2 className="text-sepia-200 font-semibold text-base">Operators</h2>
          <p>Dominik Schmidt / Matthias Funk</p>
          <p>c/o Impressumservice Dein-Impressum</p>
          <p>Stettiner Straße 41</p>
          <p>35410 Hungen</p>
          <p className="mt-2">
            Contact:{' '}
            <a
              href="mailto:magazineguessr@proton.me"
              className="text-sepia-300 hover:text-sepia-100 underline underline-offset-4 transition-colors"
            >
              magazineguessr@proton.me
            </a>
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h2 className="text-sepia-200 font-semibold text-base">Magazine Images</h2>
          <p>
            All magazine page images displayed in this game are fetched directly from the{' '}
            <a
              href="https://archive.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sepia-300 hover:text-sepia-100 underline underline-offset-4 transition-colors"
            >
              Internet Archive
            </a>{' '}
            (archive.org) via their publicly accessible download API. The Internet Archive is a
            non-profit library that digitizes and preserves historical publications. Magazine
            titles, covers, and editorial content are the intellectual property of their respective
            publishers. This project is non-commercial and does not host, store, or redistribute any
            copyrighted material.
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h2 className="text-sepia-200 font-semibold text-base">Disclaimer</h2>
          <p>
            Magazine Guessr is a personal, non-commercial project created for entertainment
            purposes. All trademarks and copyrights remain the property of their respective owners.
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h2 className="text-sepia-200 font-semibold text-base">Liability for Content</h2>
          <p>
            The contents of this website have been created with great care. However, no guarantee is
            given for the accuracy, completeness, or timeliness of the content. The operator
            reserves the right to modify or delete content at any time.
          </p>
        </section>
      </div>
    </div>
  )
}
