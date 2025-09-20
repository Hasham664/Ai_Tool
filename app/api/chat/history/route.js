import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Return empty since we removed DB
    return Response.json({
      success: true,
      conversations: [],
    });
  } catch (error) {
    console.error('Chat history error:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch chat history' },
      { status: 500 }
    );
  }
}
