import { Link } from 'react-router-dom'

export function TermsOfService() {
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
        <h1 className="font-sans font-bold text-2xl text-sepia-100">Terms of Service</h1>
      </div>

      <div className="font-sans text-sepia-300/60 text-sm leading-relaxed flex flex-col gap-5">
        <section className="flex flex-col gap-1">
          <h2 className="text-sepia-200 font-semibold text-base">Acceptance</h2>
          <p>
            By using Magazine Guessr you agree to these terms. If you do not agree, please do not
            use the service.
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h2 className="text-sepia-200 font-semibold text-base">Use of the Service</h2>
          <p>
            Magazine Guessr is a free, non-commercial game. You may use it for personal
            entertainment only. Automated access, scraping, or any attempt to manipulate game
            results is prohibited.
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h2 className="text-sepia-200 font-semibold text-base">Intellectual Property</h2>
          <p>
            The game code and design are the property of the operator. Magazine pages displayed in
            the game are fetched from the{' '}
            <a
              href="https://archive.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sepia-300 hover:text-sepia-100 underline underline-offset-4 transition-colors"
            >
              Internet Archive
            </a>{' '}
            via their publicly accessible API. All magazine titles, covers, and editorial content
            remain the intellectual property of their respective publishers. This service does not
            host or redistribute any such content.
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h2 className="text-sepia-200 font-semibold text-base">Availability</h2>
          <p>
            We do not guarantee continuous availability of the service. The game may be modified,
            suspended, or discontinued at any time without notice.
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h2 className="text-sepia-200 font-semibold text-base">Disclaimer of Warranties</h2>
          <p>
            Magazine Guessr is provided "as is" without any warranties, express or implied. We are
            not liable for any damages arising from your use of the service.
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h2 className="text-sepia-200 font-semibold text-base">Changes to Terms</h2>
          <p>
            These terms may be updated at any time. Continued use of the service after changes
            constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h2 className="text-sepia-200 font-semibold text-base">Contact</h2>
          <p>
            For questions about these terms, contact{' '}
            <a
              href="mailto:magazineguessr@proton.me"
              className="text-sepia-300 hover:text-sepia-100 underline underline-offset-4 transition-colors"
            >
              magazineguessr@proton.me
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
