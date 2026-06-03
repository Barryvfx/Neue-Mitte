'use client'

import { useState, useMemo } from 'react'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json'

// Major German cities [lng, lat] – normalised lowercase keys
const CITY_COORDS: Record<string, [number, number]> = {
  'berlin': [13.405, 52.520],
  'hamburg': [9.993, 53.551],
  'münchen': [11.576, 48.137],
  'munich': [11.576, 48.137],
  'köln': [6.961, 50.938],
  'koeln': [6.961, 50.938],
  'cologne': [6.961, 50.938],
  'frankfurt am main': [8.682, 50.111],
  'frankfurt': [8.682, 50.111],
  'stuttgart': [9.182, 48.776],
  'düsseldorf': [6.784, 51.227],
  'dusseldorf': [6.784, 51.227],
  'leipzig': [12.374, 51.340],
  'dortmund': [7.467, 51.514],
  'essen': [7.011, 51.455],
  'bremen': [8.801, 53.073],
  'dresden': [13.738, 51.050],
  'hannover': [9.738, 52.374],
  'nürnberg': [11.077, 49.452],
  'nuremberg': [11.077, 49.452],
  'duisburg': [6.762, 51.434],
  'bochum': [7.217, 51.482],
  'wuppertal': [7.148, 51.256],
  'bielefeld': [8.533, 52.021],
  'bonn': [7.098, 50.733],
  'münster': [7.626, 51.962],
  'mannheim': [8.466, 49.488],
  'karlsruhe': [8.403, 49.009],
  'wiesbaden': [8.239, 50.082],
  'augsburg': [10.898, 48.371],
  'aachen': [6.083, 50.776],
  'gelsenkirchen': [7.100, 51.517],
  'braunschweig': [10.526, 52.268],
  'chemnitz': [12.929, 50.832],
  'kiel': [10.122, 54.323],
  'halle': [11.970, 51.482],
  'magdeburg': [11.627, 52.120],
  'freiburg': [7.842, 47.997],
  'krefeld': [6.566, 51.334],
  'lübeck': [10.686, 53.869],
  'lubeck': [10.686, 53.869],
  'mainz': [8.271, 49.998],
  'erfurt': [11.029, 50.978],
  'rostock': [12.099, 54.092],
  'kassel': [9.504, 51.312],
  'hagen': [7.472, 51.360],
  'hamm': [7.822, 51.680],
  'saarbrücken': [6.996, 49.234],
  'saarbrucken': [6.996, 49.234],
  'potsdam': [13.064, 52.390],
  'osnabrück': [8.043, 52.279],
  'osnabruch': [8.043, 52.279],
  'oldenburg': [8.215, 53.143],
  'leverkusen': [6.984, 51.046],
  'heidelberg': [8.694, 49.399],
  'darmstadt': [8.651, 49.871],
  'regensburg': [12.101, 49.013],
  'ingolstadt': [11.426, 48.763],
  'würzburg': [9.929, 49.792],
  'wurzburg': [9.929, 49.792],
  'ulm': [9.987, 48.401],
  'heilbronn': [9.219, 49.140],
  'wolfsburg': [10.785, 52.424],
  'göttingen': [9.934, 51.541],
  'gottingen': [9.934, 51.541],
  'erlangen': [11.004, 49.595],
  'trier': [6.641, 49.749],
  'koblenz': [7.591, 50.357],
  'jena': [11.590, 50.927],
  'hildesheim': [9.952, 52.151],
  'cottbus': [14.334, 51.756],
  'schwerin': [11.417, 53.629],
  'paderborn': [8.753, 51.719],
  'reutlingen': [9.212, 48.491],
  'fürth': [10.988, 49.478],
  'furth': [10.988, 49.478],
  'pforzheim': [8.698, 48.890],
  'mönchengladbach': [6.440, 51.180],
  'monchengladbach': [6.440, 51.180],
  'bremerhaven': [8.577, 53.551],
  'oberhausen': [6.849, 51.470],
  'herne': [7.225, 51.537],
  'solingen': [7.082, 51.165],
  'neuss': [6.686, 51.198],
  'witten': [7.353, 51.444],
  'münchengladbach': [6.440, 51.180],
  'lünen': [7.527, 51.620],
  'lunen': [7.527, 51.620],
  'mülheim': [6.883, 51.427],
  'mulheim': [6.883, 51.427],
  'mülheim an der ruhr': [6.883, 51.427],
  'offenbach': [8.764, 50.104],
  'ludwigshafen': [8.439, 49.477],
  'bottrop': [6.922, 51.524],
  'remscheid': [7.189, 51.180],
  'bergisch gladbach': [7.135, 50.990],
  'görlitz': [14.987, 51.153],
  'gorlitz': [14.987, 51.153],
  'greifswald': [13.387, 54.093],
  'stralsund': [13.087, 54.314],
  'flensburg': [9.436, 54.785],
  'lüneburg': [10.415, 53.250],
  'luneburg': [10.415, 53.250],
  'bamberg': [10.900, 49.900],
  'bayreuth': [11.578, 49.945],
  'landshut': [12.152, 48.537],
  'passau': [13.469, 48.574],
  'rosenheim': [12.128, 47.856],
  'kempten': [10.317, 47.726],
  'konstanz': [9.177, 47.666],
  'friedrichshafen': [9.478, 47.654],
  'ravensburg': [9.613, 47.781],
  'ulm (donau)': [9.987, 48.401],
  'aalen': [10.093, 48.835],
  'tübingen': [9.054, 48.521],
  'tubingen': [9.054, 48.521],
  'sindelfingen': [8.999, 48.714],
  'villingen-schwenningen': [8.459, 47.960],
  'gera': [12.082, 50.879],
  'erfurt (thüringen)': [11.029, 50.978],
  'zwickau': [12.497, 50.720],
  'plauen': [12.138, 50.499],
  'görlitz (sachsen)': [14.987, 51.153],
  'weimar': [11.329, 50.979],
  'halle (saale)': [11.970, 51.482],
  'dessau': [12.245, 51.836],
  'bitterfeld': [12.321, 51.623],
  'halle-neustadt': [11.970, 51.482],
}

function findCoords(city: string): [number, number] | null {
  const key = city.toLowerCase().trim()
  if (CITY_COORDS[key]) return CITY_COORDS[key]
  // Partial match for compound city names (e.g. "Frankfurt a.M." → "frankfurt")
  for (const [k, v] of Object.entries(CITY_COORDS)) {
    if (key.startsWith(k) || k.startsWith(key)) return v
  }
  return null
}

interface Props {
  data: Array<{ city: string; count: number }>
}

interface TooltipState {
  city: string
  count: number
  x: number
  y: number
}

export default function GermanyMap({ data }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const markers = useMemo(() => {
    const result: Array<{ city: string; count: number; coords: [number, number] }> = []
    for (const { city, count } of data) {
      const coords = findCoords(city)
      if (coords) result.push({ city, count, coords })
    }
    return result.sort((a, b) => b.count - a.count) // largest last so small dots aren't hidden
  }, [data])

  const maxCount = Math.max(...markers.map((m) => m.count), 1)

  function markerRadius(count: number) {
    return Math.max(4, Math.min(20, 4 + (count / maxCount) * 16))
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-card">
      <div className="mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white">Unterstützer nach Standort</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {markers.length} von {data.length} Städten auf der Karte verortet
        </p>
      </div>

      <div className="relative">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [10.5, 51.2], scale: 2800 }}
          width={500}
          height={550}
          style={{ width: '100%', height: 'auto' }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies
                .filter((geo) => geo.properties.name === 'Germany')
                .map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#EFF6FF"
                    stroke="#BFDBFE"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                ))
            }
          </Geographies>

          {markers.map(({ city, count, coords }) => (
            <Marker
              key={city}
              coordinates={coords}
              onMouseEnter={(e) => {
                const rect = (e.currentTarget as SVGElement).closest('svg')!.getBoundingClientRect()
                const pt = (e.currentTarget as SVGElement).getBoundingClientRect()
                setTooltip({
                  city,
                  count,
                  x: pt.left - rect.left + pt.width / 2,
                  y: pt.top - rect.top - 8,
                })
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              <circle
                style={{ cursor: 'pointer' }}
                r={markerRadius(count)}
                fill="#0B3A75"
                fillOpacity={0.75}
                stroke="#FFFFFF"
                strokeWidth={1.5}
              />
            </Marker>
          ))}
        </ComposableMap>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="pointer-events-none absolute z-10 bg-gray-900 dark:bg-gray-700 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap -translate-x-1/2 -translate-y-full"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            <span className="font-semibold">{tooltip.city}</span>
            <span className="text-gray-300 ml-1.5">{tooltip.count} Unterstützer</span>
          </div>
        )}
      </div>

      {/* City list fallback for unlocated cities */}
      {data.filter((d) => !findCoords(d.city)).length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-2">Nicht verortet:</p>
          <div className="flex flex-wrap gap-1.5">
            {data
              .filter((d) => !findCoords(d.city))
              .map(({ city, count }) => (
                <span
                  key={city}
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded"
                >
                  {city} ({count})
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
