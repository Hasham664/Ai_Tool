// app/mock-interview/page.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Clock, ChevronDown, Download } from 'lucide-react';
import { getDB } from '../lib/db';
import { AiLoading } from './ai-loading-animation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function MockInterView() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [history, setHistory] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  // Live transcript states
  const [liveInterim, setLiveInterim] = useState('');
  const [liveFinal, setLiveFinal] = useState('');

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push('/');
    }
  }, [session, status, router]);

  // Load history from IndexedDB on mount
  // Load history from IndexedDB on mount
 const loadHistoryMock = async () => {
   try {
     const db = await getDB();
     if (!db.objectStoreNames.contains('historyMock')) {
       setHistory([]);
       console.log('historyMock store not found',history);
       
       return;
     }

     const tx = db.transaction('historyMock', 'readonly');
     const store = tx.objectStore('historyMock');

     const all = await store.getAll();
     all.forEach((h) => {
       if (h.audioBlob) h.audioUrl = URL.createObjectURL(h.audioBlob);
     });

     const sorted = all.sort((a, b) => b.id - a.id).slice(0, 3);
     setHistory(sorted);
     await tx.done;
   } catch (err) {
     console.error('loadHistoryMock error:', err);
     setHistory([]);
   }
 };

 const pushHistory = async (entry) => {
   try {
     const db = await getDB();
     if (!db.objectStoreNames.contains('historyMock')) return;

     const tx = db.transaction('historyMock', 'readwrite');
     const store = tx.objectStore('historyMock');
     
     await store.put(entry);

     const all = await store.getAll();
     console.log('all after put',all);
     
     all.forEach((h) => {
       if (h.audioBlob) h.audioUrl = URL.createObjectURL(h.audioBlob);
     });

     const sorted = all.sort((a, b) => b.id - a.id);
     const latest = sorted.slice(0, 3);
     setHistory(latest);

     for (let i = 3; i < sorted.length; i++) {
       await store.delete(sorted[i].id);
     }

     await tx.done;
   } catch (err) {
     console.error('pushHistoryMock error:', err);
   }
 };
  useEffect(() => {
    loadHistoryMock();
  }, []);

  // Live speech recognition
  const startLiveRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (ev) => {
      let interim = '';
      let final = '';
      for (let i = 0; i < ev.results.length; i++) {
        const transcript = ev.results[i][0].transcript;
        if (ev.results[i].isFinal) final += transcript + ' ';
        else interim += transcript + ' ';
      }
      setLiveInterim(interim);
      if (final.trim()) {
        setLiveFinal((prev) =>
          prev ? prev + ' ' + final.trim() : final.trim()
        );
      }
    };

    recognition.onerror = () => {};
    recognition.onend = () => {};
    recognition.start();
    recognitionRef.current = recognition;
    return recognition;
  };

  // Start recording
  const startRecording = async () => {
    setResult(null);
    setAudioUrl(null);
    setLiveInterim('');
    setLiveFinal('');
    setSeconds(0);

    const hasRecognition = !!(
      window.SpeechRecognition || window.webkitSpeechRecognition
    );
    if (hasRecognition) {
      try {
        startLiveRecognition();
      } catch {}
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const options = { mimeType: 'audio/mp4' }; // ✅ iPhone + Android compatible
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        clearInterval(timerRef.current);
        try {
          recognitionRef.current?.stop();
        } catch {}

        const blob = new Blob(chunksRef.current, { type: 'audio/mp4' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        try {
          setProcessing(true);
          const fd = new FormData();
          fd.append('audio', blob, 'interview.mp4'); // ✅ match blob type

          const res = await fetch('/api/mock-interview', {
            method: 'POST',
            body: fd,
          });

          const data = await res.json();
          if (!res.ok || !data.success) {
            setResult({
              success: false,
              error: data?.error || 'Unknown error',
            });
          } else {
            setResult(data);
            await pushHistory({
              id: Date.now(),
              transcript: data.transcript,
              feedback: data.feedback,
              audioBlob: blob,
              createdAt: new Date().toISOString(),
            });
          }
        } catch (err) {
          console.error('Upload error:', err);
          setResult({ success: false, error: 'Upload failed.' });
        } finally {
          setProcessing(false);
        }
      };

      recorder.start();
      setRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch (err) {
      console.error('startRecording error', err);
      alert('Microphone access denied or not available.');
    }
  };

  const stopRecording = () => {
    try {
      recognitionRef.current?.stop();
    } catch {}

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    setRecording(false);
  };


  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

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
      // className='dark:bg-gradient-to-b from-gray-900 via-gray-800 to-black min-h-screen justify-center px-4 flex flex-col items-center text-white '
      className={`dark:bg-gradient-to-b from-gray-900 via-gray-800 to-black 
              bg-white text-white px-4 flex flex-col items-center justify-center 
              sm:min-h-screen max-sm:pt-12 max-sm:pb-7
              ${history.length > 0 ? 'sm:pt-12 pb-7' : 'sm:pt-0 pb-0'}`}
    >
      <div className='text-center max-w-2xl mb-10 px-4'>
        <h1 className='text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-purple-500 to-chart-1 bg-clip-text text-transparent'>
          🎤 AI Mock Interview
        </h1>
        <p className='dark:text-gray-400 text-black text-sm sm:text-lg'>
          Record answers, watch live transcription, get AI feedback and keep
          your last 3 attempts.
        </p>
      </div>
      {/* Recording Card */}
      <div className='dark: bg-gradient-to-r from-primary via-purple-500 to-chart-1 rounded-2xl p-10 shadow-lg w-full max-w-2xl'>
        <div className='flex flex-col items-center space-y-6'>
          {recording && (
            <div className='flex items-center gap-2 text-red-400 font-mono'>
              <Clock size={18} /> <span>{seconds}s</span>
            </div>
          )}

          {!recording ? (
            <button
              onClick={startRecording}
              disabled={processing}
              className='flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-chart-1 hover:from-primary/90 hover:to-chart-1/90 cursor-pointer text-black dark:text-black font-semibold rounded-full shadow-md transform transition-transform'
            >
              <Mic size={18} /> Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className='flex items-center gap-2 px-6 py-3 bg-red-600 rounded-full shadow-md transform hover:scale-105 transition-transform cursor-pointer'
            >
              <Square size={18} /> Stop Recording
            </button>
          )}
        </div>
      </div>
      {processing && <AiLoading />}
      {/* Live Transcript Panel */}
      <div className='mt-6 w-full max-w-2xl dark:bg-gradient-to-r from-primary via-purple-500 to-chart-1 rounded-lg p-5 shadow'>
        <h3 className='font-semibold dark:text-black mb-2'>Live Transcript</h3>
        <p className='text-black font-semibold'>{liveInterim}</p>
        <p className='text-black font-semibold'>{liveFinal}</p>
      </div>
      {/* Audio Player (current) */}
      {audioUrl && (
        <motion.div className='mt-6 bg-gray-900/80 rounded-lg p-4 shadow w-full max-w-2xl'>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex-1'>
              <h4 className='text-sm text-gray-300 mb-2'>Your Recording</h4>
              <audio
                controls
                src={audioUrl}
                onClick={(e) => e.currentTarget.play()}
                className='w-full'
              />
            </div>
          </div>
        </motion.div>
      )}
      {/* AI Feedback */}
      {result && result.success && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className='mt-8 bg-gray-900/80 p-8 rounded-xl shadow-lg w-full max-w-2xl'
        >
          <h2 className='text-xl font-bold mb-4'>AI Feedback</h2>

          {/* transcript + audio already shown above; show concise feedback */}
          <div className='text-gray-300 space-y-3 text-sm'>
            <p>
              <b>Score:</b> {result.feedback.score}
            </p>
            <p>
              <b>Communication:</b> {result.feedback.communication}
            </p>
            <p>
              <b>Clarity:</b> {result.feedback.clarity}
            </p>
            <p>
              <b>Confidence:</b> {result.feedback.confidence}
            </p>
            <p>
              <b>Technical Depth:</b> {result.feedback.technicalDepth}
            </p>
            <p>
              <b>Filler Words:</b> {result.feedback.fillerWords}
            </p>
            <p>
              <b>Strengths:</b> {result.feedback.strengths?.join(', ')}
            </p>
            <p>
              <b>Weaknesses:</b> {result.feedback.weaknesses?.join(', ')}
            </p>
            <p>
              <b>Suggestions:</b> {result.feedback.suggestions?.join(', ')}
            </p>
            <p>
              <b>Final Advice:</b> {result.feedback.finalAdvice}
            </p>
            <div className='mt-2'>
              <p className='font-bold text-red-500'>Corrected Transcript:</p>
              <p className='pt-1 font-bold text-gray-200 dark:text-green-500'>
                {result.feedback.correctedTranscript}
              </p>
            </div>
          </div>
        </motion.div>
      )}
      {/* History Accordion (latest 5 only) */}
      {history.length > 0 && (
        <div className='mt-12 w-full max-w-2xl px-2'>
          <h2 className='text-xl font-bold mb-4 text-black dark:text-gray-200'>
            📜 Past Attempts
          </h2>

          <div className='space-y-3'>
            <AnimatePresence>
              {history.map((h, idx) => (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.22 }}
                  className='bg-gradient-to-r from-primary via-purple-500 to-chart-1 rounded-lg shadow overflow-hidden'
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    className='flex justify-between w-full px-4 py-3 text-left text-black font-semibold'
                  >
                    <div>
                      <div className='text-lg'>
                        Attempt {history.length - idx}
                      </div>
                      <div className='text-xs text-gray-400 font-semibold'>
                        Score {h.feedback?.score ?? '-'}
                      </div>
                    </div>
                    <ChevronDown
                      className={`transform transition-transform ${
                        openIndex === idx ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openIndex === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28 }}
                        className='px-4 pb-4 text-sm text-gray-300 space-y-2 overflow-hidden'
                      >
                        <p className='text-black font-semibold'>
                          <b>Transcript:</b> {h.transcript}
                        </p>

                        <div className='flex items-center gap-6'>
                          {h.audioUrl ? (
                            <>
                              <audio
                                controls
                                src={h.audioUrl}
                                onClick={(e) => e.currentTarget.play()}
                                className='w-full mt-2'
                              />
                              <button
                                onClick={() =>
                                  downloadBlob(
                                    h.audioBlob,
                                    `attempt-${h.id}.webm`
                                  )
                                }
                                className='p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition'
                              >
                                <Download size={20} />
                              </button>
                            </>
                          ) : (
                            <p className='text-xs text-gray-500'>
                              No audio saved.
                            </p>
                          )}
                        </div>

                        <p className='text-black font-semibold'>
                          <b>Strengths:</b> {h.feedback.strengths?.join(', ')}
                        </p>
                        <p className='text-black font-semibold'>
                          <b>Weaknesses:</b> {h.feedback.weaknesses?.join(', ')}
                        </p>
                        <p className='text-black font-semibold'>
                          <b>Suggestions:</b>{' '}
                          {h.feedback.suggestions?.join(', ')}
                        </p>
                        <div className='mt-2'>
                          <p className='font-bold text-red-500'>
                            Corrected Transcript:
                          </p>
                          <p className='pt-1 font-bold text-gray-200 dark:text-black'>
                            {h.feedback.correctedTranscript}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
}
