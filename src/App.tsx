import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { MainMenu } from './components/MainMenu'
import { GameScreen } from './components/GameScreen'
import { FinalScore } from './components/FinalScore'
import { PreviousChallenges } from './components/PreviousChallenges'
import { LegalNotice } from './components/LegalNotice'
import { PrivacyPolicy } from './components/PrivacyPolicy'
import { TermsOfService } from './components/TermsOfService'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<MainMenu />} />
        <Route path="/game" element={<GameScreen />} />
        <Route path="/result" element={<FinalScore />} />
        <Route path="/history" element={<PreviousChallenges />} />
        <Route path="/legal-notice" element={<LegalNotice />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
