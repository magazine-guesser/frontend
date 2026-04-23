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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="font-sans font-bold text-2xl text-sepia-100">Privacy Policy</h1>
      </div>

      <div className="font-sans text-sepia-300/60 text-sm leading-relaxed">
        {/* Privacy policy content goes here */}
      </div>
    </div>
  )
}
