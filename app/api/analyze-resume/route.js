import { NextResponse } from 'next/server';
import { groqClient } from '@/lib/groq-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const resumeText = body.resumeText || '';

    if (!resumeText.trim()) {
      return NextResponse.json(
        { success: false, error: 'No resume text provided' },
        { status: 400 }
      );
    }

    // Call Groq API
    const result = await groqClient.analyzeResume(resumeText);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Model failed' },
        { status: 500 }
      );
    }

    const feedback = result.content;

    // Ensure valid JSON
    let parsedFeedback;
    try {
      parsedFeedback = JSON.parse(feedback);
    } catch (err) {
      console.error(
        'analyze-resume: model returned invalid JSON:',
        err,
        feedback
      );
      return NextResponse.json(
        { success: false, error: 'Invalid JSON returned by model' },
        { status: 500 }
      );
    }

    // Return feedback directly (no DB storage)
    return NextResponse.json({ success: true, feedback: parsedFeedback });
  } catch (error) {
    console.error('analyze-resume route error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error' },
      { status: 500 }
    );
  }
}
