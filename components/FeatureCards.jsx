'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, PenTool, BarChart3, Mic } from 'lucide-react';
import Link from 'next/link';

const AICareerFeatures = () => {
  const features = [
    {
      icon: PenTool,
      title: 'Cover Letter Generator',
      description:
        'Create personalized cover letters that match your resume with job descriptions perfectly.',
      features: [
        'Upload your resume PDF or paste text',
        'Copy & paste job description',
        'AI-powered content matching',
        'Professional formatting',
        'Instant download ready',
      ],
      link: '/cover-letter',
      iconGradient:
        'bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90',
      buttonGradient: 'bg-gradient-to-r from-primary to-chart-1',
    },
    {
      icon: BarChart3,
      title: 'Resume Analyzer',
      description:
        "Get detailed insights on what's missing in your resume and how to improve it.",
      features: [
        'Upload resume PDF file',
        'Comprehensive skill gap analysis',
        'ATS optimization suggestions',
        'Industry-specific recommendations',
        'Improvement action items',
      ],
      link: '/resume-analyzer',
      iconGradient:
        'bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90',
      buttonGradient: 'bg-gradient-to-r from-primary to-purple-500',
    },
    {
      icon: Mic,
      title: 'AI Tutor - English Speaking',
      description:
        'Practice English speaking with real-time AI feedback to improve fluency, pronunciation, and confidence.',
      features: [
        'Interactive speaking practice sessions',
        'Real-time AI feedback on pronunciation & grammar',
        'Conversation simulations for daily & professional use',
        'Personalized tips to improve fluency and vocabulary',
        'Progress tracking to monitor your improvement',
      ],
      link: '/tutor',
      iconGradient:
        'bg-gradient-to-r from-purple-500 to-primary hover:from-purple-500/90 hover:to-primary/90',
      buttonGradient: 'bg-gradient-to-r from-chart-1 to-primary',
    },
  ];

  return (
    <div className=' pt-7 pb-6'>
      <div className=''>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch'>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className='rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 dark:border-gray-700 flex flex-col h-full'
              >
                {/* Icon */}
                <div
                  className={`flex items-center justify-center w-16 h-16 ${feature.iconGradient} rounded-lg mb-6 mx-auto`}
                >
                  <Icon className='w-8 h-8 text-white' />
                </div>

                {/* Title */}
                <h3 className='text-2xl font-bold text-gray-800 dark:text-white text-center mb-4'>
                  {feature.title}
                </h3>

                {/* Description */}
                <p className='text-gray-600 dark:text-gray-300 text-center mb-6 leading-relaxed'>
                  {feature.description}
                </p>

                {/* Features List */}
                <ul className='space-y-3 flex-1'>
                  {feature.features.map((item, i) => (
                    <li key={i} className='flex items-start space-x-3'>
                      <CheckCircle className='w-5 h-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0' />
                      <span className='text-gray-700 dark:text-gray-300 text-sm'>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <Link href={feature.link} >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full mt-6 ${feature.buttonGradient} text-black py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer`}
                  >
                    Get Started
                  </motion.button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AICareerFeatures;
