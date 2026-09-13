import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text || text.trim() === '') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Groq API Key is missing. Please add it to your environment variables.' }, { status: 500 });
    }

    const systemPrompt = `You are Head Coach James, a professional elite fitness and nutrition coach.
Your task is to take the provided meal text/table and organize it into a clean, structured 7-day meal plan for the client portal.

STRICT FORMATTING RULES:
1. Output ONLY the meal plan. NEVER output your thinking process, reasoning, internal debate, notes, mapping explanations, or commentary.
2. Structure each day starting with "Day 1", "Day 2"... up to "Day 7".
3. Under each day, list each meal on its own line using standard labels followed by a colon (e.g. Breakfast:, Mid-Morning:, Lunch:, Evening Snack:, Dinner:, Before Bed: - preserve all meals and foods mentioned).
4. Preserve all foods and portions accurately.
5. If guidelines exist, include at most 2 brief bullet points under "Daily Basics:". Do NOT generate long walls of text.
6. Use plain text only. No markdown formatting, asterisks (*), or hashes (#).`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please organize and format this meal plan into clean Day 1 to Day 7 plain text:\n\n${text}` }
        ],
        temperature: 0.1,
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.text();
      console.warn('Groq API Non-OK:', response.status, errorData);
      return NextResponse.json({ formattedText: text.trim() });
    }

    const data = await response.json();
    let rawText = data.choices?.[0]?.message?.content || text;

    // Sanitize: strip out any AI meta-reasoning lines if the model ever hallucinates commentary
    const lines = rawText.split('\n');
    const filteredLines = [];
    let skipMode = false;

    for (const line of lines) {
      const l = line.trim().toLowerCase();
      // Skip meta reasoning/debate blocks
      if (
        l.startsWith('note:') ||
        l.startsWith('correction:') ||
        l.startsWith('re-evaluating') ||
        l.startsWith('option a:') ||
        l.startsWith('option b:') ||
        l.includes('mapping was applied') ||
        l.includes('to fit the required') ||
        l.includes('the prompt asks') ||
        l.includes('here is your') ||
        l.includes('source text lists 6 meal slots')
      ) {
        skipMode = true;
        continue;
      }
      if (skipMode && (l.startsWith('day 1') || l.startsWith('day 2') || l.startsWith('daily basics:'))) {
        skipMode = false;
      }
      if (!skipMode) {
        filteredLines.push(line);
      }
    }

    // Strip markdown formatting
    const formattedText = filteredLines.join('\n')
      .replace(/\*\*([^*]+)\*\*/g, '$1')   // **bold** -> plain
      .replace(/\*([^*]+)\*/g, '$1')       // *italic* -> plain
      .replace(/^#{1,6}\s+/gm, '')         // ### headings -> plain
      .replace(/^\*{1,2}\s*/gm, '• ')      // bullet * -> •
      .replace(/###/g, '')                  // stray ###
      .replace(/\n{3,}/g, '\n\n')          // collapse triple newlines
      .trim();

    return NextResponse.json({ formattedText: formattedText || text.trim() });

  } catch (error) {
    console.warn('Formatting Note/Fallback:', error?.message);
    // Always return original text on timeout or network error so user is never blocked
    return NextResponse.json({ formattedText: text ? text.trim() : '' });
  }
}
