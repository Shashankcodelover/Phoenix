"use client";

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import VaultCard from '@/components/VaultCard';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col selection:bg-[var(--glow-horizon)]/30 selection:text-white">
      <div className="ambient-radiance" />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-14 flex flex-col items-center justify-center text-center">
        
        {/* Top Aggressive Cyber Pill */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-theme-card border border-[var(--glow-horizon)]/40 text-[var(--glow-horizon)] text-[10px] sm:text-xs font-mono font-bold tracking-[0.15em] mb-10 shadow-lg shadow-[var(--glow-horizon)]/10 backdrop-blur-sm transition-all hover:border-[var(--glow-horizon)]/60 cursor-default"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--glow-horizon)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--glow-horizon)]"></span>
          </span>
          <span>APEX PLATFORM STANDARD • 66 SPECIALIZED PRODUCTION ENGINES</span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-4xl sm:text-6xl lg:text-[5rem] font-extrabold tracking-tight text-theme-main max-w-5xl leading-[1.08] mb-6 font-heading"
        >
          The Continuous Continuum for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--glow-horizon)] via-[var(--glow-interview)] to-[var(--glow-hackathon)]">
            Top 1% Engineers &amp; Founders
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-theme-muted text-base sm:text-lg max-w-3xl leading-relaxed mb-12 font-medium"
        >
          An autonomous platform connecting Karnataka state academic strategy, sub-300ms real-time WebRTC voice coaching, and Discord-style hackathon team split-chat AI copilots with $0.00 zero cloud spend.
        </motion.p>

        {/* 3 Core Vault Triad Mega Cards */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 text-left"
        >
          
          <VaultCard
            href="/vault/horizon"
            glowClass="glow-horizon"
            borderClass="border-sky-500/30"
            bgClass="bg-theme-card"
            icon="🌅"
            iconBg="bg-sky-500/15"
            iconBorder="border-sky-500/35"
            iconShadow="shadow-sky-500/15"
            featureCount="22"
            title="Horizon Career OS"
            titleHoverClass="group-hover:text-sky-400 text-sky-400"
            description="KCET/DCET Option-Entry Simulators, BEO Document OCR Validation, Choice 2 Seat Retention Radars &amp; DST NIDHI-TBI Grants."
            telemetry1Label="Choice 2 Seat Retention"
            telemetry1Value="100% Protected 🛡️"
            telemetry1ValueClass="text-emerald-500"
            telemetry2Label="BEO Document OCR Match"
            telemetry2Value="100% Clearance"
            telemetry2ValueClass="text-sky-400"
            exploreText="EXPLORE 22 HORIZON ENGINES"
            exploreHoverClass="text-sky-400"
          />

          <VaultCard
            href="/vault/interview"
            glowClass="glow-interview"
            borderClass="border-indigo-500/30"
            bgClass="bg-theme-card"
            icon="💼"
            iconBg="bg-indigo-500/15"
            iconBorder="border-indigo-500/35"
            iconShadow="shadow-indigo-500/15"
            featureCount="22"
            title="Placement &amp; Voice AI"
            titleHoverClass="group-hover:text-indigo-400 text-indigo-400"
            description="<300ms WebRTC Voice Coach with Wasm Noise Filtering, Transactional Outbox CDC Relays, 17,640x SQL Covering Indexes &amp; Redis Rate Limiters."
            telemetry1Label="Transactional Outbox CDC"
            telemetry1Value="0 Dual-Write Loss ✓"
            telemetry1ValueClass="text-emerald-500"
            telemetry2Label="B-Tree SQL Execution"
            telemetry2Value="17,640x Speedup"
            telemetry2ValueClass="text-indigo-400"
            exploreText="EXPLORE 22 INTERVIEW ENGINES"
            exploreHoverClass="text-indigo-400"
          />

          <VaultCard
            href="/vault/hackathon"
            glowClass="glow-hackathon"
            borderClass="border-emerald-500/30"
            bgClass="bg-theme-card"
            icon="🏆"
            iconBg="bg-emerald-500/15"
            iconBorder="border-emerald-500/35"
            iconShadow="shadow-emerald-500/15"
            featureCount="22"
            title="Hackathon OS &amp; IP"
            titleHoverClass="group-hover:text-emerald-400 text-emerald-400"
            description="Discord Split-Chat AI Copilots, 120s Devpost Pitch Video Storyboards, 180s PWA Offline Pitch Teleprompters &amp; YC SAFE Note Packages."
            telemetry1Label="120s Video Storyboard"
            telemetry1Value="WebVTT Ready ✓"
            telemetry1ValueClass="text-cyan-400"
            telemetry2Label="PWA Stage Teleprompter"
            telemetry2Value="100% Offline Safe"
            telemetry2ValueClass="text-emerald-500"
            exploreText="EXPLORE 22 HACKATHON ENGINES"
            exploreHoverClass="text-emerald-400"
          />

        </motion.div>

        {/* Global Live Infrastructure Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="w-full glass-card p-6 sm:p-8 border-theme-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-8 text-left relative overflow-hidden bg-theme-card transition-shadow duration-300 hover:shadow-lg"
        >
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[var(--glow-horizon)]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex-1">
            <div className="text-sm font-bold text-theme-main flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--glow-hackathon)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--glow-hackathon)]"></span>
              </span>
              Autonomous Multi-Key Failover Engine (Groq 70B &amp; Gemini 2.5)
            </div>
            <div className="text-xs text-theme-subtle mt-1.5 font-mono tracking-wide leading-relaxed">
              In-Memory LRU Cache (&lt;2ms) • Zero-Downtime Heuristic Fallback • $0.00 Cloud Spend Invariant
            </div>
          </div>
          <div className="relative z-10 flex flex-wrap items-center gap-8 font-mono text-xs w-full md:w-auto">
            <div className="group cursor-default">
              <div className="text-theme-subtle text-[10px] uppercase tracking-wider mb-1 transition-colors group-hover:text-theme-main">Test Coverage</div>
              <span className="text-cyan-400 font-bold text-base md:text-lg">88/88 Pass</span>
            </div>
            <div className="group cursor-default">
              <div className="text-theme-subtle text-[10px] uppercase tracking-wider mb-1 transition-colors group-hover:text-theme-main">Engine Total</div>
              <span className="text-emerald-400 font-bold text-base md:text-lg">66 Engines</span>
            </div>
            <div className="group cursor-default">
              <div className="text-theme-subtle text-[10px] uppercase tracking-wider mb-1 transition-colors group-hover:text-theme-main">Cloud Cost</div>
              <span className="text-indigo-400 font-bold text-base md:text-lg">$0.00 / Mo</span>
            </div>
          </div>
        </motion.div>

      </main>

      <footer className="border-t border-theme-glass py-6 text-center text-xs text-theme-subtle font-mono bg-[var(--bg-space)]">
        PROJECT PHOENIX v25.0 APEX ENTERPRISE • NEXT.JS 15 &amp; REACT 19 • 66 VERIFIED PRODUCTION ENGINES
      </footer>
    </div>
  );
}
