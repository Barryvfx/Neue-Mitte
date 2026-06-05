'use client'

import { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Nach oben scrollen"
      className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-nm-blue text-white shadow-lg flex items-center justify-center hover:bg-nm-blue/90 transition-all hover:scale-110"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  )
}
