import React from 'react'
import ResumeAnalyzer from '@/components/ResumeAnalyzer'
// app/resume/seo.js
export const metadata = {
  title: " Free AI Resume Analyzer & ATS Score Checker | Optimize Your Resume Online",
  description:
    "Upload your resume PDF or paste text to get instant AI-powered analysis. Improve your ATS score, fix formatting issues, add missing skills, and optimize your CV for global job applications.",
  keywords: [
    "AI Resume Analyzer",
    "Resume ATS Score Checker",
    "Free Resume Checker",
    "Online Resume Analyzer",
    "CV Analyzer Online",
    "Resume Keyword Optimizer",
    "Resume Parser AI",
    "ATS Resume Compatibility Test",
    "Resume Skill Gap Analysis",
    "Resume Feedback Tool",
    "How to pass ATS resume screening",
    "Global Resume Optimizer",
    "Free CV Checker Tool",
    "AI-powered Resume Analysis"
  ],
  openGraph: {
    title: "Free AI Resume Analyzer & ATS Score Checker",
    description:
      "Check your resume with AI. Get ATS score, missing skills, formatting tips, and keyword recommendations to land more interviews.",
    url: "https://yourdomain.com/resume",
    siteName: "YourSite",
    images: [
      {
        url: "https://yourdomain.com/images/resume-analyzer-preview.png",
        width: 1200,
        height: 630,
        alt: "AI Resume Analyzer",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Resume Analyzer & ATS Score Checker",
    description:
      "Boost your resume with AI. Get instant ATS score, skill recommendations, and resume optimization tips online.",
    images: ["https://yourdomain.com/images/resume-analyzer-preview.png"],
  },
};

const page = () => {
  return (
    <div>
      <ResumeAnalyzer/>
    </div>
  )
}

export default page