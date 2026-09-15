import React from "react";
import { motion } from "motion/react";
import { RiskTier } from "../types";

interface GaugeMeterProps {
  value: number; // 0 to 100
  tier?: RiskTier;
  size?: number;
}

export const GaugeMeter: React.FC<GaugeMeterProps> = ({ value, tier, size = 280 }) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  // Semicircle gauge calculation
  const radius = 100;
  const strokeWidth = 20;
  const center = 140;

  // Arc length for semicircle: PI * radius = ~314.16
  const arcLength = Math.PI * radius;
  const strokeDashoffset = arcLength - (clampedValue / 100) * arcLength;

  // Exact presentation tiers
  // SAFE (0-29%): Emerald (#10B981)
  // SUSPICIOUS (30-69%): Amber (#F59E0B)
  // HIGH RISK (70-100%): Crimson (#EF4444)
  const currentTier: RiskTier =
    tier || (clampedValue >= 70 ? "HIGH RISK" : clampedValue >= 30 ? "SUSPICIOUS" : "SAFE");

  let tierColor = "#10b981";
  let tierGlow = "rgba(16, 185, 129, 0.4)";
  let tierBadgeBg = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
  let tierLabel = "SAFE · APPROVE + LOG";

  if (currentTier === "HIGH RISK") {
    tierColor = "#ef4444";
    tierGlow = "rgba(239, 68, 68, 0.4)";
    tierBadgeBg = "bg-rose-500/20 text-rose-300 border-rose-500/40";
    tierLabel = "HIGH RISK · CASE CREATED + FCM ALERT";
  } else if (currentTier === "SUSPICIOUS") {
    tierColor = "#f59e0b";
    tierGlow = "rgba(245, 158, 11, 0.4)";
    tierBadgeBg = "bg-amber-500/20 text-amber-300 border-amber-500/40";
    tierLabel = "SUSPICIOUS · STEP-UP OTP / ANALYST REVIEW";
  }

  return (
    <div className="flex flex-col items-center justify-center p-3" id="gauge-meter-container">
      <div className="relative" style={{ width: size, height: size * 0.62 }}>
        <svg
          viewBox="0 0 280 175"
          className="w-full h-full overflow-visible"
          id="gauge-meter-svg"
        >
          <defs>
            <linearGradient id="socGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="29%" stopColor="#22c55e" />
              <stop offset="30%" stopColor="#f59e0b" />
              <stop offset="69%" stopColor="#f97316" />
              <stop offset="70%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>

            <filter id="needleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={tierColor} floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Background muted track */}
          <path
            d="M 40 140 A 100 100 0 0 1 240 140"
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Threshold Zone Guides on Track */}
          {/* Zone 1: Safe 0 - 29% */}
          <path
            d="M 40 140 A 100 100 0 0 1 95 62"
            fill="none"
            stroke="#10b981"
            strokeWidth={strokeWidth}
            strokeOpacity="0.25"
            strokeLinecap="round"
          />
          {/* Zone 2: Suspicious 30 - 69% */}
          <path
            d="M 95 62 A 100 100 0 0 1 185 62"
            fill="none"
            stroke="#f59e0b"
            strokeWidth={strokeWidth}
            strokeOpacity="0.25"
          />
          {/* Zone 3: High Risk 70 - 100% */}
          <path
            d="M 185 62 A 100 100 0 0 1 240 140"
            fill="none"
            stroke="#ef4444"
            strokeWidth={strokeWidth}
            strokeOpacity="0.25"
            strokeLinecap="round"
          />

          {/* Active progress arc */}
          <path
            d="M 40 140 A 100 100 0 0 1 240 140"
            fill="none"
            stroke="url(#socGaugeGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />

          {/* 30% Threshold Marker Tick */}
          <line
            x1="93"
            y1="57"
            x2="88"
            y2="49"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* 70% Threshold Marker Tick */}
          <line
            x1="187"
            y1="57"
            x2="192"
            y2="49"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Tick Labels */}
          <text x="32" y="162" className="text-[10px] font-mono fill-slate-400 font-semibold">0%</text>
          <text x="75" y="44" className="text-[9px] font-mono fill-amber-400 font-semibold">30% OTP</text>
          <text x="175" y="44" className="text-[9px] font-mono fill-rose-400 font-bold">70% BLOCK</text>
          <text x="232" y="162" className="text-[10px] font-mono fill-slate-400 font-semibold">100%</text>
        </svg>

        {/* Central Display - Sits cleanly inside semicircle with ZERO overlap */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-3 pointer-events-none">
          <motion.div
            key={clampedValue}
            initial={{ scale: 0.9, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-black font-mono tracking-tight"
            style={{ color: tierColor, textShadow: `0 0 18px ${tierGlow}` }}
            id="gauge-score-value"
          >
            {clampedValue.toFixed(1)}%
          </motion.div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-0.5">
            FRAUD RISK PROBABILITY
          </span>
        </div>
      </div>

      {/* Presentation Tier Badge */}
      <div
        className={`mt-2 px-3 py-1 text-xs font-bold font-mono uppercase tracking-wider rounded-full border ${tierBadgeBg} shadow-sm transition-all duration-300`}
        id="gauge-category-pill"
      >
        {tierLabel}
      </div>
    </div>
  );
};
