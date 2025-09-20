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

    const { message } = await request.json();

    if (!message?.trim()) {
      return Response.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Generate AI response without DB
    const result = await groqClient.generateChatResponse(message, []);

    if (!result.success) {
      throw new Error(result.error);
    }

    return Response.json({
      success: true,
      response: result.content,
    });
  } catch (error) {
    console.error('Chat message error:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
