import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

function getClient() { return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? '' }) }

const SYSTEM = "Du bist ein freundlicher politischer Assistent der Partei 'Neue Mitte'. Du beantwortest Fragen zur deutschen Politik sachlich und ausgewogen. Beziehe dich auf das Programm der Neuen Mitte: pragmatisch, wirtschaftsliberal, sozial verantwortlich, pro-Europa, starke Mitte. Antworte auf Deutsch, maximal 3 Sätze."

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ reply: 'Der Chatbot ist momentan nicht verfügbar.' })
    }

    const { message, history } = await req.json()
    if (!message) return NextResponse.json({ error: 'message fehlt' }, { status: 400 })

    const messages: Anthropic.MessageParam[] = [
      ...(Array.isArray(history) ? history : []),
      { role: 'user', content: message },
    ]

    const client = getClient()
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: SYSTEM,
      messages,
    })

    const reply = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ reply })
  } catch {
    return NextResponse.json({ error: 'AI error' }, { status: 500 })
  }
}
