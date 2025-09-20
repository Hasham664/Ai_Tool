'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cardsData } from './data/cardsData';
import FAQ from './FAQ';
import UserCountsCards from './UserCountsCards';
import FeatureCards from './FeatureCards';
import HomeSection from './Home-Hero-Section';
export function Dashboard() {
  return (
    <div className='md:space-y-10 space-y-4 container '>
      {/* Hero Section */}
      <HomeSection />

      {/* Main Feature Cards */}
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6  '>
        {cardsData.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: card.id * 0.2 }}
            >
              <Link href={card.link}>
                <Card
                  className={`h-full hover:shadow-2xl  transition-all duration-300 cursor-pointer group border-2 ${card.borderColor}`}
                >
                  <CardHeader className='md:pb-4'>
                    <div className='flex items-center space-x-3'>
                      <div
                        className={`p-3 bg-gradient-to-r ${card.gradient} rounded-xl group-hover:scale-110 transition-transform`}
                      >
                        <Icon className='h-7 w-7 text-white' />
                      </div>
                      <div>
                        <CardTitle className='md:text-2xl text-lg'>
                          {card.title}
                        </CardTitle>
                        <CardDescription className='md:text-base text-sm'>
                          {card.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='space-y-3'>
                      {card.points.map((point, index) => {
                        const PointIcon = point.icon;
                        return (
                          <div
                            key={index}
                            className='flex items-center space-x-3 text-muted-foreground'
                          >
                            <PointIcon className={`h-5 w-5 ${point.color}`} />
                            <span>{point.text}</span>
                          </div>
                        );
                      })}
                    </div>
                    <Button className={card.button.className}>
                      {card.button.text}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className='pt-7 pb-7'>
        <UserCountsCards />
      </div>
      <FeatureCards />
      {/* FAQ Section */}
      <div className='pb-10 '>
        <FAQ />
      </div>
    </div>
  );
}
