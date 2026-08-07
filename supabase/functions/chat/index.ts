import "jsr:@supabase/functions-js/edge-runtime.d.ts"

declare const EdgeRuntime: { waitUntil(promise: Promise<unknown>): void } | undefined

const LINKEDIN_URL = 'https://www.linkedin.com/in/emilber/'

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

WEB SEARCH: You have a web_search tool. Your training data has a cutoff date and goes stale — use web_search for anything where the answer could have changed since then: current office holders, recent results/scores/winners, prices, versions, or any question the user flags as recent or current. Don't search for general timeless knowledge. Search silently — never mention that you searched, just give the short answer.

FACTS ABOUT EMIL: Use the "About Emil" info below as the primary source — it's maintained directly and is accurate. Only fall back to fetching his LinkedIn profile (${LINKEDIN_URL}) with web_fetch for something not covered below. If that fetch fails or hits a login wall, say you don't have that information rather than guessing.

KNOWN CURRENT FACTS (prefer these over training data; if a question isn't covered here and might be time-sensitive, use web_search instead of guessing):
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
- LinkedIn: ${LINKEDIN_URL}
- Email: emil.berglund+portfolio@live.no
- Phone: +47 981 89 601`
}

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

const ALLOWED_ORIGINS = new Set([
  'https://emilb.no',
  'https://www.emilb.no',
  'http://localhost:5173',
  'http://localhost:4173',
])

// Browsers only enforce CORS, so this stops other sites embedding the widget —
// it does not stop curl. The rate limit and input caps below are what bound abuse.
function buildCors(req: Request) {
  const origin = req.headers.get('Origin')
  return {
    'Access-Control-Allow-Origin': origin && ALLOWED_ORIGINS.has(origin) ? origin : 'null',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  }
}

const MAX_MESSAGES = 20
const MAX_MESSAGE_CHARS = 2_000
const MAX_TOTAL_CHARS = 12_000

type ChatMessage = { role: 'user' | 'assistant'; content: string }

function validateMessages(input: unknown): { messages: ChatMessage[] } | { error: string } {
  if (!Array.isArray(input) || input.length === 0) return { error: 'No messages provided' }
  if (input.length > MAX_MESSAGES) return { error: 'Too many messages' }

  const messages: ChatMessage[] = []
  let totalChars = 0

  for (const raw of input) {
    if (typeof raw !== 'object' || raw === null) return { error: 'Malformed message' }
    const { role, content } = raw as Record<string, unknown>
    if (role !== 'user' && role !== 'assistant') return { error: 'Malformed message' }
    if (typeof content !== 'string' || !content.trim()) return { error: 'Malformed message' }
    if (content.length > MAX_MESSAGE_CHARS) return { error: 'Message too long' }

    totalChars += content.length
    if (totalChars > MAX_TOTAL_CHARS) return { error: 'Conversation too long' }

    messages.push({ role, content })
  }

  if (messages[messages.length - 1].role !== 'user') return { error: 'Last message must be from the user' }
  return { messages }
}

const RATE_LIMIT_MAX = 8
const RATE_LIMIT_WINDOW = '1 minute'

function clientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

// Counter lives in Postgres (public.check_chat_rate_limit) rather than in the isolate:
// isolates are recycled and run in parallel, so an in-memory Map lets a distributed
// caller exceed the cap. The RPC decides and increments in a single atomic upsert.
async function isRateLimited(ip: string): Promise<boolean> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceKey) return false

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/check_chat_rate_limit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
      },
      body: JSON.stringify({ p_ip: ip, p_max: RATE_LIMIT_MAX, p_window: RATE_LIMIT_WINDOW }),
    })

    if (!res.ok) {
      console.error('rate limit check failed', res.status, await res.text())
      return false
    }

    // The function returns true when the request is within the cap.
    return (await res.json()) === false
  } catch (err) {
    // Fail open: a limiter outage should not take the assistant down.
    console.error('rate limit check errored', err)
    return false
  }
}

async function logChat(userMessage: string, assistantResponse: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceKey) return

  try {
    await fetch(`${supabaseUrl}/rest/v1/chat_logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey,
      },
      body: JSON.stringify({ user_message: userMessage, assistant_response: assistantResponse }),
    })
  } catch (err) {
    // Logging is best-effort — never fail the response because the insert failed.
    console.error('chat_logs insert failed', err)
  }
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
  const corsHeaders = buildCors(req)
  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  if (await isRateLimited(clientIp(req))) {
    return json({ error: 'Too many requests' }, 429)
  }

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) {
    return json({ error: 'AI not configured' }, 500)
  }

  let body: { messages?: unknown }
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  const validated = validateMessages(body.messages)
  if ('error' in validated) {
    return json({ error: validated.error }, 400)
  }
  const { messages } = validated

  const lastUserMessage = messages[messages.length - 1].content
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
      tools: [
        { type: 'web_search_20250305', name: 'web_search', max_uses: 3 },
        {
          type: 'web_fetch_20250910',
          name: 'web_fetch',
          max_uses: 2,
          allowed_domains: ['linkedin.com', 'www.linkedin.com'],
        },
      ],
    }),
  })

  if (!response.ok) {
    // Upstream error bodies can carry request/account details — log them, don't return them.
    console.error('Anthropic API error', response.status, await response.text())
    return json({ error: 'Upstream error' }, 502)
  }

  const data = await response.json()
  // With web_search enabled, content can include server_tool_use / web_search_tool_result
  // blocks alongside text — concatenate only the text blocks for the final answer.
  const text = (data.content ?? [])
    .filter((block: { type: string }) => block.type === 'text')
    .map((block: { text: string }) => block.text)
    .join('\n\n')
    .trim()

  // waitUntil keeps the isolate alive for the insert; a bare floating promise
  // can be torn down with the response and silently drop the log.
  const logging = logChat(lastUserMessage, text)
  if (typeof EdgeRuntime !== 'undefined') EdgeRuntime.waitUntil(logging)
  else void logging

  return json({ message: text })
})
