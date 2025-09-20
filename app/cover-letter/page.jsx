import React from 'react'
import CoverLetter from '@/components/CoverLetter'

// app/cover-letter/seo.js
export const metadata = {
  title: "Free AI Cover Letter Generator | Create ATS-Friendly Job Cover Letters",
  description:
    "Generate personalized, ATS-ready cover letters for free. Upload your resume, paste the job description, and get an AI-crafted cover letter instantly.",
  keywords: [
    "Free Cover Letter Generator",
    "AI Cover Letter Generator",
    "Online Cover Letter Maker",
    "Resume to Cover Letter Tool",
    "Personalized Job Application Letter",
    "Professional Cover Letter Templates",
    "ATS-Friendly Cover Letter Builder",
    "AI Cover Letter Writer",
    "Cover Letter Generator Online Free",
    "Create Job Cover Letter Automatically",
    "Free CV Cover Letter Generator",
    "AI Job Application Letter Generator"
  ],
  openGraph: {
    title: "Free AI Cover Letter Generator | Create ATS-Friendly Cover Letters",
    description:
      "Write the perfect cover letter with AI. Free tool to generate tailored cover letters from your resume and job description.",
    url: "https://yourdomain.com/cover-letter",
    siteName: "YourSite",
    images: [
      {
        url: "https://yourdomain.com/images/cover-letter-preview.png",
        width: 1200,
        height: 630,
        alt: "Free AI Cover Letter Generator",
      },
    ],
    type: "website",
  },
  
};

const page = () => {
  return (
    <div>
      <CoverLetter/>
    </div>
  )
}

export default page