import { Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="h-screen bg-charcoal-900 text-sepia-100 font-sans relative overflow-x-hidden flex flex-col">
      {/* Grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Background decorative lines */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-[0.03]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sepia-200 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sepia-200 to-transparent" />
      </div>

      <main className="flex-1 flex flex-col relative z-10 min-h-0 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
