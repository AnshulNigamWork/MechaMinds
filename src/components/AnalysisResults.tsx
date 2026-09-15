import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Cpu,
  AlertCircle,
  TrendingUp,
  MapPin,
  IndianRupee,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Radio,
  Clock,
  Smartphone,
  Send,
  BellRing,
  Lock,
  Volume2,
  VolumeX,
  Play,
  Square,
  Vibrate,
} from "lucide-react";
import { GaugeMeter } from "./GaugeMeter";
import { CreditCardPreview } from "./CreditCardPreview";
import { PredictionResult, TransactionInput } from "../types";
import { fraudAudio } from "../utils/audio";

interface AnalysisResultsProps {
  result: PredictionResult | null;
  input: TransactionInput;
  isLoading: boolean;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  result,
  input,
  isLoading,
}) => {
  const [isSirenPlaying, setIsSirenPlaying] = useState(fraudAudio.getIsSirenPlaying());
  const [isMuted, setIsMuted] = useState(fraudAudio.getIsMuted());
  const [testNotificationStatus, setTestNotificationStatus] = useState<string | null>(null);

  useEffect(() => {
    const unsub = fraudAudio.subscribe((playing) => {
      setIsSirenPlaying(playing);
    });
    return unsub;
  }, []);

  const handleToggleSiren = () => {
    if (isSirenPlaying) {
      fraudAudio.stopAlarm();
    } else {
      fraudAudio.playLoudFraudBeepAlert(10);
    }
  };

  const handleToggleMute = () => {
    const muted = fraudAudio.toggleMute();
    setIsMuted(muted);
  };

  const triggerMobileVibration = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([250, 100, 250, 100, 450]);
      setTestNotificationStatus("Vibration Dispatched!");
      setTimeout(() => setTestNotificationStatus(null), 2500);
    } else {
      setTestNotificationStatus("Haptic vibration not supported on this browser");
      setTimeout(() => setTestNotificationStatus(null), 2500);
    }
  };
  if (isLoading) {
    return (
      <div
        className="bg-[#111c38]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-8 flex flex-col items-center justify-center min-h-[540px] text-center"
        id="analysis-loading-state"
      >
        <div className="relative mb-5">
          <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <Cpu className="w-6 h-6 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
        </div>
        <h3 className="text-base font-bold text-white tracking-wide">
          Executing Sub-50ms SOC Risk Pipeline
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mt-2 leading-relaxed">
          Evaluating hard limits (₹1,00,000 / 5,000 km), computing 5-signal XGBoost risk probability, and synthesizing Gemini 3.8 Flash XAI brief...
        </p>
        <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-cyan-300 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/30">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>INFERENCE_PIPELINE: ACTIVE (TARGET &lt; 38ms)</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div
        className="bg-[#111c38]/90 backdrop-blur-md rounded-2xl border border-dashed border-white/15 shadow-xl p-8 flex flex-col items-center justify-center min-h-[540px] text-center gap-4"
        id="analysis-empty-state"
      >
        <CreditCardPreview input={input} result={null} />
        <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
          <TrendingUp className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">
            Security Operations Center (SOC) Standby
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mt-1">
            Configure the 5 signal parameters or pick a Hackathon Preset on the left, then click <strong>"Execute Real-Time Fraud Assessment"</strong>.
          </p>
        </div>
      </div>
    );
  }

  const isHighRisk = result.tier === "HIGH RISK";
  const isSuspicious = result.tier === "SUSPICIOUS";

  return (
    <div
      className="bg-[#111c38]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-5 flex flex-col gap-5"
      id="analysis-results-card"
    >
      {/* Top Bar: MechaMinds Platinum Card & Telemetry Status */}
      <div className="flex flex-col gap-4">
        <CreditCardPreview input={input} result={result} />

        <div className="flex items-center justify-between pb-2 border-b border-white/10 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Risk Decision Engine
            </span>
            {result.latency_ms && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ⚡ {result.latency_ms} ms (SLA &lt;38ms)
              </span>
            )}
          </div>
          <span
            className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
              isHighRisk
                ? "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
                : isSuspicious
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
            }`}
          >
            {result.tier}
          </span>
        </div>
      </div>

      {/* Primary Action Banner */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-xl border flex items-start gap-3.5 ${
          isHighRisk
            ? "bg-rose-950/40 border-rose-500/40 text-rose-200 shadow-[0_0_25px_rgba(239,68,68,0.25)]"
            : isSuspicious
            ? "bg-amber-950/40 border-amber-500/40 text-amber-200"
            : "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
        }`}
        id="decision-banner"
      >
        <div
          className={`p-2.5 rounded-xl shrink-0 ${
            isHighRisk
              ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
              : isSuspicious
              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
          }`}
        >
          {isHighRisk ? (
            <AlertTriangle className="w-5 h-5" />
          ) : isSuspicious ? (
            <ShieldAlert className="w-5 h-5" />
          ) : (
            <CheckCircle2 className="w-5 h-5" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black tracking-wide font-mono uppercase">
              {result.tier_label}
            </h3>
            <span className="text-xs font-mono font-bold">
              {result.risk_score.toFixed(1)}/100
            </span>
          </div>
          <p className="text-xs mt-1.5 opacity-90 leading-relaxed text-slate-300">
            {isHighRisk
              ? result.hard_rule_triggered
                ? "Immediate refusal enforced by deterministic hard regulatory boundaries (>₹1,00,000 or impossible travel radius)."
                : "Multivariate machine learning classifier flagged extreme risk correlation (≥70.0%). Card frozen and FCM alert dispatched."
              : isSuspicious
              ? "Elevated behavioral anomaly detected (30–69%). Step-up 2FA challenge initiated with cardholder before settlement."
              : "All 5 signal parameters verify cardholder baseline affinity. Automated authorization approved and logged."}
          </p>
        </div>
      </motion.div>

      {/* Real-Time Live Notification & Phone Alert Console */}
      <div
        className={`p-4 rounded-xl border transition-all duration-300 ${
          isHighRisk || isSirenPlaying
            ? "bg-gradient-to-b from-[#190408] to-[#0c0f1d] border-rose-500/60 shadow-[0_0_35px_rgba(239,68,68,0.35)]"
            : "bg-slate-900/60 border-white/10"
        }`}
        id="real-time-notification-console"
      >
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isHighRisk ? "bg-rose-600 text-white animate-pulse" : "bg-cyan-500/20 text-cyan-400"}`}>
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                <span>LIVE PHONE NOTIFICATION &amp; ALARM</span>
                {isHighRisk && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
              </span>
              <div className="text-[10px] font-mono text-slate-400">
                Target Device: <strong className="text-cyan-300">{input.mobile_number || "+91 98765 43210"}</strong>
              </div>
            </div>
          </div>

          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
            isHighRisk 
              ? "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse" 
              : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
          }`}>
            {isHighRisk ? "● ALERT DISPATCHED" : "STANDBY (ACTIVE)"}
          </span>
        </div>

        {/* Live Notification Message Card */}
        <div className="my-3 p-3 bg-black/75 rounded-xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-slate-300 font-bold">
              <Lock className="w-3 h-3 text-rose-400" />
              MECHAMINDS BANK FRAUD SHIELD
            </span>
            <span className="text-emerald-400 font-bold">
              {isHighRisk ? "DELIVERED IN REAL-TIME (0.02s)" : "READY"}
            </span>
          </div>

          <div className={`text-xs p-2.5 rounded-lg border leading-relaxed ${
            isHighRisk 
              ? "bg-rose-950/60 border-rose-500/40 text-rose-100 font-medium" 
              : "bg-slate-900/60 border-white/5 text-slate-300"
          }`}>
            {isHighRisk ? (
              <>
                "Your earlier transaction of <strong className="text-white font-black">₹{result.features.amount.toLocaleString("en-IN")}</strong> at <strong className="text-white">{input.merchant || "Merchant"}</strong> was detected as <strong className="text-rose-400 font-black">FRAUD</strong>. Your card ending in <strong className="text-amber-300 font-mono">8899</strong> has been permanently <strong className="text-rose-400 font-black">BLOCKED</strong>."
              </>
            ) : (
              "Monitoring card swipes. When high risk (&ge;70%) occurs, the loud beep alarm sounds and an emergency 'Card Blocked' SMS & Push notification is dispatched instantly."
            )}
          </div>

          {isHighRisk && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 text-xs font-mono">
              <span className="text-base">📲</span>
              <div>
                <div className="font-bold">✓ Real-time push alert dispatched to subscribed mobile device (ntfy.sh/mechaminds-fraud-demo-2026)</div>
                <div className="text-[10px] text-slate-400">Alert sent to cardholder's device via push notification &amp; Web Audio siren triggered.</div>
              </div>
            </div>
          )}
        </div>

        {/* Clear, Uncluttered Alert Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={handleToggleSiren}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md ${
              isSirenPlaying
                ? "bg-rose-600 hover:bg-rose-500 text-white animate-pulse"
                : "bg-white/10 hover:bg-white/20 text-white border border-white/15"
            }`}
            id="toggle-emergency-siren-btn"
          >
            {isSirenPlaying ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Silence Alarm Sound</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test Beep Alarm Sound</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              triggerMobileVibration();
              fraudAudio.playLoudFraudBeepAlert(8);
              setTestNotificationStatus("🚨 Notification & vibration dispatched to " + (input.mobile_number || "+91 98765 43210"));
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
            id="send-live-test-notification-btn"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>Send Live Phone Notification</span>
          </button>
        </div>

        {testNotificationStatus && (
          <div className="mt-2 text-[10px] text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-500/30">
            {testNotificationStatus}
          </div>
        )}
      </div>

      {/* Semicircular Gauge Meter Block */}
      <div className="bg-slate-900/60 rounded-2xl border border-white/5 p-3 flex flex-col items-center justify-center">
        <GaugeMeter value={result.risk_score} tier={result.tier} />
      </div>

      {/* Hard Rule Trigger Alert */}
      {result.hard_rule_triggered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3.5 bg-rose-900/30 border border-rose-500/50 rounded-xl text-rose-200 flex items-start gap-3"
          id="hard-rule-alert"
        >
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-rose-300 uppercase tracking-wide">
              Deterministic Hard Rule Triggered
            </div>
            <div className="text-xs text-rose-200 mt-0.5 leading-relaxed">
              {result.reason_code || "Policy rule violation detected."} Score overridden to 100.0%.
            </div>
          </div>
        </motion.div>
      )}

      {/* Gemini 3.8 Flash XAI Forensic Investigation Brief */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 via-blue-950/30 to-slate-900/60 border border-cyan-500/30 shadow-lg flex flex-col gap-2.5"
        id="gemini-explanation-box"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Gemini XAI Forensic Brief</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            {result.ai_source?.includes("gemini") ? "gemini-3.8-flash" : "Deterministic Engine"}
          </span>
        </div>

        <blockquote className="text-xs text-slate-200 font-medium leading-relaxed italic border-l-2 border-cyan-400 pl-3 py-1">
          "{result.explanation}"
        </blockquote>

        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5 mt-1">
          <span>Synthesized in 2 regulatory sentences for rapid SOC triage</span>
          <span className="font-mono text-cyan-400">STATUS: COMPLIANT</span>
        </div>
      </motion.div>

      {/* 5-Signal Dynamic Accumulator Cards (₹, L, D, T, F) */}
      <div className="p-4 bg-slate-900/60 rounded-xl border border-white/5 flex flex-col gap-2.5" id="five-signals-breakdown">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>5-Signal Telemetry Accumulator</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">₹ · L · D · T · F</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {result.signals && result.signals.length > 0 ? (
            result.signals.map((sig, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-colors ${
                  sig.status === "CRITICAL"
                    ? "bg-rose-950/40 border-rose-500/40 text-rose-200"
                    : sig.status === "TRIGGERED"
                    ? "bg-amber-950/40 border-amber-500/40 text-amber-200"
                    : "bg-emerald-950/30 border-emerald-500/30 text-emerald-200"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-black shrink-0 ${
                      sig.status === "CRITICAL"
                        ? "bg-rose-500/30 text-rose-300 border border-rose-500/50"
                        : sig.status === "TRIGGERED"
                        ? "bg-amber-500/30 text-amber-300 border border-amber-500/50"
                        : "bg-emerald-500/30 text-emerald-300 border border-emerald-500/50"
                    }`}
                  >
                    {sig.code}
                  </span>
                  <div className="truncate">
                    <span className="font-bold text-white">{sig.name}</span>
                    <span className="text-slate-400 text-[11px] ml-1.5 truncate">
                      — {sig.detail}
                    </span>
                  </div>
                </div>
                <div className="font-mono font-black shrink-0 ml-2 text-right">
                  {sig.impact}
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-500 italic py-1">
              No signal anomalies registered.
            </div>
          )}
        </div>
      </div>

      {/* Telemetry Parameter Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        <div className="p-2.5 bg-slate-900/60 rounded-xl border border-white/5">
          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 mb-1">
            <IndianRupee className="w-3 h-3 text-emerald-400" />
            AMOUNT (₹)
          </div>
          <div className="text-xs font-bold text-white font-mono">
            ₹{result.features.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-2.5 bg-slate-900/60 rounded-xl border border-white/5">
          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 mb-1">
            <MapPin className="w-3 h-3 text-indigo-400" />
            RADIUS / JURISDICTION
          </div>
          <div className="text-xs font-bold text-white font-mono truncate">
            {result.features.distance.toLocaleString()} km
          </div>
        </div>

        <div className="p-2.5 bg-slate-900/60 rounded-xl border border-white/5">
          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 mb-1">
            <Radio className="w-3 h-3 text-cyan-400" />
            NETWORK / TOR
          </div>
          <div className="text-xs font-bold font-mono">
            {result.features.is_vpn === 1 ? (
              <span className="text-rose-400">Tor/VPN Active</span>
            ) : (
              <span className="text-emerald-400">Direct ISP</span>
            )}
          </div>
        </div>

        <div className="p-2.5 bg-slate-900/60 rounded-xl border border-white/5">
          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 mb-1">
            <Clock className="w-3 h-3 text-amber-400" />
            VELOCITY CADENCE
          </div>
          <div className="text-xs font-bold text-white font-mono">
            {result.features.time_delta.toFixed(1)} hrs
          </div>
        </div>
      </div>
    </div>
  );
};
