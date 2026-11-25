import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import {
  SEED_FAQS,
  findBestFaqMatch,
  deduplicateAndUpsertFaq,
  mergeFaqLists,
} from "../../../lib/chatbotMemory";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "qwen/qwen3.8-27b",
];

const FAQ_DB_PATH = path.join(process.cwd(), "src", "data", "chatbot-faqs.json");
let inMemoryFaqCache = null;
let writeQueue = Promise.resolve();

const COACH_SYSTEM_PROMPT = `You are the official AI Coaching Assistant for World Fitness Zone (London, UK — Est. 2007), built to answer questions accurately on behalf of Head Coach James and his coaching team.

====================================================
1. COACHES & 20-YEAR REAL HERITAGE
====================================================
- Head Coach James (London, UK): Founder & Head Coach with a documented 20-year personal physical evolution from 2006 to 2026:
  * 2006: The Foundation
  * 2007: First Gains (World Fitness Zone Est. 2007)
  * 2008: Early Hustle
  * 2009: Dedicated Grind
  * 2011: Building Mass
  * 2013: Raw Strength
  * 2014–2020: Maintained shredded condition for 6+ consecutive years
  * 2016: Gaining Size
  * 2018: The Shred
  * 2020: Iron Discipline
  * 2022: Relentless Focus
  * 2024: Beast Mode
  * 2026: Peak Evolution
- Coach James's Signature Quotes & Philosophy:
  * "You want change, you're gonna have to make sacrifices... 12 weeks of discipline, 12 weeks of eating healthy. And you'll see results like this. By the way, if you follow my meal plan, you'll never be hungry!"
  * "Discipline creates freedom. Stick to the meals."
- Head Strength & Conditioning Coach: Marcus Vance — Former national powerlifting coach with 12+ years of experience in physique development and explosive strength.

====================================================
2. FLAGSHIP 13-WEEK TRANSFORMATION PROGRAM
====================================================
- Core Belief: Maximum 13 weeks by design — Week 1 is Preparation (metabolic reset, baseline testing, nutrition & form setup), followed by 12 weeks (Weeks 2–13) of momentum, hard work, and mental and physical discipline. Coach James's goal is NOT to lock clients into endless dependency on a trainer, but to deliver elite results while teaching permanent habits so clients graduate confident and self-sufficient.
- Proven Track Record: 500+ transformation success stories, 10,000+ satisfied clients, 4.9/5 rating, plus a 14-day free training pass / free consultation inquiry option.
- Core Services: 1-on-1 Personal Coaching, Strength & Hypertrophy Training, Customized Nutrition & Meal Plans, Real-Time Form Correction, Total Body Transformation, and 24/7 Flexible VIP Support.
- Complete 13-Week Roadmap:
  * Week 1: Metabolic Reset & Baseline Testing
  * Week 2: Fat Burning Engine Ignition
  * Week 3: Lower Abdominal Shredding (carb cycling intro)
  * Week 4: Mid-Program Recomposition
  * Week 5: Hypertrophy Density & Peak Overload
  * Week 6: 6-Week Milestone & Photo Check-in
  * Week 7: Aggressive Lean Muscle Drive
  * Week 8: Visceral Fat Elimination
  * Week 9: Strength & Power Calibration
  * Week 10: Stage-Conditioning Shred
  * Week 11: Shoulder & Arm Fine-Sculpting
  * Week 12: Final Transformation Polish
  * Week 13: Peak Longevity & Permanent Standard

====================================================
3. MEAL PLANS, NUTRITION PROTOCOLS & DIET TIERS (/meal-plans)
====================================================
- Core Promise: High-satiety whole foods calibrated so you burn fat or build lean muscle without ever feeling starved.
- Three Coaching Tiers:
  1. Amateur (Foundation & Habits): Simple everyday recipes, macro basics, hydration & portion guides, and flexible cheat-meal rules.
  2. Intermediate (Most Popular — Performance & Growth): Custom calorie & macro targets, pre/post-workout nutrition timing, targeted supplement protocol, and weekly coach check-ins.
  3. Advanced (Elite Conditioning): Aggressive carb-cycling, peak-week water manipulation, contest/photoshoot prep, and daily coach check-ins.
- Daily Non-Negotiable Foundation Standard:
  * 3.5L clean water daily (starting with 500ml upon waking + a pinch of Celtic sea salt)
  * 5g Creatine Monohydrate post-workout
  * Omega-3 & Vitamin D3 (2 capsules with Meal 1)
- Cuisine Flexibility (both fully supported):
  * Western / Classic Fitness Meals: eggs, oats, chicken breast, jasmine rice, wild salmon, steak, sweet potato
  * South Asian / Desi Home-Cooked Plans: eggs, roti, paratha, daal, chicken & rice, raita, fresh salad

====================================================
4. VERIFIED CLIENT TRANSFORMATIONS (/transformations)
====================================================
- Sarah M.: Lost 55+ lbs (4 dress sizes) in 16 weeks
- Marcus T.: Lost 18 lbs and carved 6-pack abs in 12 weeks
- Liam K.: 30-day lower belly cut
- Jessica R.: 6-week glute sculpt
- Daniel B.: +2 inches on arms in 12 weeks
- Alex V.: Dropped 28 lbs of visceral fat in 14 weeks
- David H.: +4 inches on shoulders in 12 weeks
- Jack W.: Reached sub-7% body fat in 10 weeks
- Elena P.: Lost 16 lbs and 3 inches off her waist in 8 weeks
- London Program Focus Benchmarks ("Real Results / No Excuses — London Based Coaching"):
  * 12-Week Fat Loss & Conditioning: Losing 15+ lbs while building core strength
  * Lean Muscle Hypertrophy: Gaining 8+ lbs of lean muscle mass and breaking plateaus
  * Posture Correction & Active Lifestyle: Restoring daily energy levels and mobility

====================================================
5. CLIENT PORTAL & WEBSITE PAGES
====================================================
- Client Portal (/resources): Private PIN-access hub with an interactive 7-Day Meal Matrix, Daily Meal Logger, Exercise Technique Videos, 13-Week Transformation Timeline, and direct 2-way messaging with Coach James.
- Site Navigation: Home (/), About & 20-Year Story (/about), Meal Plans (/meal-plans), Client Transformations (/transformations), 20-Year Journey (/transformations/20-year-journey), Client Portal (/resources), Contact / Free Trial Form (/#contact).

====================================================
6. OFFICIAL CONTACT, SOCIAL MEDIA & GETTING STARTED
====================================================
- Phone / WhatsApp Coach James directly: +44 7776899913 (https://wa.me/447776899913)
- Official Instagram: @w0rldfitnessz0ne (https://www.instagram.com/w0rldfitnessz0ne) — training clips, transformation reels, and London coaching updates
- Email: worldfitnesszone@consultant.com
- Inquiry Form: Available on the website at /#contact (ask about the 14-day free pass, free training session in London, or 13-week coaching)

====================================================
RESPONSE RULES
====================================================
1. Be warm, direct, motivating, and grounded — speak like an expert coach from Coach James's team.
2. Reply in the same language or style the user writes in (English, Roman Urdu, Urdu, Hindi, etc.).
3. Use clean, concise formatting (short paragraphs or bullet points, max ~150-220 words unless they ask for the full 13-week breakdown).
4. Only state facts covered above or verified general sports science principles aligned with Coach James's whole-food, progressive-overload methodology. Never invent custom prices, client PIN codes, unverified claims, or medical diagnoses. If someone asks for custom pricing, exact personal macros, or medical advice, guide them to message Coach James directly on WhatsApp (+44 7776899913) or submit the inquiry form at /#contact.
5. Never use markdown bold asterisks (**) or heading hashes (#); output clean plain text and simple "- " bullet lines only.
6. Do not output internal reasoning or <think> tags.`;

function cleanModelOutput(text) {
  if (!text) return "";
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<\/?think>/gi, "")
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .replace(/^\s*#{1,6}\s+/gm, "")
    .replace(/^\s*\*\s+/gm, "- ")
    .trim();
}

async function loadLocalFaqDb() {
  try {
    const raw = await fs.readFile(FAQ_DB_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const merged = mergeFaqLists(parsed, SEED_FAQS);
      inMemoryFaqCache = merged;
      return merged;
    }
  } catch {
    // Fallback to in-memory cache or initial seeds if disk file is missing/unreadable
  }
  const fallback = inMemoryFaqCache || [...SEED_FAQS];
  inMemoryFaqCache = fallback;
  return fallback;
}

async function saveLocalFaqDb(list) {
  inMemoryFaqCache = list;
  writeQueue = writeQueue.then(async () => {
    try {
      await fs.mkdir(path.dirname(FAQ_DB_PATH), { recursive: true });
      await fs.writeFile(FAQ_DB_PATH, JSON.stringify(list, null, 2), "utf-8");
    } catch {
      // Non-fatal if filesystem is read-only; inMemoryFaqCache still serves this instance
    }
  });
  await writeQueue;
}

export async function GET() {
  const faqs = await loadLocalFaqDb();
  return NextResponse.json({ faqs, count: faqs.length });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const rawMessages = Array.isArray(body?.messages) ? body.messages : [];

    const sanitizedMessages = rawMessages
      .filter(
        (m) =>
          m &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0
      )
      .slice(-12)
      .map((m) => ({
        role: m.role,
        content: m.content.trim().slice(0, 2000),
      }));

    if (
      sanitizedMessages.length === 0 ||
      sanitizedMessages[sanitizedMessages.length - 1].role !== "user"
    ) {
      return NextResponse.json(
        { error: "Please enter a message to ask Coach James's assistant." },
        { status: 400 }
      );
    }

    const latestQuestion = sanitizedMessages[sanitizedMessages.length - 1].content;

    // 1. Check local FAQ database first to avoid unnecessary Groq API calls
    const dbList = await loadLocalFaqDb();
    const localMatch = findBestFaqMatch(latestQuestion, dbList);

    if (localMatch) {
      return NextResponse.json({
        reply: localMatch.item.answer,
        source: "local_memory",
        matchedQuestion: localMatch.item.question,
        score: localMatch.score,
      });
    }

    // 2. Question is new / unmatched -> call Groq API (prefer dedicated chatbot key, fallback to GROQ_API_KEY)
    const apiKeys = Array.from(
      new Set([process.env.GROQ_CHAT_API_KEY, process.env.GROQ_API_KEY].filter(Boolean))
    );
    if (apiKeys.length === 0) {
      return NextResponse.json(
        { error: "Chat service is not configured on the server." },
        { status: 500 }
      );
    }

    let lastError = "Failed to reach Groq AI.";

    for (let keyIdx = 0; keyIdx < apiKeys.length; keyIdx++) {
      const apiKey = apiKeys[keyIdx];
      const hasFallbackKey = keyIdx + 1 < apiKeys.length;

      for (const model of MODELS) {
        try {
          const res = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: COACH_SYSTEM_PROMPT },
                ...sanitizedMessages,
              ],
              temperature: 0.65,
              max_tokens: 700,
            }),
          });

          if (!res.ok) {
            const errText = await res.text();
            lastError = `${model} (${res.status}): ${errText.slice(0, 200)}`;
            if (hasFallbackKey && (res.status === 401 || res.status === 403 || res.status === 429)) {
              break;
            }
            continue;
          }

          const data = await res.json();
          const rawReply = data?.choices?.[0]?.message?.content;
          const reply = cleanModelOutput(rawReply);

          if (reply) {
            // 3. Deduplicate & automatically persist the new Q&A in the local DB
            const upsertResult = deduplicateAndUpsertFaq(dbList, latestQuestion, reply, {
              source: "groq_learned",
            });

            if (upsertResult.action !== "skipped") {
              await saveLocalFaqDb(upsertResult.list);
            }

            return NextResponse.json({
              reply,
              source: "groq_api",
              model,
              savedEntry: upsertResult.entry,
              memoryAction: upsertResult.action,
            });
          }
          lastError = `${model} returned an empty response.`;
        } catch (err) {
          lastError = `${model}: ${err?.message || "Network error"}`;
        }
      }
    }

    return NextResponse.json(
      { error: `All AI models failed. ${lastError}` },
      { status: 502 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Invalid chat request." },
      { status: 400 }
    );
  }
}
