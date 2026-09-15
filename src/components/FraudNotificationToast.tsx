import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  BellRing,
  Volume2,
  VolumeX,
  X,
  Smartphone,
  CheckCircle2,
  Lock,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PredictionResult, TransactionInput } from "../types";
import { fraudAudio } from "../utils/audio";

interface FraudNotificationToastProps {
  result: PredictionResult | null;
  input: TransactionInput;
  isOpen: boolean;
  onClose: () => void;
}

export const FraudNotificationToast: React.FC<FraudNotificationToastProps> = ({
  result,
  input,
  isOpen,
  onClose,
}) => {
  const [isBeeping, setIsBeeping] = useState(fraudAudio.getIsSirenPlaying());
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(true);

  useEffect(() => {
    const unsub = fraudAudio.subscribe((playing) => {
      setIsBeeping(playing);
    });
    return unsub;
  }, []);

  const mobileNumber = input.mobile_number || "+91 98765 43210";
  const formattedAmount = result?.features?.amount
    ? result.features.amount.toLocaleString("en-IN")
    : (input.amount || 0).toLocaleString("en-IN");
  const merchantName = input.merchant || "Crypto Exchange Global";

  useEffect(() => {
    if (isOpen && result && (result.risk_score >= 70 || result.tier === "HIGH RISK")) {
      // Trigger haptic vibration
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate([300, 100, 300, 100, 500]);
      }
      // Web Notification API
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          try {
            new Notification("🚨 FRAUD ALERT: Card Blocked", {
              body: `Your earlier transaction of ₹${formattedAmount} at ${merchantName} was detected as FRAUD. Your card has been permanently BLOCKED.`,
            });
          } catch {
            // Ignore if restricted in iframe
          }
        }
      }
    }
  }, [isOpen, result, formattedAmount, merchantName]);

  if (!isOpen || !result || (result.risk_score < 70 && result.tier !== "HIGH RISK")) {
    return null;
  }

  const handleStopSound = () => {
    fraudAudio.stopAlarm();
  };

  const handleRestartSound = () => {
    fraudAudio.playLoudFraudBeepAlert(12);
  };

  const handleManualNotificationTest = () => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([300, 100, 300, 100, 500]);
    }
    fraudAudio.playLoudFraudBeepAlert(8);
  };

  return (
    <AnimatePresence>
      <div
        id="real-time-fraud-notification-container"
        className="fixed top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-[9999] max-w-lg w-[calc(100%-2rem)] px-2 pointer-events-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="relative rounded-2xl overflow-hidden shadow-[0_10px_50px_rgba(239,68,68,0.7)] border-2 border-rose-500 bg-[#0f0306] text-white p-4"
        >
          {/* Pulsing Top Security Strobe Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-rose-400 to-amber-500 animate-pulse" />

          {/* Header Row */}
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-rose-500/30">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-600/30 border border-rose-500 flex items-center justify-center text-rose-400 animate-bounce">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-rose-300">
                    REAL-TIME NOTIFICATION DISPATCHED
                  </span>
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                </div>
                <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Smartphone className="w-3 h-3 text-cyan-400" />
                  <span>Target Mobile: <strong className="text-cyan-300">{mobileNumber}</strong></span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close Notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Smartphone Lockscreen Notification Simulation Box */}
          <div className="my-3 p-3.5 rounded-xl bg-black/70 border border-rose-500/40 shadow-inner space-y-2">
            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>MECHAMINDS BANK FRAUD SHIELD</span>
              </div>
              <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                DELIVERED JUST NOW
              </span>
            </div>

            {/* Crucial requested exact text */}
            <div className="text-xs font-black text-rose-200 uppercase tracking-wide">
              🚨 CRITICAL FRAUD DETECTED: CARD BLOCKED
            </div>

            <p className="text-xs text-slate-100 font-medium leading-relaxed bg-rose-950/40 p-2.5 rounded-lg border border-rose-500/30">
              "Your earlier transaction of <strong className="text-rose-300 font-bold">₹{formattedAmount}</strong> at <strong className="text-white">{merchantName}</strong> was detected as <strong className="text-rose-400 font-black underline decoration-rose-500">FRAUD</strong>. Your card ending in <strong className="text-amber-300 font-mono font-bold">8899</strong> has been permanently <strong className="text-rose-400 font-black">BLOCKED</strong>."
            </p>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-white/10">
              <span>Risk Score: <strong className="text-rose-400 font-bold">{result.risk_score.toFixed(1)}%</strong></span>
              <span>Case: <strong className="text-cyan-300">{result.case_number || "MM-2026-90412"}</strong></span>
              <span className="text-rose-400 font-bold">ACTION: LOCKED</span>
            </div>
          </div>

          {/* Sound & Alert Controls */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              {isBeeping ? (
                <button
                  type="button"
                  onClick={handleStopSound}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg cursor-pointer transition-all active:scale-95"
                  id="silence-beep-alert-btn"
                >
                  <VolumeX className="w-3.5 h-3.5 animate-pulse" />
                  <span>Silence Sound</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRestartSound}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                  id="replay-beep-alert-btn"
                >
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Replay Sound</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
