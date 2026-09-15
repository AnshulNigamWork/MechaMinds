import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Activity, 
  Database, 
  FileCode2, 
  Zap,
  Radio,
  Sparkles,
  Lock,
  BellRing,
  Volume2,
  VolumeX,
  Play,
  Square
} from "lucide-react";
import { TransactionForm } from "./components/TransactionForm";
import { AnalysisResults } from "./components/AnalysisResults";
import { DatasetInspector } from "./components/DatasetInspector";
import { PythonCodeViewer } from "./components/PythonCodeViewer";
import { BatchTelemetryLog } from "./components/BatchTelemetryLog";
import { FraudNotificationToast } from "./components/FraudNotificationToast";
import { TransactionInput, PredictionResult, TelemetryLogEntry } from "./types";
import { fraudAudio } from "./utils/audio";

export default function App() {
  const [activeTab, setActiveTab] = useState<"inspector" | "telemetry" | "dataset" | "python">("inspector");

  const [input, setInput] = useState<TransactionInput>({
    amount: 1500,
    location: "Mumbai, India",
    distance: 6,
    time_delta: 4.0,
    is_international: 0,
    is_vpn: 0,
    device_name: "iPhone 15 Pro (Known Mobile)",
    unrecognized_device: 0,
    time_hour: 14.5,
    time_display: "02:30 PM IST",
    merchant: "Swiggy Food Delivery",
    merchant_category: "Dining",
    mobile_number: "+91 98765 43210",
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [latestLog, setLatestLog] = useState<TelemetryLogEntry | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const [isFraudToastOpen, setIsFraudToastOpen] = useState(false);

  useEffect(() => {
    const unsub = fraudAudio.subscribe((playing) => {
      setIsSirenPlaying(playing);
    });
    return unsub;
  }, []);

  const handleInputChange = (updated: Partial<TransactionInput>) => {
    setInput((prev) => ({ ...prev, ...updated }));
  };

  const executeInference = async (txInput: TransactionInput, userInitiated = true) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(txInput),
      });

      if (!response.ok) {
        throw new Error(`Inference error: ${response.statusText}`);
      }

      const data: PredictionResult = await response.json();
      setResult(data);

      // Sound Alarm & Notification trigger when risk score > 70 or tier is HIGH RISK
      if (userInitiated) {
        if (data.risk_score >= 70 || data.tier === "HIGH RISK") {
          // Play the loud piercing dual-tone "BEEP-BEEP" alert
          fraudAudio.playLoudFraudBeepAlert(12);
          // Show real-time mobile push notification toast
          setIsFraudToastOpen(true);

          // Mobile device haptic feedback
          if (typeof window !== "undefined" && "vibrate" in navigator) {
            navigator.vibrate([350, 100, 350, 100, 700]);
          }

          // Browser native notification (if supported & allowed)
          if (typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission === "granted") {
              try {
                new Notification("🚨 CRITICAL FRAUD: CARD BLOCKED", {
                  body: `Your earlier transaction of ₹${txInput.amount.toLocaleString("en-IN")} was detected as FRAUD. Your card ending in 8899 has been permanently BLOCKED.`,
                });
              } catch (e) {
                // ignore notification instantiation issues in iframe
              }
            } else if (Notification.permission !== "denied") {
              Notification.requestPermission();
            }
          }
        } else if (data.tier === "SUSPICIOUS") {
          fraudAudio.playWarningBeep();
          setIsFraudToastOpen(false);
        } else {
          fraudAudio.playSuccessChime();
          setIsFraudToastOpen(false);
        }
      }

      if (data) {
        setLatestLog({
          id: `TX-${Date.now().toString().slice(-5)}`,
          timestamp: new Date().toLocaleTimeString("en-IN", { hour12: false }),
          amount: txInput.amount,
          distance: txInput.distance,
          location: txInput.location,
          merchant: txInput.merchant,
          device: txInput.device_name,
          is_international: txInput.is_international,
          is_vpn: txInput.is_vpn || 0,
          risk_score: data.risk_score,
          tier: data.tier,
          tier_label: data.tier_label,
          is_fraud: data.is_fraud,
          hard_rule_triggered: data.hard_rule_triggered,
          latency_ms: data.latency_ms || 32,
        });
      }
    } catch (err) {
      console.error("Analysis request failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async (userInitiated = true) => {
    await executeInference(input, userInitiated);
  };

  // Immediate Simulation of the user-requested McAfee/360 Alert
  const handleSimulateMcAfeeAlert = async () => {
    const highRiskInput: TransactionInput = {
      amount: 145000,
      location: "Moscow, Russia (Offshore IP)",
      distance: 5200,
      time_delta: 0.1,
      is_international: 1,
      is_vpn: 1,
      device_name: "Tor Browser on Linux (Unrecognized)",
      unrecognized_device: 1,
      time_hour: 2.5,
      time_display: "02:30 AM IST (Midnight)",
      merchant: "Crypto Exchange Global",
      merchant_category: "Virtual Assets",
      mobile_number: input.mobile_number || "+91 98765 43210",
    };

    setInput(highRiskInput);
    await executeInference(highRiskInput, true);
  };

  // Run initial analysis once on mount so users immediately see a live, working dashboard
  useEffect(() => {
    if (!hasLoadedInitial) {
      setHasLoadedInitial(true);
      executeInference(input, false);
    }
  }, [hasLoadedInitial]);

  return (
    <div className="min-h-screen bg-[#070b18] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top SOC Navigation Bar - Non-sticky so it scrolls naturally up with the page */}
      <header className="bg-[#081522] border-b border-[#143e5c] border-t-2 border-t-cyan-400 relative z-10 shadow-lg" id="app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
            
            {/* Left: Enlarged MechaMinds Brand Cluster */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
              <div className="flex items-center gap-3">
                {/* Brand Logo Icon */}
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/25 via-cyan-400/10 to-blue-600/30 border border-cyan-400/60 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(0,242,254,0.35)] ring-1 ring-cyan-400/30 shrink-0">
                  <ShieldCheck className="w-6 h-6 text-cyan-400 stroke-[2.5]" />
                </div>

                {/* Brand Titles */}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none flex items-center gap-1.5">
                      <span className="tracking-tight">MechaMinds</span>
                      <span className="text-cyan-400 font-black">AI</span>
                    </h1>
                    
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,242,254,0.2)] whitespace-nowrap">
                      SOC COMMAND
                    </span>

                    <span className="text-[9px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-blue-950/70 text-blue-300 border border-blue-500/40 hidden sm:inline-block whitespace-nowrap">
                      SSPU '26
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2 flex-wrap">
                    <span className="text-slate-300 font-medium">Real-Time Credit Card Fraud Detection</span>
                    <span className="text-slate-600 font-bold">•</span>
                    <span className="text-cyan-400 font-semibold">Sub-50ms XGBoost + Gemini XAI</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Clean, Uncrowded Navigation & Alarm Trigger */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
              {/* Beep Alert Quick Trigger */}
              <button
                type="button"
                onClick={() => {
                  if (isSirenPlaying) {
                    fraudAudio.stopAlarm();
                  } else {
                    fraudAudio.playLoudFraudBeepAlert(10);
                  }
                }}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all shrink-0 ${
                  isSirenPlaying
                    ? "bg-rose-600 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.7)]"
                    : "bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30"
                }`}
                title="Test or silence the loud fraud beep alert sound"
                id="header-siren-test-btn"
              >
                <BellRing className={`w-3.5 h-3.5 ${isSirenPlaying ? "animate-bounce" : ""}`} />
                <span>{isSirenPlaying ? "SILENCE ALARM" : "TEST ALARM SOUND"}</span>
              </button>

              {/* Clean Two-Tab Navigation */}
              <nav className="flex items-center gap-1 bg-[#05111c] p-1 rounded-xl border border-[#143e5c] shrink-0" id="main-nav-tabs">
                <button
                  type="button"
                  onClick={() => setActiveTab("inspector")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    activeTab === "inspector"
                      ? "bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 shadow-[0_0_18px_rgba(0,242,254,0.45)] font-black"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                  id="tab-inspector-btn"
                >
                  <Activity className="w-3.5 h-3.5 shrink-0" />
                  <span>Fraud Inspector</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("telemetry")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    activeTab === "telemetry"
                      ? "bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 shadow-[0_0_18px_rgba(0,242,254,0.45)] font-black"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                  id="tab-telemetry-btn"
                >
                  <Zap className="w-3.5 h-3.5 shrink-0" />
                  <span>Audit Logs</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {activeTab === "inspector" && (
          <div className="flex flex-col gap-4">
            {/* Compact SOC Command HUD Strip */}
            <div className="bg-[#081726] border border-[#143e5c] rounded-xl px-4 py-2.5 flex flex-col md:flex-row items-start md:items-center justify-between text-xs font-mono text-slate-300 shadow-lg gap-2.5 overflow-x-auto">
              <div className="flex items-center gap-2 sm:gap-2.5 flex-nowrap shrink-0">
                <span className="text-cyan-400 font-extrabold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  PIPELINE:
                </span>
                <span className="text-slate-300 font-semibold">1. Telemetry Ingest</span>
                <span className="text-slate-600 font-bold">➔</span>
                <span className="text-amber-400 font-extrabold">2. 5 Signals (₹, Loc, Dev, Time, Freq)</span>
                <span className="text-slate-600 font-bold">➔</span>
                <span className="text-emerald-400 font-extrabold">3. Real-Time SOC Verdict</span>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-auto text-[11px]">
                <div className="flex items-center gap-1.5 text-cyan-300 font-bold bg-cyan-950/60 px-2.5 py-0.5 rounded-md border border-cyan-500/40">
                  <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                  <span>&lt;38ms SLA</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>INR (₹) ENGINE READY</span>
                </div>
              </div>
            </div>

            {/* Two-Column Interactive Layout: Form vs Live Assessment */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column: Transaction Input Controls & Check Button */}
              <div className="lg:col-span-6">
                <TransactionForm
                  input={input}
                  onChange={handleInputChange}
                  onSubmit={() => handleAnalyze(true)}
                  onSimulateMcAfeeAlert={handleSimulateMcAfeeAlert}
                  isLoading={isLoading}
                />
              </div>

              {/* Right Column: Analysis Results, Gauge & Emergency Siren Alert */}
              <div className="lg:col-span-6">
                <AnalysisResults
                  result={result}
                  input={input}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Integrated Batch Telemetry Log */}
            <BatchTelemetryLog currentLog={latestLog} />
          </div>
        )}

        {activeTab === "telemetry" && (
          <div className="flex flex-col gap-5">
            <BatchTelemetryLog currentLog={latestLog} />
          </div>
        )}

        {activeTab === "dataset" && (
          <div className="flex flex-col gap-5">
            <DatasetInspector />
          </div>
        )}

        {activeTab === "python" && (
          <div className="flex flex-col gap-5">
            <PythonCodeViewer />
          </div>
        )}
      </main>

      {/* Real-time High-Risk Fraud Alert Push Toast / Modal */}
      <FraudNotificationToast
        result={result}
        input={input}
        isOpen={isFraudToastOpen}
        onClose={() => setIsFraudToastOpen(false)}
      />

      {/* SOC Footer */}
      <footer className="border-t border-white/10 bg-[#070b18] py-3 mt-auto text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-cyan-400 font-bold">MechaMinds AI Fraud Detection Platform</span>
            <span>•</span>
            <span className="text-slate-400">Pure Web Audio Siren + Sub-50ms 5-Signal Classifier</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
            <span>Decision: 70.0% Risk</span>
            <span>Hard Rules: &gt;₹1,00,000 / &gt;5,000 km</span>
            <span className="text-emerald-400 font-bold">● SOC ACTIVE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
