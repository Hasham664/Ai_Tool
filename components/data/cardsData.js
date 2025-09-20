import {
  FileText,
  MessageSquare,
  Award,
  Target,
  Sparkles,
  TrendingUp,
  Mic,
} from 'lucide-react';

export const cardsData = [
  {
    id: 1,
    link: '/cover-letter',
    borderColor: 'hover:border-primary/50',
    gradient: 'from-primary to-purple-500',
    icon: FileText,
    title: 'Cover Letter Generator',
    description: 'Create personalized cover letters with AI',
    points: [
      {
        icon: Sparkles,
        text: 'Multiple tone options (Professional, Friendly, Confident)',
        color: 'text-primary',
      },
      {
        icon: TrendingUp,
        text: 'Industry-specific variants and optimization',
        color: 'text-primary',
      },
      {
        icon: Award,
        text: 'AI-powered personalization for each job',
        color: 'text-primary',
      },
      {
        icon: Target,
        text: 'Resume and job description matching',
        color: 'text-primary',
      },
    ],
    button: {
      text: 'Generate Cover Letter',
      className:
        'w-full mt-6 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-lg py-6 cursor-pointer',
      variant: 'solid',
    },
  },
  {
    id: 2,
    link: '/resume-analyzer',
    borderColor: 'hover:border-chart-1/50',
    gradient: 'from-chart-1 to-blue-500',
    icon: MessageSquare,
    title: 'Resume Analyzer',
    description: 'Get AI-powered feedback & ATS optimization',
    points: [
      {
        icon: FileText,
        text: 'Detailed analysis in 6+ feedback categories',
        color: 'text-chart-1',
      },
      {
        icon: Sparkles,
        text: 'Grammar, structure, and formatting review',
        color: 'text-chart-1',
      },
      {
        icon: TrendingUp,
        text: 'Skills gap analysis and recommendations',
        color: 'text-chart-1',
      },
      {
        icon: Target,
        text: 'ATS optimization tips and suggestions',
        color: 'text-chart-1',
      },
    ],
    button: {
      text: 'Analyze Resume',
      className:
        'w-full mt-6 border-2 border-chart-1 text-chart-1 hover:bg-chart-1 hover:text-white text-lg py-6 bg-transparent cursor-pointer',
      variant: 'outline',
    },
  },
  {
    id: 3,
    link: '/mock-interview',
    borderColor: 'hover:border-green-500/50',
    gradient: 'from-green-500 to-emerald-600',
    icon: Mic,
    title: 'AI Mock Interview',
    description: 'Practice interviews with AI feedback',
    points: [
      {
        icon: Sparkles,
        text: 'Real-time AI-generated interview questions',
        color: 'text-green-600',
      },
      {
        icon: Award,
        text: 'Instant feedback on answers & communication',
        color: 'text-green-600',
      },
      {
        icon: TrendingUp,
        text: 'Suggestions for improvement & confidence boost',
        color: 'text-green-600',
      },
      {
        icon: Target,
        text: 'Role-specific interview practice sessions',
        color: 'text-green-600',
      },
    ],
    button: {
      text: 'Start Mock Interview',
      className:
        'w-full mt-6 bg-gradient-to-r from-chart-1 to-primary hover:from-green-600 hover:to-emerald-700 transition-all duration-400 hover:text-white text-lg py-6 cursor-pointer',
      variant: 'solid',
    },
  },
];
