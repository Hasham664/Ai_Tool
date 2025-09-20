import React from 'react'
import TutorPage from '@/components/TutorPage'

export const metadata = {
  title:
    'Free AI English Speaking Tutor - Practice, Pronunciation & Fluency Feedback',
  description:
    'Practice speaking English with AI: get live transcripts, pronunciation tips, corrected feedback, and improve fluency fast. Perfect for non-native speakers.',
  keywords: [
    'AI English speaking tutor Free',
    'English pronunciation feedback Free',
    'improve English fluency For Free',
    'live transcript English speaking For Free',
    'English speaking practice online For Free',
    'correct English mistakes For Free',
    'learn English with AI For Free',
    'speech recognition English tutor',
    'English conversation practice For Free',
    'non native English speaking help',
  ],
  openGraph: {
    title:
      'Free AI English Speaking Tutor – Practice, Pronunciation & Fluency Feedback For Free',
    description:
      'Use AI to improve your English fluency: live speech recognition, corrections, pronunciation guidance, and more For Free.',
    url: 'https://yourdomain.com/tutor',
    type: 'website',
    images: [
      {
        url: 'https://yourdomain.com/og-english-tutor.png',
        width: 1200,
        height: 630,
        alt: 'AI English Tutor: Speak & Improve',
      },
    ],
  },
};

const page = () => {
  
  return (
    <div>
     <TutorPage/>
    </div>
  )
}

export default page