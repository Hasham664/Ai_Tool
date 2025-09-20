'use client';
import React from 'react';
import { motion } from 'framer-motion';
const HomeSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className='text-center space-y-4'
    >
      <h1 className='md:text-6xl md:pt-4 text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-chart-1 bg-clip-text text-transparent'>
        AI-Powered Career Tools
      </h1>
      <p className='md:text-xl text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed max-md:pb-5'>
        Generate compelling cover letters, optimize resumes, practice mock
        interviews, and improve your English fluency all powered by advanced
        AI technology.
      </p>
    </motion.div>
  );
};

export default HomeSection;
