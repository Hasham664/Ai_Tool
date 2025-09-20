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

    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const groqUrl = 'https://api.groq.com/openai/v1/audio/transcriptions';
    const fileBlob = new Blob([buffer], {
      type: audioFile.type || 'audio/webm',
    });

    const payload = new FormData();
    payload.append('file', fileBlob, audioFile.name || 'interview.webm');
    payload.append('model', 'whisper-large-v3');

    const transRes = await fetch(groqUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
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

    if (!transcript || transcript.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Empty transcript from transcription service',
        },
        { status: 502 }
      );
    }

    // Better prompt for detailed interview feedback
    const systemPrompt = `You are a professional interview coach. 
Analyze the candidate's answer and return ONLY valid JSON in this format:

{
  "score": number (0-100),
  "communication": string,
  "clarity": string,
  "confidence": string,
  "technicalDepth": string,
  "fillerWords": string,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "suggestions": ["..."],
  "finalAdvice": string
  "correctedTranscript": string

}

Rules:
- Provide thoughtful, detailed, and practical feedback.
- Each string should be 1-3 sentences.
- Score must be realistic.
- correctedTranscript must be the same answer but with proper grammar, spelling, and natural English.
`;

    const userPrompt = `Interview Transcript:\n${transcript}\n\nPlease provide structured, detailed feedback.`;

    const textResult = await groqClient.generateText(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { temperature: 0.4, maxTokens: 1000 }
    );

    if (!textResult.success) {
      return NextResponse.json(
        { success: false, error: 'Analysis model failed' },
        { status: 502 }
      );
    }

    let feedback;
    try {
      feedback = JSON.parse(textResult.content);
    } catch (err) {
      feedback = {
        score: 0,
        communication: '',
        clarity: '',
        confidence: '',
        technicalDepth: '',
        fillerWords: '',
        strengths: [],
        weaknesses: [],
        suggestions: ['Unable to parse model feedback.'],
        finalAdvice: '',
        _raw: textResult.content,
      };
    }

    return NextResponse.json({ success: true, transcript, feedback });
  } catch (error) {
    console.error('mock-interview route error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
