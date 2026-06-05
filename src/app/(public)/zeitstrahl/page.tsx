import { Clock } from 'lucide-react'

const EVENTS = [
  { year: 1949, title: 'Gründung der BRD', desc: 'Das Grundgesetz tritt am 23. Mai 1949 in Kraft. Die Bundesrepublik Deutschland wird gegründet. Konrad Adenauer wird erster Bundeskanzler.', category: 'Verfassung', important: true },
  { year: 1949, title: 'Gründung der DDR', desc: 'Am 7. Oktober 1949 wird die Deutsche Demokratische Republik als sozialistischer Staat auf dem Gebiet der sowjetischen Besatzungszone ausgerufen.', category: 'Geschichte', important: false },
  { year: 1955, title: 'NATO-Beitritt', desc: 'Die Bundesrepublik Deutschland tritt dem NATO-Verteidigungsbündnis bei.', category: 'Außenpolitik', important: false },
  { year: 1957, title: 'Europäische Wirtschaftsgemeinschaft', desc: 'Deutschland ist Gründungsmitglied der EWG (Vorläufer der EU) durch die Römer Verträge.', category: 'Europa', important: true },
  { year: 1961, title: 'Bau der Berliner Mauer', desc: 'Am 13. August 1961 beginnt die DDR mit dem Bau der Berliner Mauer. Deutschland ist geteilt.', category: 'Geschichte', important: true },
  { year: 1963, title: 'Élysée-Vertrag', desc: 'Deutschland und Frankreich schließen den Freundschaftsvertrag – Grundstein der deutsch-französischen Freundschaft.', category: 'Außenpolitik', important: false },
  { year: 1969, title: 'Willy Brandt wird Kanzler', desc: 'Erstmals stellt die SPD den Bundeskanzler. Brandts Ostpolitik und sein Kniefall in Warschau werden weltbekannt.', category: 'Regierung', important: true },
  { year: 1972, title: 'Grundlagenvertrag DDR-BRD', desc: 'Beide deutschen Staaten erkennen sich gegenseitig an und normalisieren ihre Beziehungen.', category: 'Geschichte', important: false },
  { year: 1982, title: 'Helmut Kohl wird Kanzler', desc: 'Durch konstruktives Misstrauensvotum wird Helmut Kohl Bundeskanzler – eine Ära beginnt.', category: 'Regierung', important: false },
  { year: 1989, title: 'Mauerfall', desc: 'Am 9. November 1989 fällt die Berliner Mauer. Millionen Menschen feiern das Ende der Teilung Deutschlands.', category: 'Geschichte', important: true },
  { year: 1990, title: 'Deutsche Wiedervereinigung', desc: 'Am 3. Oktober 1990 tritt die DDR der Bundesrepublik bei. Deutschland ist wieder ein Land.', category: 'Geschichte', important: true },
  { year: 1992, title: 'Maastricht-Vertrag', desc: 'Deutschland ratifiziert den Vertrag zur Gründung der Europäischen Union.', category: 'Europa', important: true },
  { year: 1998, title: 'Gerhard Schröder wird Kanzler', desc: 'Rot-Grüne Koalition unter Schröder löst Kohl ab. Agenda 2010 und Hartz-Reformen folgen.', category: 'Regierung', important: false },
  { year: 2002, title: 'Euro-Einführung', desc: 'Deutschland führt den Euro als Bargeld ein. Die D-Mark wird abgelöst.', category: 'Wirtschaft', important: true },
  { year: 2005, title: 'Angela Merkel wird Kanzlerin', desc: 'Erste Frau an der Spitze der deutschen Regierung. Merkel regiert 16 Jahre.', category: 'Regierung', important: true },
  { year: 2009, title: 'Finanzkrise & Schuldenbremse', desc: 'In der Finanzkrise wird die Schuldenbremse ins Grundgesetz aufgenommen.', category: 'Wirtschaft', important: false },
  { year: 2015, title: 'Flüchtlingskrise', desc: 'Deutschland nimmt über eine Million Flüchtlinge auf. "Wir schaffen das" prägt die politische Debatte.', category: 'Gesellschaft', important: true },
  { year: 2020, title: 'COVID-19 Pandemie', desc: 'Erstmals seit dem Krieg werden weitreichende Einschränkungen des öffentlichen Lebens verhängt.', category: 'Gesellschaft', important: true },
  { year: 2021, title: 'Olaf Scholz wird Kanzler', desc: 'SPD, Grüne und FDP bilden die erste Ampelkoalition auf Bundesebene.', category: 'Regierung', important: false },
  { year: 2022, title: 'Russlands Angriff auf Ukraine', desc: 'Zeitenwende in der deutschen Außen- und Sicherheitspolitik. Sondervermögen von 100 Mrd. € für die Bundeswehr.', category: 'Außenpolitik', important: true },
  { year: 2024, title: 'Ende der Ampelkoalition', desc: 'Die Ampelkoalition zerbricht im November 2024. Deutschland steht vor Neuwahlen.', category: 'Regierung', important: true },
  { year: 2025, title: 'Bundestagswahl 2025', desc: 'Neuwahlen nach dem Ende der Ampelkoalition. Deutschland wählt einen neuen Bundestag.', category: 'Wahlen', important: true },
]

const CAT_COLORS: Record<string, string> = {
  'Verfassung': 'bg-nm-blue text-white',
  'Geschichte': 'bg-gray-700 text-white',
  'Außenpolitik': 'bg-indigo-600 text-white',
  'Europa': 'bg-blue-500 text-white',
  'Regierung': 'bg-purple-600 text-white',
  'Wirtschaft': 'bg-green-600 text-white',
  'Gesellschaft': 'bg-orange-500 text-white',
  'Wahlen': 'bg-red-600 text-white',
}

export default function ZeitstrahlPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-nm-blue text-white">
        <div className="nm-container py-16 sm:py-20">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Geschichte</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 flex items-center gap-3">
            <Clock className="h-8 w-8 opacity-80" /> Politischer Zeitstrahl
          </h1>
          <p className="text-white/75 text-lg max-w-2xl leading-relaxed">
            75 Jahre Bundesrepublik Deutschland – die wichtigsten Momente unserer Demokratie.
          </p>
        </div>
      </div>

      <div className="nm-container py-12">
        <div className="max-w-3xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-[72px] top-0 bottom-0 w-px bg-nm-line" />

          <div className="space-y-6">
            {EVENTS.map((ev, i) => (
              <div key={i} className="flex gap-6 relative">
                {/* Year */}
                <div className="w-[56px] flex-shrink-0 text-right">
                  <span className={`text-sm font-black ${ev.important ? 'text-nm-blue' : 'text-nm-muted'}`}>{ev.year}</span>
                </div>

                {/* Dot */}
                <div className="relative flex-shrink-0 flex items-start justify-center w-4 mt-1">
                  <div className={`w-3 h-3 rounded-full border-2 z-10 ${ev.important ? 'bg-nm-blue border-nm-blue' : 'bg-white border-nm-line'}`} />
                </div>

                {/* Content */}
                <div className={`flex-1 border rounded-xl p-4 mb-1 ${ev.important ? 'border-nm-blue/30 bg-nm-blue/5' : 'border-nm-line bg-white'}`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className={`font-black text-sm ${ev.important ? 'text-nm-blue' : 'text-nm-text'}`}>{ev.title}</h3>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ${CAT_COLORS[ev.category] ?? 'bg-nm-gray text-nm-muted'}`}>
                      {ev.category}
                    </span>
                  </div>
                  <p className="text-xs text-nm-muted leading-relaxed">{ev.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
