import { Link } from 'react-router-dom'

export function PrivacyPolicy() {
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
        <h1 className="font-sans font-bold text-2xl text-sepia-100">Privacy Policy</h1>
      </div>

      <div className="font-sans text-sepia-300/60 text-sm leading-relaxed flex flex-col gap-5">
        <section className="flex flex-col gap-1">
          <h2 className="text-sepia-200 font-semibold text-base">Overview</h2>
          <p>
            Magazine Guessr is a browser-based game. We are committed to protecting your privacy.
            This page explains what data is processed when you use this site.
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h2 className="text-sepia-200 font-semibold text-base">Data We Collect</h2>
          <p>
            We do not collect any personal data. Your game progress and scores are stored
            exclusively in your browser's local storage.
          </p>
          <p className="mt-1">
            This site uses a backend service for game data (e.g. daily challenges, aggregate scores)
            that may collect anonymized usage metrics. Magazine images are fetched directly from the
            Internet Archive and never pass through our servers. No data that identifies you
            personally is collected.
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h2 className="text-sepia-200 font-semibold text-base">Local Storage</h2>
          <p>
            This site uses your browser's local storage to save your daily challenge results and
            history. This data stays on your device and can be cleared at any time by clearing your
            browser's site data.
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h2 className="text-sepia-200 font-semibold text-base">Internet Archive (archive.org)</h2>
          <p>
            Magazine images are loaded directly from the Internet Archive's public API. When your
            browser fetches these images, your IP address and request metadata are transmitted to
            archive.org's servers. This is outside our control. The Internet Archive's own privacy
            policy applies to those requests and can be found at{' '}
            <a
              href="https://archive.org/about/terms.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sepia-300 hover:text-sepia-100 underline underline-offset-4 transition-colors"
            >
              archive.org/about/terms.php
            </a>
            .
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h2 className="text-sepia-200 font-semibold text-base">Hosting Provider</h2>
          <p>
            Standard server logs (IP address, browser type, request time) may be collected by the
            hosting provider for operational purposes.
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h2 className="text-sepia-200 font-semibold text-base">Contact</h2>
          <p>
            If you have questions about this privacy policy, contact us at{' '}
            <a
              href="mailto:contact@magazineguessr.com"
              className="text-sepia-300 hover:text-sepia-100 underline underline-offset-4 transition-colors"
            >
              contact@magazineguessr.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
