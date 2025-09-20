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
import {
  ArrowLeft,
  FileText,
  Upload,
  Sparkles,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Target,
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
export default function ResumeAnalyzer() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

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
          setResumeText(data.text || '');
        } else {
          alert(
            `Failed to parse PDF: ${
              data.error || 'Unknown error'
            }. You can paste your resume text instead.`
          );
        }
      } catch (error) {
        console.error('Error parsing PDF:', error);
        alert('Error parsing PDF. Please paste your resume text instead.');
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

  const analyzeResume = async () => {
    if (!resumeText.trim()) return;

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });

      const data = await response.json();

      if (data.success && data.feedback) {
        // feedback should be a JSON string (strict JSON from model)
        let parsed;
        try {
          parsed =
            typeof data.feedback === 'string'
              ? JSON.parse(data.feedback)
              : data.feedback;
          // Ensure expected shape minimally
          parsed.strengths = parsed.strengths || [];
          parsed.improvements = parsed.improvements || [];
          parsed.grammar = parsed.grammar || [];
          parsed.missingSkills = parsed.missingSkills || [];
          parsed.atsRecommendations = parsed.atsRecommendations || {
            add: [],
            remove: [],
          };
          parsed.score =
            typeof parsed.score === 'number'
              ? parsed.score
              : Number(parsed.score) || 0;
        } catch (err) {
          console.error('Failed to parse analysis JSON:', err);
          // Fallback friendly message
          parsed = {
            strengths: [],
            improvements: ['Analysis could not be parsed. Try again.'],
            grammar: [],
            missingSkills: [],
            atsRecommendations: { add: [], remove: [] },
            score: 0,
          };
        }
        setAnalysis(parsed);
      } else {
        const err = (data && data.error) || 'Unknown error from analysis API';
        console.error('Analyze resume error:', err);
        alert('Analysis failed: ' + err);
      }
    } catch (error) {
      console.error('Error analyzing resume:', error);
      alert('Error analyzing resume. Try again.');
    } finally {
      setIsAnalyzing(false);
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
        <h1 className='text-4xl font-bold bg-gradient-to-r from-chart-1 to-blue-500 bg-clip-text text-transparent'>
          Resume Analyzer
        </h1>
        <p className='text-muted-foreground mt-2'>
          Upload a PDF or paste your resume to get a strict JSON analysis and an
          ATS score.
        </p>
      </div>

      <div className='grid lg:grid-cols-2 gap-8'>
        {/* Input Section */}
        <div className='space-y-6'>
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
                    ? 'border-chart-1 bg-chart-1/5'
                    : 'border-muted-foreground/25'
                }`}
              >
                <input {...getInputProps()} />
                {isParsing ? (
                  <div className='flex flex-col items-center'>
                    <div className='relative'>
                      <div className='w-8 h-8 border-4 border-chart-1/30 border-t-chart-1 rounded-full animate-spin'></div>
                      <Sparkles className='absolute inset-0 w-4 h-4 m-auto text-chart-1 animate-pulse' />
                    </div>
                    <p className='text-sm text-chart-1 mt-4 font-medium'>
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
                className='h-[220px]'
              />
            </CardContent>
          </Card>

          <Button
            onClick={analyzeResume}
            disabled={!resumeText.trim() || isAnalyzing}
            className='w-full bg-gradient-to-r from-chart-1 to-blue-500 hover:from-chart-1/90 hover:to-blue-500/90 py-6 text-lg'
          >
            {isAnalyzing ? (
              <div className='flex items-center'>
                <div className='relative mr-3'>
                  <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                  <Sparkles className='absolute inset-0 w-3 h-3 m-auto text-white animate-pulse' />
                </div>
                Analyzing Resume...
              </div>
            ) : (
              <>
                <Sparkles className='h-5 w-5 mr-2' />
                Analyze Resume
              </>
            )}
          </Button>
        </div>

        {/* Analysis Results */}
        <div className='space-y-4'>
          {/* AI-loading skeleton boxes when analyzing */}
          {isAnalyzing ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className='h-36 animate-pulse'>
                  <CardContent className='p-6'>
                    <div className='h-6 bg-muted-foreground/10 rounded w-1/3 mb-4'></div>
                    <div className='space-y-2'>
                      <div className='h-3 bg-muted-foreground/10 rounded w-full'></div>
                      <div className='h-3 bg-muted-foreground/10 rounded w-5/6'></div>
                      <div className='h-3 pb-4 bg-muted-foreground/10 rounded w-3/4'></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          ) : analysis ? (
            <>
              {/* Strengths */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-green-600'>
                    <CheckCircle className='h-5 w-5' />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className='space-y-2'>
                    {analysis.strengths.length ? (
                      analysis.strengths.map((strength, idx) => (
                        <li key={idx} className='flex items-start gap-2'>
                          <CheckCircle className='h-4 w-4 text-green-500 mt-0.5 flex-shrink-0' />
                          <span className='text-sm'>{strength}</span>
                        </li>
                      ))
                    ) : (
                      <div className='text-sm text-muted-foreground'>
                        No strengths detected.
                      </div>
                    )}
                  </ul>
                </CardContent>
              </Card>

              {/* Areas for Improvement */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-orange-600'>
                    <AlertCircle className='h-5 w-5' />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className='space-y-2'>
                    {analysis.improvements.length ? (
                      analysis.improvements.map((improvement, idx) => (
                        <li key={idx} className='flex items-start gap-2'>
                          <AlertCircle className='h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0' />
                          <span className='text-sm'>{improvement}</span>
                        </li>
                      ))
                    ) : (
                      <div className='text-sm text-muted-foreground'>
                        No suggestions.
                      </div>
                    )}
                  </ul>
                </CardContent>
              </Card>

              {/* Grammar Issues */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-red-600'>
                    <XCircle className='h-5 w-5' />
                    Grammar & Formatting
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className='space-y-2'>
                    {analysis.grammar.length ? (
                      analysis.grammar.map((issue, idx) => (
                        <li key={idx} className='flex items-start gap-2'>
                          <XCircle className='h-4 w-4 text-red-500 mt-0.5 flex-shrink-0' />
                          <span className='text-sm'>{issue}</span>
                        </li>
                      ))
                    ) : (
                      <div className='text-sm text-muted-foreground'>
                        No grammar issues found.
                      </div>
                    )}
                  </ul>
                </CardContent>
              </Card>

              {/* Missing Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-blue-600'>
                    <TrendingUp className='h-5 w-5' />
                    Skill Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-wrap gap-2'>
                    {analysis.missingSkills.length ? (
                      analysis.missingSkills.map((skill, idx) => (
                        <Badge key={idx} variant='outline' className='text-xs'>
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <div className='text-sm text-muted-foreground'>
                        No missing skills detected.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* ATS Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2 text-purple-600'>
                    <Target className='h-5 w-5' />
                    ATS Optimization
                  </CardTitle>
                  <CardDescription>
                    Recommendations to improve your resume for Applicant
                    Tracking Systems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <div className='p-3 bg-green-50 rounded-lg border border-green-200'>
                      <h4 className='font-medium text-green-800 mb-2'>
                        ✅ Add to your resume:
                      </h4>
                      <ul className='space-y-1 text-sm text-green-700'>
                        {analysis.atsRecommendations.add.length ? (
                          analysis.atsRecommendations.add.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))
                        ) : (
                          <li>
                            • Include industry keywords and quantified
                            achievements
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className='p-3 bg-red-50 rounded-lg border border-red-200'>
                      <h4 className='font-medium text-red-800 mb-2'>
                        ❌ Remove or fix:
                      </h4>
                      <ul className='space-y-1 text-sm text-red-700'>
                        {analysis.atsRecommendations.remove.length ? (
                          analysis.atsRecommendations.remove.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))
                        ) : (
                          <li>
                            • Avoid images, complex formatting, and tables
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Overall Score (no story below it) */}
              <Card>
                <CardHeader>
                  <CardTitle>Overall Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-center'>
                    <div className='text-5xl font-bold text-primary mb-2'>
                      {analysis.score ?? 0}/100
                    </div>
                    {/* intentionally no story/paragraph below score as requested */}
                    <div className='text-sm text-muted-foreground'>
                      ATS Score (higher is better)
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className='h-full'>
              <CardContent className='flex items-center justify-center h-64'>
                <div className='text-center text-muted-foreground'>
                  <FileText className='h-12 w-12 mx-auto mb-4 opacity-50' />
                  <p>
                    Upload your resume to get a strict JSON analysis and ATS
                    score.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}
