'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Upload, Sparkles } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';



export default function CoverLetter() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [selectedTone, setSelectedTone] = useState('Professional');
  const [selectedIndustry, setSelectedIndustry] = useState('Solution');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  const tones = [
    'Professional',
    'Friendly',
    'Confident',
    'Direct',
    'Casual',
    'Formal',
  ];
  const industries = [
    'Solution',
    'Shopify',
    'WordPress',
    'Custom Web',
    'Marketing',
    'Video Edit',
  ];

  // Redirect to home if not authenticated
  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push('/');
    }
  }, [session, status, router]);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setIsParsing(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/parse-pdf', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (data.success) {
          setResumeText(data.text);
        } else {
          if (data.fallback) {
            alert(
              `PDF parsing is currently unavailable. Please copy and paste your resume text instead. Reason: ${data.error}`
            );
          } else {
            console.error('PDF parsing failed:', data.error);
            alert(
              `Failed to parse PDF: ${data.error} Please try copying and pasting your resume text instead.`
            );
          }
        }
      } catch (error) {
        console.error('Error parsing PDF:', error);
        alert(
          `Error parsing PDF: ${error.message} Please try copying and pasting your resume text instead.`
        );
      } finally {
        setIsParsing(false);
      }
    } else if (file) {
      alert('Please select a PDF file.');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const generateCoverLetter = async () => {
    if (!resumeText || !jobDescription) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          tone: selectedTone,
          industry: selectedIndustry,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedLetter(data.coverLetter);
      }
    } catch (error) {
      console.error('Error generating cover letter:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect via useEffect
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 90 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='p-6'
    >
      <div className='mb-6'>
        <Button
          variant='ghost'
          onClick={() => router.push('/')}
          className='mb-4 cursor-pointer'
        >
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back to Dashboard
        </Button>
        <h1 className='text-4xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent'>
          Cover Letter Generator
        </h1>
        <p className='text-muted-foreground mt-2'>
          Upload your resume and paste the job description to generate a
          personalized cover letter
        </p>
      </div>

      <div className='grid lg:grid-cols-2 gap-8'>
        {/* Input Section */}
        <div className='space-y-6'>
          {/* Resume Upload */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <FileText className='h-5 w-5' />
                Upload Resume
              </CardTitle>
              <CardDescription>
                Upload a PDF file or paste your resume text
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25'
                }`}
              >
                <input {...getInputProps()} />
                {isParsing ? (
                  <div className='flex flex-col items-center'>
                    <div className='relative'>
                      <div className='w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin'></div>
                      <Sparkles className='absolute inset-0 w-4 h-4 m-auto text-primary animate-pulse' />
                    </div>
                    <p className='text-sm text-primary mt-4 font-medium'>
                      Extracting text from PDF...
                    </p>
                  </div>
                ) : (
                  <>
                    <Upload className='h-8 w-8 mx-auto mb-4 text-muted-foreground' />
                    <p className='text-sm text-muted-foreground'>
                      {isDragActive
                        ? 'Drop the PDF here...'
                        : 'Drag & drop a PDF file here, or click to select'}
                    </p>
                  </>
                )}
              </div>

              <div className='text-center text-sm text-muted-foreground'>
                or
              </div>

              <Textarea
                placeholder='Paste your resume text here...'
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className='h-[200px]'
              />
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>
                Paste the job description you're applying for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder='Paste the job description here...'
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className='h-[200px]'
              />
            </CardContent>
          </Card>

          {/* Tone Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Cover Letter Tone</CardTitle>
              <CardDescription>
                Choose the tone for your cover letter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-3 gap-2'>
                {tones.map((tone) => (
                  <Badge
                    key={tone}
                    variant={selectedTone === tone ? 'default' : 'outline'}
                    className='cursor-pointer justify-center py-2 w-20'
                    onClick={() => setSelectedTone(tone)}
                  >
                    {tone}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Industry Focus */}
          <Card>
            <CardHeader>
              <CardTitle>Industry Focus</CardTitle>
              <CardDescription>
                Select your industry or specialization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-3 gap-2'>
                {industries.map((industry) => (
                  <Badge
                    key={industry}
                    variant={
                      selectedIndustry === industry ? 'default' : 'outline'
                    }
                    className='cursor-pointer justify-center py-2 w-20 max-sm:text-xs'
                    onClick={() => setSelectedIndustry(industry)}
                  >
                    {industry}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={generateCoverLetter}
            disabled={!resumeText || !jobDescription || isGenerating}
            className='w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 py-6 text-lg cursor-pointer'
          >
            {isGenerating ? (
              <div className='flex items-center'>
                <div className='relative mr-3'>
                  <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                  <Sparkles className='absolute inset-0 w-3 h-3 m-auto text-white animate-pulse' />
                </div>
                Generating Cover Letter...
              </div>
            ) : (
              <>
                <Sparkles className='h-5 w-5 mr-2' />
                Generate Cover Letter
              </>
            )}
          </Button>
        </div>

        {/* Output Section */}
        <div>
          <Card className='h-full'>
            <CardHeader>
              <CardTitle>Generated Cover Letter</CardTitle>
              <CardDescription>
                Your personalized cover letter will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className='flex items-center justify-center h-64'>
                  <div className='text-center'>
                    <div className='relative w-16 h-16 mx-auto mb-6'>
                      <div className='absolute inset-0 border-4 border-primary/20 rounded-full'></div>
                      <div className='absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin'></div>
                      <div className='absolute inset-2 border-4 border-transparent border-t-purple-500 rounded-full animate-spin animation-delay-150'></div>
                      <Sparkles className='absolute inset-0 w-6 h-6 m-auto text-primary animate-pulse' />
                    </div>
                    <h3 className='text-lg font-semibold mb-2'>
                      AI is crafting your cover letter...
                    </h3>
                    <p className='text-sm text-muted-foreground'>
                      Matching your skills with job requirements
                    </p>
                  </div>
                </div>
              ) : generatedLetter ? (
                <div className='prose prose-sm max-w-none'>
                  <pre className='whitespace-pre-wrap font-sans text-sm leading-relaxed'>
                    {generatedLetter}
                  </pre>
                </div>
              ) : (
                <div className='flex items-center justify-center h-64 text-muted-foreground'>
                  <div className='text-center'>
                    <FileText className='h-12 w-12 mx-auto mb-4 opacity-50' />
                    <p>
                      Upload your resume and job description to generate a cover
                      letter
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
