'use client';

import { useSession, signOut } from 'next-auth/react';
import { Dashboard } from '@/components/dashboard';
import { LoginPrompt } from '@/components/login-prompt';
import { useEffect } from 'react';


export default function HomePage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session?.expires) {
      const expiryTime = new Date(session.expires).getTime();
      const now = Date.now();
      const timeout = expiryTime - now;

      if (timeout > 0) {
        const timer = setTimeout(() => {
          signOut({ callbackUrl: '/' }); // Redirect to login
        }, timeout);

        return () => clearTimeout(timer);
      }
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (!session) {
    return <LoginPrompt />;
  }

  return (
    <div className='p-6'>
      <Dashboard />
    </div>
  );
}
