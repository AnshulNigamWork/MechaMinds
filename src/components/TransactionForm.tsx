import React from "react";
import {
  Sliders,
  Zap,
  Globe,
  MapPin,
  IndianRupee,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Radio,
  Sparkles,
} from "lucide-react";
import { TransactionInput } from "../types";

interface TransactionFormProps {
  input: TransactionInput;
  onChange: (updated: Partial<TransactionInput>) => void;
  onSubmit: () => void;
  onSimulateMcAfeeAlert?: () => void;
  isLoading: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  input,
  onChange,
  onSubmit,
  onSimulateMcAfeeAlert,
  isLoading,
}) => {
  const [ntfyTopic, setNtfyTopic] = React.useState("mechaminds-fraud-demo-2026");
  const [pingStatus, setPingStatus] = React.useState<string | null>(null);
  const [isPinging, setIsPinging] = React.useState(false);
  const [isPhoneCardExpanded, setIsPhoneCardExpanded] = React.useState(true);

  const handleSendPing = async () => {
    setIsPinging(true);
    setPingStatus(null);
    try {
      const res = await fetch("/api/ntfy/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: ntfyTopic }),
      });
      const data = await res.json();
      if (data.success) {
        setPingStatus(`✓ Ping delivered to phone (ntfy.sh/${data.topic})!`);
      } else {
        setPingStatus(`Notice: ${data.error || "Failed"}`);
      }
    } catch (err: any) {
      setPingStatus(`Ping error: ${err?.message || "Check network"}`);
    } finally {
      setIsPinging(false);
    }
  };
  const presets = [
    {
      label: "Safe Domestic",
      desc: "₹1,500 • Known Device • Home City (6 km) • 02:30 PM",
      targetScore: "12/100 (Safe)",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      values: {
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
      },
    },
    {
      label: "Suspicious Mid-Day",
      desc: "₹32,500 • Unrecognized Chrome • +85 km • Rapid Velocity (0.4h)",
      targetScore: "52/100 (Suspicious)",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      values: {
        amount: 32500,
        location: "New Delhi, India",
        distance: 85,
        time_delta: 0.4,
        is_international: 0,
        is_vpn: 0,
        device_name: "Unrecognized Chrome (Android Tablet)",
        unrecognized_device: 1,
        time_hour: 15.5,
        time_display: "03:30 PM IST",
        merchant: "Croma Electronics",
        merchant_category: "Consumer Tech",
      },
    },
    {
      label: "High-Risk Midnight",
      desc: "₹85,000+ • Moscow / Tor Proxy • 6,400 km • 02:14 AM IST",
      targetScore: "94/100 (High Risk)",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      values: {
        amount: 85000,
        location: "Moscow, Russian Federation",
        distance: 6400,
        time_delta: 0.15,
        is_international: 1,
        is_vpn: 1,
        device_name: "Linux x86_64 (Tor Browser)",
        unrecognized_device: 1,
        time_hour: 2.23,
        time_display: "02:14 AM IST",
        merchant: "LuxWatches Direct",
        merchant_category: "Luxury Goods",
      },
    },
    {
      label: "Hard Flag (> ₹1,00,000)",
      desc: "₹1,45,000 • Regulatory Hard Rule Block • London",
      targetScore: "100% (Hard Flag)",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      values: {
        amount: 145000,
        location: "London, United Kingdom",
        distance: 7200,
        time_delta: 0.1,
        is_international: 1,
        is_vpn: 1,
        device_name: "Unrecognized Windows Host",
        unrecognized_device: 1,
        time_hour: 3.1,
        time_display: "03:06 AM IST",
        merchant: "CryptoVault Gateway",
        merchant_category: "High Risk Financial",
      },
    },
  ];

  const formatHourToDisplay = (val: number) => {
    const h = Math.floor(val);
    const m = Math.round((val - h) * 60);
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 === 0 ? 12 : h % 12;
    const displayM = m < 10 ? `0${m}` : m;
    return `${displayH}:${displayM} ${period} IST`;
  };

  const isMidnight = (input.time_hour ?? 14) >= 0.0 && (input.time_hour ?? 14) <= 4.5;

  return (
    <div
      className="bg-[#111c38]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-5 flex flex-col gap-5"
      id="transaction-form-card"
    >
      {/* Top Main Action Header */}
      <div className="flex flex-col gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.25)]">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <span>CHECK YOUR TRANSACTION FOR FRAUD</span>
                <span className="text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">
                  REAL-TIME TESTER
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Adjust parameters below or pick a preset, then click the check button to get an instant fraud decision.
              </p>
            </div>
          </div>
        </div>

        {/* Action Panel: Clean Status summary + 2 Non-overlapping Action Buttons */}
        <div className="bg-[#0b1b2b] p-3.5 rounded-xl border border-cyan-500/30 shadow-lg flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-300">Target Tx:</span>
              <span className="text-cyan-300 font-mono font-extrabold bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-500/40">
                ₹{input.amount.toLocaleString("en-IN")}
              </span>
              <span className="text-slate-400 font-mono text-[11px]">{input.distance} km</span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${input.is_vpn ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-slate-800 text-slate-400"}`}>
                {input.is_vpn ? "VPN Active" : "ISP Direct"}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Recipient: <strong className="text-cyan-300 font-mono">{input.mobile_number || "+91 98765 43210"}</strong>
            </div>
          </div>

          {/* 2 Clear, Balanced, Non-Overlapping Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* User Button: Simulate McAfee/360 Alert */}
            <button
              type="button"
              disabled={isLoading}
              onClick={onSimulateMcAfeeAlert}
              className="w-full px-4 py-3 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase tracking-wide rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:shadow-[0_0_30px_rgba(239,68,68,0.75)] transition-all flex items-center justify-center gap-2 cursor-pointer border border-red-400/40 disabled:opacity-50 active:scale-[0.98]"
              id="simulate-mcafee-alert-btn"
              title="Simulate high-risk fraud (Risk > 70%), sound loud alarm, and dispatch mobile card-blocked notification"
            >
              <ShieldAlert className="w-4 h-4 text-white shrink-0" />
              <span className="whitespace-nowrap">Simulate McAfee Alert</span>
            </button>

            {/* Check Transaction Button */}
            <button
              type="button"
              disabled={isLoading}
              onClick={onSubmit}
              className="w-full px-4 py-3 bg-gradient-to-r from-cyan-400 via-cyan-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(0,242,254,0.4)] hover:shadow-[0_0_30px_rgba(0,242,254,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
              id="top-check-fraud-button"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-slate-950 shrink-0" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span className="whitespace-nowrap">Evaluating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950 shrink-0" />
                  <span className="whitespace-nowrap">Check For Fraud</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Registered Mobile Number Input for Real-Time SMS/Push Alert */}
        <div className="bg-slate-900/80 p-3 rounded-xl border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-inner">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Smartphone className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Registered Mobile Number</span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                  SMS / FCM LIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Notification recipient when risk score &gt; 70.0% (Real-time "Card Blocked" SMS dispatched)
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <input
              type="tel"
              id="mobile-number-input"
              value={input.mobile_number !== undefined ? input.mobile_number : "+91 98765 43210"}
              onChange={(e) => onChange({ mobile_number: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full sm:w-44 px-3 py-1.5 text-xs font-mono font-bold bg-black/60 border border-white/20 rounded-lg text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* 📱 Connect Judge's Phone for Live Push Alerts (ntfy.sh) */}
      <div className="bg-[#071924] border border-cyan-500/40 rounded-xl p-3.5 shadow-lg space-y-2.5">
        <div 
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setIsPhoneCardExpanded(!isPhoneCardExpanded)}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">📱</span>
            <span className="text-xs font-black text-white uppercase tracking-wider">
              Connect Judge's Phone for Live Push Alerts
            </span>
            <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/40">
              ntfy.sh (100% Free)
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {isPhoneCardExpanded ? "▲ Collapse" : "▼ Setup"}
          </span>
        </div>

        {isPhoneCardExpanded && (
          <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
            <div className="text-slate-300 text-[11px] leading-relaxed">
              <strong>2-Step Instant Setup (Zero App Install Required):</strong>
              <ol className="list-decimal pl-4 mt-1 space-y-0.5 text-slate-400">
                <li>
                  Open <a href={`https://ntfy.sh/${ntfyTopic}`} target="_blank" rel="noreferrer" className="text-cyan-400 font-bold underline">ntfy.sh/{ntfyTopic}</a> on your phone (or install the free ntfy app).
                </li>
                <li>Tap <strong>Subscribe</strong> to topic: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-300 font-mono">{ntfyTopic}</code></li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
              <input
                type="text"
                value={ntfyTopic}
                onChange={(e) => setNtfyTopic(e.target.value.trim().replace(/\s+/g, "-").toLowerCase())}
                placeholder="Topic Name"
                className="flex-1 px-2.5 py-1.5 text-xs font-mono font-bold bg-black/60 border border-white/20 rounded-lg text-cyan-300 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={handleSendPing}
                disabled={isPinging}
                className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>📲</span>
                <span>{isPinging ? "Pinging..." : "Send Test Ping to Phone"}</span>
              </button>
            </div>

            {pingStatus && (
              <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 p-1.5 rounded border border-emerald-500/30">
                {pingStatus}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preset Scenarios (Slide Deck Scenarios) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            1-Click Test Scenarios (Click to Load & Verify)
          </span>
          <span className="text-[11px] text-cyan-400 font-mono">Instant Presets</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                onChange(preset.values);
              }}
              className="text-left p-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all text-xs group cursor-pointer"
              id={`preset-btn-${preset.label.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-semibold text-slate-200 group-hover:text-cyan-300 truncate">
                  {preset.label}
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${preset.badgeColor} shrink-0`}>
                  {preset.targetScore}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {preset.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 5 Signal Parameters Grid */}
      <div className="space-y-4">
        {/* Signal 1: ₹ Amount */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5" htmlFor="amount-slider">
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                ₹ Signal
              </span>
              <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
              <span>Transaction Amount (INR)</span>
            </label>
            <div className="flex items-center gap-1">
              <span className="text-xs text-slate-400 font-mono">₹</span>
              <input
                type="number"
                min="0"
                max="250000"
                step="500"
                value={input.amount}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChange({ amount: isNaN(val) ? 0 : Math.max(0, val) });
                }}
                className="w-28 px-2 py-1 text-sm font-mono font-bold text-right bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                id="amount-input-number"
              />
            </div>
          </div>
          <input
            id="amount-slider"
            type="range"
            min="100"
            max="200000"
            step="500"
            value={input.amount}
            onChange={(e) => onChange({ amount: Math.max(0, parseFloat(e.target.value)) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>₹100</span>
            <span className="text-amber-400">&gt; ₹50,000 (Review)</span>
            <span className="text-rose-400 font-bold">&gt; ₹1,00,000 (Hard Rule Block)</span>
            <span>₹2,00,000</span>
          </div>

          {/* Quick Amount Chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] text-slate-400 font-mono">Quick Pick:</span>
            {[
              { label: "₹1,500 (Safe)", val: 1500 },
              { label: "₹18,500", val: 18500 },
              { label: "₹45,000", val: 45000 },
              { label: "₹92,000", val: 92000 },
              { label: "₹1,45,000 (Hard Rule)", val: 145000 },
            ].map((chip) => (
              <button
                key={chip.val}
                type="button"
                onClick={() => onChange({ amount: chip.val })}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border cursor-pointer transition-all ${
                  input.amount === chip.val
                    ? "bg-cyan-500/30 text-cyan-300 border-cyan-400 font-bold shadow-[0_0_10px_rgba(0,242,254,0.3)]"
                    : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Signal 2: L Location & Distance */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5" htmlFor="distance-slider">
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                L Signal
              </span>
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>Location Radius & Jurisdiction</span>
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min="0"
                max="8000"
                step="25"
                value={input.distance}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChange({ distance: isNaN(val) ? 0 : Math.max(0, val) });
                }}
                className="w-20 px-2 py-1 text-sm font-mono font-bold text-right bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                id="distance-input-number"
              />
              <span className="text-xs text-slate-400 font-mono">km</span>
            </div>
          </div>
          <input
            id="distance-slider"
            type="range"
            min="0"
            max="8000"
            step="25"
            value={input.distance}
            onChange={(e) => onChange({ distance: Math.max(0, parseFloat(e.target.value)) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-400"
          />
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>0 km (Home Metro)</span>
            <span className="text-amber-400">2,000 km</span>
            <span className="text-rose-400 font-bold">&gt; 5,000 km (Hard Rule)</span>
            <span>8,000 km</span>
          </div>

          {/* Location details input + International toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <input
              type="text"
              value={input.location || ""}
              onChange={(e) => onChange({ location: e.target.value })}
              placeholder="City / Country (e.g. Mumbai, India)"
              className="px-2.5 py-1.5 text-xs bg-black/40 border border-white/10 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="button"
              onClick={() => onChange({ is_international: input.is_international === 1 ? 0 : 1 })}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-colors ${
                input.is_international === 1
                  ? "bg-purple-500/20 border-purple-500/50 text-purple-200"
                  : "bg-black/30 border-white/10 text-slate-400"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>International Tag</span>
              </span>
              <span className="font-mono text-[10px]">
                {input.is_international === 1 ? "OVERSEAS" : "DOMESTIC"}
              </span>
            </button>
          </div>
        </div>

        {/* Signal 3: D Device & VPN Telemetry */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                D Signal
              </span>
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Device Fingerprint & Network</span>
            </label>
            <span className="text-[10px] font-mono text-slate-400">Hardware Affinity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={input.device_name || ""}
              onChange={(e) => onChange({ device_name: e.target.value })}
              placeholder="Device Model / Browser Fingerprint"
              className="px-2.5 py-1.5 text-xs bg-black/40 border border-white/10 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="button"
              onClick={() => onChange({ is_vpn: input.is_vpn === 1 ? 0 : 1 })}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-colors ${
                input.is_vpn === 1
                  ? "bg-rose-500/20 border-rose-500/50 text-rose-300"
                  : "bg-black/30 border-white/10 text-slate-400"
              }`}
              id="vpn-toggle-btn"
            >
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" />
                <span>Tor / VPN Proxy</span>
              </span>
              <span className="font-mono text-[10px]">
                {input.is_vpn === 1 ? "ACTIVE (+20)" : "CLEARED"}
              </span>
            </button>
          </div>
        </div>

        {/* Signal 4: T Time of Transaction */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5" htmlFor="time-hour-slider">
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                T Signal
              </span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Time Window (IST Diurnal Rhythm)</span>
            </label>
            <div className="flex items-center gap-1.5">
              {isMidnight && (
                <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono border border-rose-500/40 animate-pulse">
                  MIDNIGHT DORMANT
                </span>
              )}
              <span className="text-xs font-mono font-bold text-cyan-300">
                {input.time_display || formatHourToDisplay(input.time_hour ?? 14.5)}
              </span>
            </div>
          </div>
          <input
            id="time-hour-slider"
            type="range"
            min="0"
            max="23.9"
            step="0.25"
            value={input.time_hour ?? 14.5}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              onChange({
                time_hour: val,
                time_display: formatHourToDisplay(val),
              });
            }}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span className="text-rose-400 font-bold">00:00 AM (High-Risk Anomaly)</span>
            <span>12:00 PM (Midday)</span>
            <span>11:45 PM</span>
          </div>
        </div>

        {/* Signal 5: F Frequency & Cadence */}
        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5" htmlFor="frequency-slider">
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                F Signal
              </span>
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>Velocity Cadence (Hours Since Prior Swipe)</span>
            </label>
            <span className="text-xs font-mono font-bold text-white">
              {input.time_delta.toFixed(1)} hrs
            </span>
          </div>
          <input
            id="frequency-slider"
            type="range"
            min="0.1"
            max="24"
            step="0.1"
            value={input.time_delta}
            onChange={(e) => onChange({ time_delta: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span className="text-rose-400 font-bold">&lt; 0.3 hr (Velocity Burst)</span>
            <span>4.0 hrs</span>
            <span>24.0 hrs (Normal Cadence)</span>
          </div>
        </div>
      </div>

      {/* Clean Helper Note & Bottom Quick Trigger */}
      <div className="flex items-center justify-between px-3 py-2 bg-black/40 rounded-xl text-slate-400 text-xs border border-white/5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-[11px] text-slate-300">
            5 Signals evaluated: ₹ Amount, Distance, VPN, Time, &amp; Velocity.
          </span>
        </div>
        <button
          type="button"
          disabled={isLoading}
          onClick={onSubmit}
          className="text-cyan-400 hover:text-cyan-300 font-bold text-xs underline decoration-cyan-500/50 cursor-pointer disabled:opacity-50"
        >
          Re-Check
        </button>
      </div>
    </div>
  );
};
