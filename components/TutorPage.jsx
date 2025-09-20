// app/tutor/page.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Clock, ChevronDown, Download } from 'lucide-react';
import { getDB } from '../lib/db';
import { AiLoading } from '@/components/ai-loading-animation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function TutorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [liveInterim, setLiveInterim] = useState('');
  const [liveFinal, setLiveFinal] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  const recognitionRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push('/');
    }
  }, [session, status, router]);

  // ⬇️ Load history from IndexedDB

  // Load all history from IndexedDB
  // Load tutor history
  const loadHistory = async () => {
    try {
      const db = await getDB();

      if (!db.objectStoreNames.contains('historyTutor')) {
        setHistory([]);
        return;
      }

      const tx = db.transaction('historyTutor', 'readonly');
      const store = tx.objectStore('historyTutor');

      const allEntries = await store.getAll();

      allEntries.forEach((entry) => {
        if (entry.audioBlob)
          entry.audioUrl = URL.createObjectURL(entry.audioBlob);
      });

      // newest first, latest 3 only
      const sorted = allEntries.sort((a, b) => b.id - a.id).slice(0, 3);

      setHistory(sorted);
      await tx.done;
    } catch (err) {
      console.error('loadHistory error:', err);
      setHistory([]);
    }
  };

  // Push tutor history
  const pushHistory = async (entry) => {
    try {
      const db = await getDB();

      if (!db.objectStoreNames.contains('historyTutor')) return;

      const tx = db.transaction('historyTutor', 'readwrite');
      const store = tx.objectStore('historyTutor');

      await store.put(entry);

      const allEntries = await store.getAll();
      allEntries.forEach((e) => {
        if (e.audioBlob) e.audioUrl = URL.createObjectURL(e.audioBlob);
      });

      const sorted = allEntries.sort((a, b) => b.id - a.id);
      const latest = sorted.slice(0, 3); // latest 3
      setHistory(latest);

      // delete older entries
      for (let i = 3; i < sorted.length; i++) {
        await store.delete(sorted[i].id);
      }

      await tx.done;
    } catch (err) {
      console.error('pushHistory error:', err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // 🎤 Live Speech Recognition
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
      if (final.trim())
        setLiveFinal((p) => (p ? p + ' ' + final.trim() : final.trim()));
    };

    recognition.onerror = () => {}; // ignore
    recognition.onend = () => {}; // don’t auto-restart

    recognition.start();
    recognitionRef.current = recognition;
    return recognition;
  };

  // 🎙️ Start Recording
 const startRecording = async () => {
  setResult(null);
  setAudioUrl(null);
  setLiveInterim('');
  setLiveFinal('');
  setSeconds(0);
  chunksRef.current = []; // clear previous chunks

  try {
    startLiveRecognition();

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream; // save stream separately

    // Use MIME type compatible with iPhone Safari
    const options = { mimeType: 'audio/mp4' };
    const recorder = new MediaRecorder(stream, options);
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      clearInterval(timerRef.current);

      // Blob for both iPhone and Android
      const blob = new Blob(chunksRef.current, { type: 'audio/mp4' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      try {
        setProcessing(true);
        const fd = new FormData();
        fd.append('audio', blob, 'answer.mp4'); // match blob type

        const res = await fetch('/api/tutor', { method: 'POST', body: fd });
        const data = await res.json();

        if (!res.ok || !data.success) {
          setResult({ success: false, error: data?.error || 'Analysis failed' });
        } else {
          setResult(data);

          pushHistory({
            id: Date.now(),
            transcript: data.transcript,
            feedback: data.feedback,
            audioBlob: blob,
            createdAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error('Upload error', err);
        setResult({ success: false, error: 'Upload failed' });
      } finally {
        setProcessing(false);
      }
    };

    recorder.start();
    setRecording(true);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  } catch (err) {
    console.error('startRecording error:', err);
    alert('Microphone access denied or not available.');
  }
};

// ⏹️ Stop Recording
const stopRecording = () => {
  try {
    recognitionRef.current?.stop();
  } catch {}

  if (recorderRef.current && recorderRef.current.state !== 'inactive') {
    recorderRef.current.stop();
  }

  if (streamRef.current) {
    streamRef.current.getTracks().forEach((t) => t.stop());
    streamRef.current = null; // cleanup
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
      className={`dark:bg-gradient-to-b from-gray-900 via-gray-800 to-black 
              bg-white text-white px-4 flex flex-col items-center justify-center 
              min-h-screen
              ${history.length > 0 ? 'pt-12 pb-7' : 'pt-0 pb-0'}`}
    >
      <motion.div className='text-center max-w-2xl mb-10'>
        <h1 className='text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-purple-500 to-chart-1 bg-clip-text text-transparent'>
          🗣️ AI Tutor & Speak & Improve
        </h1>
        <p className='text-gray-400 max-sm:text-sm pt-2'>
          Speak naturally the app shows live transcript, highlights mistakes,
          gives pronunciation tips and a corrected version.
        </p>
      </motion.div>
      {/* Card */}
      <motion.div
        className='dark:bg-gradient-to-r from-primary to-chart-1
         rounded-2xl p-8 shadow-lg w-full max-w-2xl'
      >
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
              className='flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary via-purple-500 to-chart-1 hover:from-primary/90 hover:to-chart-1/90 cursor-pointer dark:text-black text-white  font-semibold rounded-full shadow-md hover:scale-105 transition-transform duration-500 ease-in'
            >
              <Mic size={18} /> Start Practice
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className='flex items-center gap-2 px-10 py-2 bg-red-600 rounded-full shadow-md hover:scale-105 transition-transform'
            >
              <Square size={18} /> Stop
            </button>
          )}
        </div>
      </motion.div>
      {processing && <AiLoading />}
      {/* Live Transcript Panel */}
      <div className='mt-6 w-full max-w-2xl bg-gradient-to-r from-primary to-chart-1 dark:bg-gray-800/50 rounded-lg p-4 shadow'>
        <h3 className='font-semibold dark:text-red-600 text-xl mb-2'>
          Live Transcript
        </h3>
        <p className='text-black font-semibold italic mb-2'>{liveInterim}</p>
        <p className='dark:text-black font-semibold'>{liveFinal}</p>
      </div>
      {/* Audio player + download (shows as soon as recording stops) */}
      {audioUrl && (
        <motion.div
          className='mt-6 bg-gradient-to-r from-primary to-chart-1 dark:bg-gray-800/50 rounded-lg p-4 shadow w-full max-w-2xl'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className='flex items-center justify-between'>
            <div className='w-full'>
              <h4 className='text-sm dark:text-black mb-2'>Your Recording</h4>
              <audio
                controls
                src={audioUrl}
                onClick={(e) => e.currentTarget.play()}
                className='w-[100%] '
              />
            </div>
          </div>
        </motion.div>
      )}
      {/* Analysis / Corrections */}
      {result && result.success && result.feedback && (
        <motion.div className='mt-6 bg-gray-900/80 p-6 rounded-xl shadow-lg w-full max-w-2xl'>
          <h3 className='text-lg font-bold mb-3'>AI Feedback</h3>

          <div className='text-gray-300 mb-4'>
            <p>
              <strong>Fluency Score:</strong>{' '}
              {result.feedback.fluencyScore ?? 0}/100
            </p>
            <p className='mt-2'>
              <strong>Summary:</strong> {result.feedback.summary}
            </p>
          </div>

          {/* Corrections list */}
          <div className='mb-4'>
            <h4 className='font-semibold text-green-500 mb-2'>Corrections</h4>
            {result.feedback.corrections &&
            result.feedback.corrections.length ? (
              <ul className='list-disc ml-6 text-sm text-gray-300 space-y-2'>
                {result.feedback.corrections.map((c, i) => (
                  <li key={i}>
                    <strong>{c.original}</strong> →{' '}
                    <em className='text-red-400 font-semibold'>
                      {c.corrected}
                    </em>
                    {c.explanation ? (
                      <div className='text-xs text-gray-400 mt-1'>
                        {c.explanation}
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-sm text-gray-400'>No corrections detected.</p>
            )}
          </div>

          {/* Pronunciation tips */}
          <div className='mb-4'>
            <h4 className='font-semibold text-gray-200 mb-2'>Pronunciation</h4>
            {result.feedback.pronunciation &&
            result.feedback.pronunciation.length ? (
              <ul className='list-disc ml-6 text-sm text-gray-300'>
                {result.feedback.pronunciation.map((p, i) => (
                  <li key={i}>
                    <strong>{p.word}:</strong> {p.advice}
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-sm text-gray-400'>
                No pronunciation issues detected.
              </p>
            )}
          </div>

          {/* Corrected full text */}
          <div>
            <h4 className='font-semibold text-gray-200 mb-2'>Corrected Text</h4>
            <div className='bg-gray-800/60 p-3 rounded text-sm text-gray-100'>
              {result.feedback.corrected_text}
            </div>
          </div>
        </motion.div>
      )}
      {/* History accordion */}
      {history.length > 0 && (
        <div className='mt-10 w-full max-w-2xl'>
          <h3 className='text-xl font-bold mb-4 darktext-gray-200 bg-gradient-to-r from-primary via-purple-500 to-chart-1 bg-clip-text text-transparent'>
            Past Attempts
          </h3>
          {history.map((h, idx) => (
            <div
              key={h.id}
              className=' bg-gradient-to-r from-primary to-chart-1 rounded-lg mb-3 shadow '
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className='flex justify-between w-full px-4 py-3 text-left font-semibold dark:text-black text-white'
              >
                <div>
                  <div className='text-sm'>Attempt {history.length - idx}</div>
                  <div className='font-semibold dark:text-black text-white text-xs'>
                    Score {h.feedback?.fluencyScore ?? '-'}
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
                    <p className='font-semibold dark:text-black text-white'>
                      <strong>Transcript:</strong> {h.transcript}
                    </p>
                    <div className='flex items-center gap-3'>
                      {h.audioBlob ? (
                        <>
                          <audio
                            controls
                            src={h.audioUrl}
                            className='w-full mt-2'
                            onClick={(e) => e.currentTarget.play()}
                          />
                          <button
                            onClick={() =>
                              downloadBlob(h.audioBlob, `attempt-${h.id}.webm`)
                            }
                            className='p-2 bg-gray-700 rounded-full hover:bg-gray-600'
                          >
                            <Download size={16} />
                          </button>
                        </>
                      ) : (
                        <p className='text-xs text-gray-500'>No audio saved.</p>
                      )}
                    </div>
                    <p className='font-semibold dark:text-black text-white'>
                      <strong>Summary:</strong> {h.feedback?.summary}
                    </p>
                    <p>
                      <strong className='text-green-500 '>Corrections: </strong>
                      {h.feedback?.corrections?.map((c, i) => (
                        <span key={i} className='dark:text-black font-semibold'>
                          {c.original} →{' '}
                          <span className='dark:text-red-600 font-semibold'>
                            {c.corrected}
                          </span>
                          {i < h.feedback.corrections.length - 1 && ', '}
                        </span>
                      ))}
                    </p>
                    <p className='dark:text-black font-semibold'>
                      <strong className='dark:text-red-600'>
                        Pronunciation Issues:{' '}
                      </strong>
                      {h.feedback?.pronunciation?.map((p, i) => (
                        <span key={i}>
                          {p.word}: {p.advice}
                          {i < h.feedback.pronunciation.length - 1 && ', '}
                        </span>
                      ))}
                    </p>
                    <p className='dark:text-black font-semibold'>
                      <strong className='dark:text-red-600 '>
                        Corrected Text:{' '}
                      </strong>
                      {h.feedback?.corrected_text}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
