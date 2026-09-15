import React from "react";
import { Wifi, ShieldCheck, ShieldAlert, Cpu } from "lucide-react";
import { PredictionResult, TransactionInput } from "../types";

interface CreditCardPreviewProps {
  input: TransactionInput;
  result: PredictionResult | null;
}

export const CreditCardPreview: React.FC<CreditCardPreviewProps> = ({ input, result }) => {
  const isHighRisk = result?.tier === "HIGH RISK";
  const isSuspicious = result?.tier === "SUSPICIOUS";

  return (
    <div
      id="card-preview-container"
      className="relative w-full max-w-sm mx-auto select-none transition-all duration-500 transform hover:scale-[1.02]"
    >
      {/* Outer ambient glow based on risk tier */}
      <div
        className={`absolute -inset-1 rounded-2xl blur-lg opacity-40 transition-colors duration-700 ${
          isHighRisk
            ? "bg-rose-600"
            : isSuspicious
            ? "bg-amber-500"
            : "bg-cyan-500"
        }`}
      />

      {/* Credit Card Body */}
      <div
        id="mechaminds-platinum-card"
        className="relative h-56 rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl border border-white/15 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a0f1d] text-white"
      >
        {/* Subtle geometric holographic pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#00f2fe_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Row: Brand & Status */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center">
              <span className="text-[10px] font-black text-cyan-300">MM</span>
            </div>
            <div>
              <span className="text-xs font-black tracking-widest text-slate-200">
                MECHAMINDS
              </span>
              <span className="text-[9px] font-semibold text-cyan-400 ml-1.5 uppercase tracking-wider">
                PLATINUM
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isHighRisk ? (
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white border border-rose-400 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>CARD BLOCKED</span>
              </span>
            ) : isSuspicious ? (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <ShieldAlert className="w-3 h-3" />
                <span>STEP-UP OTP</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <ShieldCheck className="w-3 h-3" />
                <span>PROTECTED</span>
              </span>
            )}
            <Wifi className="w-4 h-4 text-slate-400 rotate-90" />
          </div>
        </div>

        {/* Card Blocked Watermark Overlay */}
        {isHighRisk && (
          <div className="absolute inset-0 bg-red-950/70 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center border-2 border-rose-500 rounded-2xl animate-in fade-in duration-300">
            <div className="p-2 rounded-full bg-rose-600 text-white shadow-[0_0_20px_rgba(239,68,68,1)] mb-1 animate-bounce">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="text-sm font-black tracking-widest text-white uppercase drop-shadow-md">
              CARD PERMANENTLY BLOCKED
            </div>
            <div className="text-[10px] font-mono text-rose-200 mt-0.5">
              Fraud Detected (Score &gt; 70%) • SMS Sent
            </div>
          </div>
        )}

        {/* Middle Row: EMV Chip & Contactless */}
        <div className="relative z-10 flex items-center space-x-3 my-auto">
          {/* Metallic EMV Chip */}
          <div className="relative w-11 h-9 rounded-md bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 border border-amber-600/40 shadow-inner flex items-center justify-center overflow-hidden">
            <Cpu className="w-6 h-6 text-amber-900/60" />
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
          </div>
          <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
            TOKENIZED BIOMETRIC
          </span>
        </div>

        {/* Bottom Row: Card Details */}
        <div className="relative z-10 space-y-2">
          {/* Card Number */}
          <div className="font-mono text-base tracking-[0.25em] text-slate-200 font-semibold drop-shadow-sm">
            4532 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 8899
          </div>

          <div className="flex items-end justify-between text-[10px]">
            <div>
              <div className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">
                Cardholder
              </div>
              <div className="font-semibold tracking-wider text-slate-200 uppercase">
                Alexander Wright
              </div>
            </div>

            <div>
              <div className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">
                Expires
              </div>
              <div className="font-mono font-semibold text-slate-200">08/29</div>
            </div>

            <div className="text-right">
              <div className="font-black italic text-sm tracking-tight text-white/90">
                VISA
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Swipe Status Bar */}
      <div className="mt-2 text-center text-xs text-slate-400 flex items-center justify-between px-2">
        <span>
          Live Swipe:{" "}
          <strong className="text-white font-mono">
            ₹{input.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </strong>
        </span>
        <span className="text-[11px] truncate max-w-[170px] text-slate-300">
          {input.merchant || "Standard Merchant"}
        </span>
      </div>
    </div>
  );
};
