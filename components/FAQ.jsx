'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: 'How does the AI Cover Letter Generator work?',
      answer:
        'Our AI analyzes your resume and the job description to create a personalized cover letter that highlights your most relevant skills and experience. You can also adjust the tone and style to match the role.',
    },
    {
      question: 'How accurate is the Resume Analyzer?',
      answer:
        'The Resume Analyzer provides detailed feedback on grammar, structure, missing skills, and formatting. While highly accurate, it should be used as a guide alongside professional career advice.',
    },
    {
      question: 'What can I expect from the AI Mock Interview tool?',
      answer:
        'The AI Mock Interview simulates real interview scenarios, asking common and role-specific questions. It then gives you feedback on clarity, confidence, and relevance to help you prepare better.',
    },
    {
      question: 'How does the AI Tutor for English Improvements help me?',
      answer:
        'The AI Tutor helps you practice English speaking and writing. It provides corrections for grammar, pronunciation tips, and suggestions to improve fluency, vocabulary, and confidence in communication.',
    },
    {
      question: 'Is my data secure and private?',
      answer:
        'Yes, we take data security seriously. Your information is only processed to generate results and is not stored permanently. You remain in control of your personal data at all times.',
    },
  ];


  const contentVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  const iconVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
    //   animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className='space-y-6'
    >
      <div className='text-center'>
        <h2 className='md:text-3xl text-2xl font-bold mb-2'>Frequently Asked Questions</h2>
        <p className='text-muted-foreground'>
          Everything you need to know about our AI career tools
        </p>
      </div>

      <div className='max-w-5xl mx-auto space-y-4'>
        {faqData.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            <Card className='hover:shadow-md transition-shadow overflow-hidden max-md:py-4'>
              <CardHeader
                className='cursor-pointer'
                onClick={() => toggleFaq(index)}
              >
                <div className='flex items-center justify-between'>
                  <CardTitle className='md:text-lg text-base max-md:font-semibold '>{faq.question}</CardTitle>
                  <motion.div
                    variants={iconVariants}
                    initial='closed'
                    animate={openIndex === index ? 'open' : 'closed'}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <ChevronDown className='h-5 w-5' />
                  </motion.div>
                </div>
              </CardHeader>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    variants={contentVariants}
                    initial='closed'
                    animate='open'
                    exit='closed'
                    style={{ overflow: 'hidden' }}
                  >
                    <CardContent className='pt-0 pb-2 md:pb-6'>
                      <p className='text-muted-foreground leading-relaxed'>
                        {faq.answer}
                      </p>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FAQ;
