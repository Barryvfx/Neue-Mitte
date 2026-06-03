'use client'

import dynamic from 'next/dynamic'
import { Wrench } from 'lucide-react'

const SnakeGame = dynamic(() => import('./SnakeGame'), { ssr: false })

export default function MaintenancePage() {
  return (
    <div className="bg-nm-blue min-h-[calc(100vh-130px)] flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Wrench className="w-8 h-8 text-white" />
        </div>
        <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/40 mb-3">
          Wartungsmodus
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">
          Wir sind gleich zurück.
        </h1>
        <p className="text-white/60 max-w-md mx-auto leading-relaxed">
          Die Website wird gerade aktualisiert. Bitte besuchen Sie uns in Kürze wieder.
        </p>
      </div>

      <div className="w-full max-w-sm mx-auto">
        <p className="text-center text-white/40 text-xs font-bold tracking-[0.15em] uppercase mb-5">
          Überbrücken Sie die Wartezeit
        </p>
        <SnakeGame />
      </div>
    </div>
  )
}
