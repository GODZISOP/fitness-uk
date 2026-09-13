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

    const systemPrompt = `You are Head Coach James, a professional fitness coach. Your task is to take the user's messy text and organize it into a strict, clean 7-day meal plan.

OUTPUT FORMAT RULES (follow exactly):
1. Use "Day 1", "Day 2"... "Day 7" as section headers (nothing else before the day header).
2. Under each day, always use these exact labels followed by a colon: Breakfast:, Lunch:, Snack:, Dinner:
3. Do NOT use asterisks (*), hash symbols (#), or any markdown. Plain text only.
4. After Day 7, add a "Daily Basics:" section with water target and general guidelines.
5. Do NOT add any conversational intro or outro text like "Here is your plan...". Output the plan directly.
6. Do NOT change any nutritional values, portions, or food items mentioned.

EXACT FORMAT TO FOLLOW:
Day 1
Breakfast: [food]
Lunch: [food]
Snack: [food]
Dinner: [food]

Day 2
Breakfast: [food]
...

Daily Basics:
Water: [amount]
[other guidelines]`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please organize and format this messy text: \n\n${text}` }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API Error:', errorData);
      return NextResponse.json({ error: `Groq API Error: ${response.status} - ${errorData}` }, { status: response.status });
    }

    const data = await response.json();
    const rawText = data.choices[0]?.message?.content || text;

    // Strip any markdown that the model may have added despite instructions
    const formattedText = rawText
      .replace(/\*\*([^*]+)\*\*/g, '$1')   // **bold** -> plain
      .replace(/\*([^*]+)\*/g, '$1')       // *italic* -> plain
      .replace(/^#{1,6}\s+/gm, '')         // ### headings -> plain
      .replace(/^\*{1,2}\s*/gm, '• ')      // bullet * -> •
      .replace(/###/g, '')                  // stray ###
      .replace(/\n{3,}/g, '\n\n')          // collapse triple newlines
      .trim();

    return NextResponse.json({ formattedText });

  } catch (error) {
    console.error('Formatting Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
