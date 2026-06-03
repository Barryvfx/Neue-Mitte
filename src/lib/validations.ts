import { z } from 'zod'

export const supporterSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Vorname muss mindestens 2 Zeichen haben')
    .max(50, 'Vorname zu lang')
    .regex(/^[a-zA-ZäöüÄÖÜß\s\-']+$/, 'Ungültige Zeichen im Vornamen'),
  lastName: z
    .string()
    .min(2, 'Nachname muss mindestens 2 Zeichen haben')
    .max(50, 'Nachname zu lang')
    .regex(/^[a-zA-ZäöüÄÖÜß\s\-']+$/, 'Ungültige Zeichen im Nachnamen'),
  email: z.string().email('Ungültige E-Mail-Adresse').max(254),
  city: z
    .string()
    .min(2, 'Wohnort muss mindestens 2 Zeichen haben')
    .max(100, 'Wohnort zu lang')
    .optional(),
  consent: z.boolean().optional(),
  message: z.string().max(500).optional(),
  website: z.string().max(0, 'Spam erkannt').optional(),
  showInTicker: z.boolean().optional(),
  tickerName: z.string().max(100).optional(),
})

export const contactSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben').max(100),
  email: z.string().email('Ungültige E-Mail-Adresse').max(254),
  subject: z.string().min(2, 'Bitte geben Sie einen Betreff an').max(200),
  message: z
    .string()
    .min(10, 'Nachricht muss mindestens 10 Zeichen haben')
    .max(2000, 'Nachricht zu lang'),
  website: z.string().max(0, 'Spam erkannt').optional(),
})

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export type SupporterInput = z.infer<typeof supporterSchema>
export type ContactInput = z.infer<typeof contactSchema>
