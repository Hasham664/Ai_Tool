// app/api/tutor/route.js
import { NextResponse } from 'next/server';
import { groqClient } from '@/lib/groq-client';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: 'No audio file uploaded' },
        { status: 400 }
      );
    }

    // Convert upload to Buffer
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Send audio to Groq transcription endpoint
    const groqUrl = 'https://api.groq.com/openai/v1/audio/transcriptions';
    const fileBlob = new Blob([buffer], {
      type: audioFile.type || 'audio/webm',
    });
    const payload = new FormData();
    payload.append('file', fileBlob, audioFile.name || 'answer.webm');
    payload.append('model', 'whisper-large-v3');

    const transRes = await fetch(groqUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        // do NOT set content-type for FormData
      },
      body: payload,
    });

    if (!transRes.ok) {
      const errText = await transRes.text().catch(() => 'No response body');
      console.error('Groq transcription error:', transRes.status, errText);
      return NextResponse.json(
        { success: false, error: 'Transcription failed' },
        { status: 502 }
      );
    }

    const transJson = await transRes.json().catch(() => null);
    const transcript =
      (transJson && (transJson.text || transJson.transcript)) ||
      (typeof transJson === 'string' ? transJson : JSON.stringify(transJson));

    if (!transcript || transcript.trim().length === 0) {
      console.error('Empty transcript from Groq:', transJson);
      return NextResponse.json(
        {
          success: false,
          error: 'Empty transcript from transcription service',
        },
        { status: 502 }
      );
    }

    // Now request detailed feedback from your groq client (text)
    // Ask for strict JSON with corrections, pronunciation tips, and corrected final text
    const systemPrompt = `You are a professional English tutor and pronunciation coach.
Return EXACTLY a JSON object and NOTHING else, following this schema:

{
  "corrected_text":"...",
  "corrections":[ corrected + short explanation
    { "original":"...", "corrected":"...", "explanation":"..." }
  ],
  "pronunciation":[                    // words/phrases with pronunciation tips (1-2 sentences each)
    { "word":"...", "advice":"..." }
  ],
  "grammarIssues":[ "concise point 1", "point 2" ],
  "fluencyScore": 0,                   // integer 0-100
  "summary":"short 1-2 sentence feedback"
}

Rules:
- Keep text concise.
- corrected_text should be a complete corrected version of the transcript.
- corrections should contain only the parts that were wrong and a short explanation (1 sentence).
- pronunciation items should be short (1-2 short sentences).
- fluencyScore is an integer between 0 and 100.
- Output must be valid JSON only.`;

    const userPrompt = `Transcript:\n${transcript}\n\nProvide the JSON feedback as requested above.`;

    const textResult = await groqClient.generateText(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { temperature: 0.2, maxTokens: 1000 }
    );

    if (!textResult.success) {
      console.error('groqClient.generateText failed:', textResult.error);
      return NextResponse.json(
        { success: false, error: 'Analysis model failed' },
        { status: 502 }
      );
    }

    // Try parse model output as JSON
    let feedback;
    try {
      feedback = JSON.parse(textResult.content);
    } catch (err) {
      console.error(
        'Failed to parse model feedback JSON:',
        err,
        'raw:',
        textResult.content
      );
      feedback = {
        corrected_text: '',
        corrections: [],
        pronunciation: [],
        grammarIssues: [],
        fluencyScore: 0,
        summary: 'Unable to parse model output.',
        _raw: textResult.content,
      };
    }

    return NextResponse.json({ success: true, transcript, feedback });
  } catch (error) {
    console.error('tutor route error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
