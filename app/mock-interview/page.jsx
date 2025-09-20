import React from 'react'
import MockInterView from '@/components/MockInterView'

// app/mock-interview/seo.js

export const metadata = {
  title: "Free AI Mock Interview Practice | Real-Time Feedback & Transcription",
  description:
    "Practice for your job interviews with AI Mock Interviews. Record answers, get live transcripts, AI feedback, and track your past attempts to improve your interview skills.",
  keywords: [
    "AI mock interview",
    "job interview practice",
    "AI interview preparation",
    "mock interview tool",
    "interview feedback AI",
    "AI career coach",
    "practice interview online",
    "AI job preparation",
    "interview training platform",
    "real-time mock interview",
    "AI powered mock interview",
    "interview questions practice",
    "career preparation tool",
  ],
  openGraph: {
    title: "Free AI Mock Interview Practice | Real-Time Feedback & Transcription",
    description:
      "Boost your career with AI-powered mock interviews. Get instant feedback, live transcripts, and practice like a real interview.",
    url: "https://yourdomain.com/mock-interview",
    siteName: "YourSite",
    images: [
      {
        url: "https://yourdomain.com/images/mock-interview-preview.png",
        width: 1200,
        height: 630,
        alt: "AI Mock Interview Platform",
      },
    ],
    type: "website",
  },
 
};

const page = () => {
  return (
    <div>
      <MockInterView/>
    </div>
  )
}

export default page