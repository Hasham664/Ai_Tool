'use client';
import React from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Users, FileText, Award, Clock } from 'lucide-react';
import { useRef, useEffect } from 'react';

const AnimatedNumber = ({ target, suffix = '', duration = 2 }) => {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: duration * 1000 });
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (isInView) {
      motionValue.set(target);
    }
  }, [motionValue, isInView, target]);

  useEffect(() => {
    springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest) + suffix;
      }
    });
  }, [springValue, suffix]);

  return <span ref={ref}>0{suffix}</span>;
};

const UserCountsCards = () => {
  const cardData = [
    {
      icon: Users,
      target: 550,
      suffix: '+',
      label: 'Active Users',
      colorClass: 'text-primary',
    },
    {
      icon: FileText,
      target: 300,
      suffix: '+',
      label: 'Cover Letters Generated',
      colorClass: 'text-chart-1',
    },
    {
      icon: Award,
      target: 60,
      suffix: '%',
      label: 'User Satisfaction',
      colorClass: 'text-green-500',
    },
    {
      icon: Clock,
      target: 24,
      suffix: '/7',
      label: 'AI Support',
      colorClass: 'text-orange-500',
    },
  ];

  return (
    <motion.div className='grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-6'>
      {cardData.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className='hover:scale-105 transition-transform ease-in-out duration-700 cursor-pointer'
        >
          <Card className='text-center hover:shadow-lg transition-shadow'>
            <CardContent className='p-6'>
              <card.icon
                className={`h-8 w-8 mx-auto mb-3 ${card.colorClass}`}
              />
              <div className={`text-3xl font-bold ${card.colorClass}`}>
                <AnimatedNumber
                  target={card.target}
                  suffix={card.suffix}
                  duration={2}
                />
              </div>
              <div className='text-sm text-muted-foreground'>{card.label}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default UserCountsCards;
