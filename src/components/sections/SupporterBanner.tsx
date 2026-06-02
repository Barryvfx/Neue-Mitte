import Link from 'next/link'

interface Props {
  count: number
}

const MILESTONES = [10, 50, 100, 500, 1000]

function nextMilestone(n: number) {
  return MILESTONES.find((m) => m > n) ?? MILESTONES[MILESTONES.length - 1]
}

export default function SupporterBanner({ count }: Props) {
  const next = nextMilestone(count)
  const prev = MILESTONES.filter((m) => m <= count).pop() ?? 0
  const progress = next > prev
    ? Math.min(Math.round(((count - prev) / (next - prev)) * 100), 100)
    : 100

  return (
    <div className="bg-white border-b border-nm-line">
      <div className="nm-container py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">

          {/* Counter + progress */}
          <div className="flex-1 max-w-lg">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-3xl font-black text-nm-blue tabular-nums">
                {count.toLocaleString('de-DE')}
              </span>
              <span className="text-sm text-nm-muted font-medium">
                {count === 1 ? 'Unterstützer' : 'Unterstützerinnen & Unterstützer'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="progress-track flex-1">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="text-xs text-nm-muted whitespace-nowrap font-medium">
                Ziel: {next.toLocaleString('de-DE')}
              </span>
            </div>
          </div>

          <Link href="/unterstuetzen" className="btn-primary flex-shrink-0">
            Jetzt unterstützen
          </Link>
        </div>
      </div>
    </div>
  )
}
