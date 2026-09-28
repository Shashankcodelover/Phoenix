"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

export default function HomePage() {
  const router = useRouter();

  const handleDemo = () => {
    // Bypass auth, go to main application dashboard
    router.push('/vault/horizon');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center w-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block bg-sky-100 text-sky-700 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-8 border border-sky-200"
        >
          APEX PLATFORM STANDARD
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl leading-tight mb-8"
        >
          The Continuous Continuum for <span className="text-sky-600">Top Engineers</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-slate-600 max-w-2xl leading-relaxed mb-12"
        >
          An autonomous platform connecting academic strategy, real-time voice coaching, and team hackathon copilots in a single unified dashboard.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
        >
          <button 
            className="px-8 py-4 w-full sm:w-auto bg-slate-900 text-white rounded-lg font-bold shadow hover:bg-slate-800 transition"
          >
            Sign Up / Login
          </button>
          
          <button 
            onClick={handleDemo}
            className="px-8 py-4 w-full sm:w-auto bg-white text-slate-900 border border-slate-300 rounded-lg font-bold shadow-sm hover:bg-slate-50 transition flex items-center justify-center gap-2"
          >
            ▶ Try Demo Mode
          </button>
        </motion.div>

      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500 bg-white">
        &copy; {new Date().getFullYear()} Project Phoenix. All rights reserved.
      </footer>
    </div>
  );
}
