import { Suspense } from 'react';
import { AuthProvider } from '@/components/auth-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/Navbar';
import { ChatbotWidget } from '@/components/chatbot-widget';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import Footer from '@/components/Footer';

const geistSans = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
});

export const metadata = {
  title: 'AI Career Pro - Smart Resume Analyzer & Cover Letter Generator',
  description:
    'Get your dream job with our AI-powered resume analyzer and cover letter generator. Upload your resume, get ATS scores, find missing skills, and create personalized cover letters. Free 24/7 AI career assistant included.',

  keywords:
    'AI resume analyzer, cover letter generator, ATS score checker, resume optimization, job application help, career AI assistant, resume skills analysis, professional cover letters, job search tools, resume parser',

  // Open Graph for social sharing
  openGraph: {
    title: 'AI Career Pro - Smart Resume & Cover Letter Tools',
    description:
      'Transform your job search with AI-powered resume analysis and personalized cover letters. Get instant ATS scores and 24/7 career guidance.',
    url: 'https://aicareer.pro',
    siteName: 'AI Career Pro',
    type: 'website',
    images: [
      {
        url: '/logo.webp',
        width: 1200,
        height: 630,
        alt: 'AI Career Pro - Resume Analyzer and Cover Letter Generator',
      },
    ],
  },

  // Essential meta tags
  robots: 'index, follow',
  author: 'AI Career Pro',
  category: 'Career Tools',

  // Canonical URL
  alternates: {
    canonical: 'https://aicareer.pro',
  },

  // App info
  applicationName: 'AI Career Pro',
  generator: 'Next.js',

  // Additional helpful meta
  other: {
    'theme-color': '#2563eb',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        {/* Essential favicon */}
        <link rel='icon' href='/logo.webp' />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />

        {/* Performance optimizations */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />

        {/* Simple structured data for better search results */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'AI Career Pro',
              description:
                'AI-powered resume analyzer and cover letter generator with ATS optimization and career guidance',
              url: 'https://aicareer.pro',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web Browser',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              featureList: [
                'Resume Analysis with ATS Scoring',
                'AI Cover Letter Generation',
                'Skills Gap Analysis',
                '24/7 AI Career Assistant',
                'Job Description Matching',
              ],
              author: {
                '@type': 'Hasham',
                name: 'AI Career Pro',
              },
            }),
          }}
        />

        {/* Mobile optimization */}
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-title' content='AI Career Pro' />

        {/* Security */}
        <meta httpEquiv='X-Content-Type-Options' content='nosniff' />
      </head>

      <body className='font-sans antialiased'>
        <Suspense
          fallback={
            <div className='min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            </div>
          }
        >
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <div className='min-h-screen bg-gradient-to-br from-background via-background to-muted'>
                <Navbar />
                <main className='flex-1' role='main'>
                  {children}
                </main>
                <Footer />
                
              </div>
              <ChatbotWidget />
            </AuthProvider>
          </ThemeProvider>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}
