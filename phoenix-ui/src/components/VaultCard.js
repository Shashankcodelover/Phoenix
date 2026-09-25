'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function VaultCard({
  href,
  glowClass,
  borderClass,
  bgClass,
  icon,
  iconBg,
  iconBorder,
  iconShadow,
  featureCount,
  title,
  titleHoverClass,
  description,
  telemetry1Label,
  telemetry1Value,
  telemetry1ValueClass,
  telemetry2Label,
  telemetry2Value,
  telemetry2ValueClass,
  exploreText,
  exploreHoverClass,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link
        href={href}
        className="group outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-space)] rounded-2xl block h-full transition-shadow duration-200"
      >
        <div
          className={`glass-card glass-card-hover ${glowClass} p-6 sm:p-8 h-full flex flex-col justify-between ${borderClass} bg-theme-card transition-all duration-300 relative z-10`}
        >
          <div className="flex-1">
            <div className="flex items-start justify-between mb-6">
              <motion.div
                whileHover={{ scale: 1.12, rotate: -4 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className={`w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-2xl ${iconBg} border ${iconBorder} flex items-center justify-center text-2xl shadow-lg ${iconShadow}`}
              >
                {icon}
              </motion.div>
              <span
                className={`text-[10px] sm:text-xs font-mono font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full ${iconBg} ${titleHoverClass} border ${iconBorder} shadow-sm backdrop-blur-md`}
              >
                {featureCount} Features
              </span>
            </div>

            <h3
              className={`text-xl sm:text-2xl font-bold text-theme-main mb-3 ${titleHoverClass} transition-colors font-heading leading-tight`}
            >
              {title}
            </h3>
            <p className="text-theme-muted text-sm leading-relaxed mb-8">
              {description}
            </p>

            <div className="space-y-3 mb-8">
              <div className={`flex items-center justify-between text-xs p-3 rounded-xl bg-[var(--bg-space-secondary)]/80 border ${borderClass} font-mono transition-colors group-hover:bg-[var(--bg-space-secondary)]/100`}>
                <span className="text-theme-subtle">{telemetry1Label}</span>
                <span className={`font-bold tracking-wide ${telemetry1ValueClass}`}>
                  {telemetry1Value}
                </span>
              </div>
              <div className={`flex items-center justify-between text-xs p-3 rounded-xl bg-[var(--bg-space-secondary)]/80 border ${borderClass} font-mono transition-colors group-hover:bg-[var(--bg-space-secondary)]/100`}>
                <span className="text-theme-subtle">{telemetry2Label}</span>
                <span className={`font-bold tracking-wide ${telemetry2ValueClass}`}>
                  {telemetry2Value}
                </span>
              </div>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 ${exploreHoverClass} text-sm font-bold group-hover:translate-x-1.5 transition-transform duration-300 font-mono pt-5 border-t border-theme-glass`}
          >
            {exploreText} <span className="text-[10px] mt-0.5">➔</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
