'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Linkedin, Instagram, MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Footer = () => {

  const pathname = usePathname(); // 👈 current route
  const hasBg = pathname.includes('mock-interview') || pathname.includes('tutor');

  const contactInfo = {
    email: 'm.hasham3222@gmail.com',
    phone: '+92 318 7660815',
    linkedin: 'https://www.linkedin.com/in/muhammad-hasham-66a70627a/',
    instagram: 'https://www.instagram.com/its_hasham05/',
    whatsapp: '923187660815',
  };

  const handleHireMe = () => {
    const message = "Hi! I'm interested in hiring you for a project. Let's discuss!";
    const whatsappUrl = `https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const socialLinks = [
    {
      icon: Linkedin,
      url: contactInfo.linkedin,
      label: "LinkedIn",
      color: "hover:text-blue-600 dark:hover:text-blue-400"
    },
    {
      icon: Instagram,
      url: contactInfo.instagram,
      label: "Instagram",
      color: "hover:text-pink-600 dark:hover:text-pink-400"
    }
  ];

  return (
    <footer
      className={`pt-10 border-gray-200 dark:border-gray-700
        ${
          hasBg
            ? 'dark:bg-gradient-to-b from-black via-gray-800 to-gray-900'
            : ''
        }`}
    >
      {' '}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-center'>
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='text-center md:text-left'
          >
            <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-4'>
              Get In Touch
            </h3>

            <div className='space-y-3'>
              <a
                href={`mailto:${contactInfo.email}`}
                className='flex items-center justify-center md:justify-start space-x-3 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-300'
              >
                <Mail className='w-5 h-5' />
                <span className='text-sm'>{contactInfo.email}</span>
              </a>

              <a
                href={`tel:${contactInfo.phone}`}
                className='flex items-center justify-center md:justify-start space-x-3 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-300'
              >
                <Phone className='w-5 h-5' />
                <span className='text-sm'>{contactInfo.phone}</span>
              </a>
            </div>
          </motion.div>

          {/* Hire Me Button */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='text-center'
          >
            <motion.button
              onClick={handleHireMe}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 text-black px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 mx-auto'
            >
              <MessageCircle className='w-5 h-5' />
              <span>Hire Me</span>
            </motion.button>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-2'>
              Opens WhatsApp
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className='text-center md:text-right'
          >
            <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-4'>
              Follow Me
            </h3>

            <div className='flex items-center justify-center md:justify-end space-x-4'>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 ${social.color} transition-all duration-300 hover:shadow-lg`}
                  aria-label={social.label}
                >
                  <social.icon className='w-5 h-5' />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className='mt-8 pt-6 border-t border-gray-200 dark:border-gray-700'
        >
          <div className='flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0'>
            <div className='text-sm text-gray-500 dark:text-gray-400'>
              © 2025 All rights reserved by Hasham
            </div>

            <div className='flex items-center space-x-4'>
              <span className='text-sm text-gray-500 dark:text-gray-400'>
                Built with ❤️ using React & Tailwind
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;