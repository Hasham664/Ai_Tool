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

    // Since DB is removed, return static zeroed stats and empty activity
    return Response.json({
      success: true,
      stats: {
        coverLettersGenerated: 0,
        resumesAnalyzed: 0,
        conversationsStarted: 0,
        recentActivity: [],
      },
    });
  } catch (error) {
    console.error('User stats error:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch user statistics' },
      { status: 500 }
    );
  }
}
