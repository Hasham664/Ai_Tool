import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { groqClient } from '@/lib/groq-client';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { jobDescription, resumeText, tone, variant } = await request.json();

    if (!jobDescription?.trim() || !resumeText?.trim()) {
      return Response.json(
        {
          success: false,
          error: 'Job description and resume content are required',
        },
        { status: 400 }
      );
    }

    // Generate cover letter using Groq
    const result = await groqClient.generateCoverLetter(
      jobDescription,
      resumeText,
      tone,
      variant
    );

    if (!result.success) {
      throw new Error(result.error);
    }

    // Return generated cover letter (no DB storage)
    return Response.json({
      success: true,
      coverLetter: result.content,
    });
  } catch (error) {
    console.error('Cover letter generation error:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
