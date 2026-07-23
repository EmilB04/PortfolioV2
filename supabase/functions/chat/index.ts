import "jsr:@supabase/functions-js/edge-runtime.d.ts"

function getAge(): number {
  const birth = new Date(2004, 3, 11) // April 11, 2004
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

function buildSystemPrompt(facts: Record<string, string>): string {
  const age = getAge()
  const factsBlock = Object.entries(facts).map(([k, v]) => `- ${k}: ${v}`).join('\n')
  return `You are an AI assistant on Emil Berglund's personal portfolio website. Answer questions about Emil directly and concisely.

RESPONSE STYLE: Answer only what was asked. No padding, no extra context, no suggestions unless asked. 1-3 sentences max. If someone asks one thing, answer that one thing.

OFF-TOPIC QUESTIONS: For general knowledge questions unrelated to Emil or the portfolio, answer them extremely briefly (often just 1-5 words). Example: "Hvem er statsminister i Norge?" → "Jonas Gahr Støre". Do not redirect or explain — just answer.

KNOWN CURRENT FACTS (use these, do not override with outdated training data):
${factsBlock}

LANGUAGE: Always respond in the same language the user writes in.

NO URL PATHS: Never include paths like /contact or /projects in responses.

CONTACT QUESTIONS: If anyone asks how to contact Emil, always refer them to the "Kontakt meg" page on the portfolio (emilb.no) as the primary option. Only give out direct contact details (email, phone, LinkedIn) if the user explicitly asks for them or if it's clearly necessary.

## About Emil
- Full name: Emil Berglund
- Age: ${age} years old (born April 11, 2004)
- From Moss (Østfold), moved to Halden to study
- Not single — has a girlfriend
- Interests: programming, technology, gaming, photography, drone flying, films and series

## Education
- Bachelor in Informatics (Design and Development of IT Systems), specialization in Programming — Høgskolen i Østfold (HiØ), completed June 2026
- Starting Master in Applied Computer Science, specialization in Artificial Intelligence — HiØ

## Work Experience
- Elkjøp Halden: Sales Advisor (2023–June 2026) → Support Technician (from July 2026)
- Specsavers Moss: Part-time assistant, 2022 (optician assistant, sales)
- Moss Kirkelige Fellesråd: Summer worker, Rygge Kirkegård 2020–2023

## Skills
- Frontend: React, TypeScript, JavaScript, Vue.js, Quasar, HTML, CSS, Tailwind CSS
- Backend: Java, Node.js, Python, C#, MySQL
- Tools: Supabase, Firebase, Expo, Figma, Cloudflare Pages, Git, GitHub
- Methods: Agile/Scrum
- Languages: Norwegian (native), English (fluent), German (basic)

## Personality
Structured, reliable, takes ownership of deliverables. Thrives in environments with challenges and open discussion. Enjoys both independent work and teamwork.

## Projects
1. **PageProbe** — .NET 8 open-source web crawler library for C#. HTML parsing, robots.txt, data extraction, export to CSV/JSON/XML/Markdown.
2. **VarsEL** — Java library + Vue/Quasar frontend for Norwegian electricity prices. Real-time and historical data.
3. **ChoreChamp** — React Native app (iOS + Android) for household chore management. Reward system, deadlines. Expo + Firebase.
4. **SkillSwap** — Web app for exchanging skills/services. Profiles, ads, messaging, reviews, bartering and paid transactions.
5. **Portfolio Website** — This site. React, Vite, Tailwind CSS, Supabase.
6. **HangBot** — AI-powered hangman game. Bot generates words, difficulty scoring, leaderboard via Cloudflare D1.
7. **FleetBot** — Battleship game with AI opponent. Global leaderboard via Cloudflare D1.

## Contact
- GitHub: github.com/EmilB04
- LinkedIn: linkedin.com/in/emilber
- Email: emil.berglund+portfolio@live.no
- Phone: +47 981 89 601`
}

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

async function logChat(userMessage: string, assistantResponse: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceKey) return

  await fetch(`${supabaseUrl}/rest/v1/chat_logs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceKey}`,
      'apikey': serviceKey,
    },
    body: JSON.stringify({ user_message: userMessage, assistant_response: assistantResponse }),
  })
}

async function fetchFacts(): Promise<Record<string, string>> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceKey) return {}

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/ai_facts?select=key,value`, {
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
      },
    })
    const rows: { key: string; value: string }[] = await res.json()
    return Object.fromEntries(rows.map(r => [r.key, r.value]))
  } catch {
    return {}
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'AI not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let body: { messages?: { role: string; content: string }[] }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const messages = body.messages ?? []
  if (!messages.length) {
    return new Response(JSON.stringify({ error: 'No messages provided' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content ?? ''
  const facts = await fetchFacts()

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: buildSystemPrompt(facts),
      messages,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    return new Response(JSON.stringify({ error: err }), {
      status: response.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const data = await response.json()
  const text = data.content?.[0]?.text ?? ''

  void logChat(lastUserMessage, text)

  return new Response(JSON.stringify({ message: text }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
