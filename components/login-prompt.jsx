"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, FileText, MessageSquare, Sparkles } from "lucide-react"
import UserCountsCards from "./UserCountsCards"
import FAQ from "./FAQ"
import { motion } from "framer-motion"
import { useState } from "react"
export function LoginPrompt() {
   const [loading, setLoading] = useState(false); // ← add this

   const handleGoogleSignIn = async () => {
     setLoading(true); // show “please wait”
     await signIn('google');
   };
  return (
    <div>
      <div className='min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 overflow-y-hidden'>
        <div className='max-w-5xl w-full space-y-8'>
          {/* Hero Section */}
          <motion.div
            className='text-center space-y-4'
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className='flex justify-center'
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Brain className='h-16 w-16 text-primary' />
            </motion.div>
            <h1 className='text-5xl font-bold bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent'>
              AI Career Pro
            </h1>
            <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
              Transform your job applications with AI-powered cover letters,
              resume optimization, and personalized career guidance.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className='grid md:grid-cols-2 gap-6'>
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className='hover:shadow-lg transition-shadow'>
                <CardHeader>
                  <div className='flex items-center space-x-3'>
                    <FileText className='h-8 w-8 text-primary' />
                    <div>
                      <CardTitle>Smart Cover Letters</CardTitle>
                      <CardDescription>
                        Generate tailored cover letters with multiple tone
                        options
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className='space-y-2 text-sm text-muted-foreground'>
                    <li className='flex items-center space-x-2'>
                      <Sparkles className='h-4 w-4' />
                      <span>Professional, Friendly, Confident tones</span>
                    </li>
                    <li className='flex items-center space-x-2'>
                      <Sparkles className='h-4 w-4' />
                      <span>Industry-specific variants</span>
                    </li>
                    <li className='flex items-center space-x-2'>
                      <Sparkles className='h-4 w-4' />
                      <span>Resume feedback and optimization</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true, amount: 0.4 }}
            >
              <Card className='hover:shadow-lg transition-shadow'>
                <CardHeader>
                  <div className='flex items-center space-x-3'>
                    <MessageSquare className='h-8 w-8 text-chart-1' />
                    <div>
                      <CardTitle>AI Career Assistant</CardTitle>
                      <CardDescription>
                        24/7 personalized career guidance and support
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className='space-y-2 text-sm text-muted-foreground'>
                    <li className='flex items-center space-x-2'>
                      <Sparkles className='h-4 w-4' />
                      <span>Instant career advice</span>
                    </li>
                    <li className='flex items-center space-x-2'>
                      <Sparkles className='h-4 w-4' />
                      <span>Job search strategies</span>
                    </li>
                    <li className='flex items-center space-x-2'>
                      <Sparkles className='h-4 w-4' />
                      <span>Interview preparation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div
            className='text-center space-y-4'
            initial={{ y: -70 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <Button
              size='lg'
              onClick={handleGoogleSignIn} 
              disabled={loading}
              className='bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 text-lg px-8 py-3 cursor-pointer'
            >
              {loading
                ? 'Please wait a sec…'
                : ' Sign In with Google to Get Started'}
            </Button>
            <p className='text-sm text-muted-foreground'>
              Free to use • No credit card required • Secure Google
              authentication
            </p>
          </motion.div>
        </div>
      </div>

      <div className=' px-4 sm:px-8 pt-10 pb-6'>
        <UserCountsCards />
      </div>

      <div className='pb-12 pt-6 max-sm:px-4 '>
        <FAQ />
      </div>
    </div>
  );
}
