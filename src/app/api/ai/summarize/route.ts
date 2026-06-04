import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

function getClient() { return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? '' }) }

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json()
    if (!text || text.length < 50) {
      return NextResponse.json({ error: 'Text zu kurz (mindestens 50 Zeichen)' }, { status: 400 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'KI nicht verfügbar' }, { status: 503 })
    }

    const client = getClient()
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: 'Du bist ein Assistent der das Wesentliche zusammenfasst.',
      messages: [
        {
          role: 'user',
          content: `Fasse folgenden Text in 3 kurzen, klaren deutschen Sätzen zusammen:\n\n${text}`,
        },
      ],
    })

    const summary = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ summary })
  } catch {
    return NextResponse.json({ error: 'AI error' }, { status: 500 })
  }
}
