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

    const systemPrompt = `You are a professional fitness coach and dietician formatter. 
Your task is to take the user's messy text (which could be a meal plan, workout routine, or general coaching instructions) and organize it into a clean, professional, highly readable format.
- Do NOT change any nutritional values, calories, macros, sets, or reps.
- Do NOT add any extra conversational filler like "Here is your plan...". Only output the formatted text.
- Use clear headings (e.g. "Meal 1", "Workout A"), bullet points, and spacing.
- Keep the language authoritative but supportive (like Coach James).
- If it's a meal plan, try to structure it with bold meal names, lists of foods, and total macros if provided.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please organize and format this messy text: \n\n${text}` }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API Error:', errorData);
      return NextResponse.json({ error: 'Failed to format text with AI.' }, { status: response.status });
    }

    const data = await response.json();
    const formattedText = data.choices[0]?.message?.content || text;

    return NextResponse.json({ formattedText });

  } catch (error) {
    console.error('Formatting Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
