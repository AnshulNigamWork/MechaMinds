import React, { useState, useEffect } from "react";
import { 
  Database, 
  BarChart3, 
  Search, 
  Wifi,
  Sparkles
} from "lucide-react";
import { DatasetSummary } from "../types";

export const DatasetInspector: React.FC = () => {
  const [dataset, setDataset] = useState<DatasetSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "fraud" | "legit">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/dataset")
      .then((res) => res.json())
      .then((data) => {
        setDataset(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch dataset:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !dataset) {
    return (
      <div className="bg-[#111c38]/90 backdrop-blur-md rounded-2xl border border-white/10 p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-300">Loading 1,000 Synthetic INR Transactions & XGBoost Specs...</p>
      </div>
    );
  }

  const filteredRecords = dataset.sampleRecords.filter((r) => {
    if (filter === "fraud" && r.is_fraud !== 1) return false;
    if (filter === "legit" && r.is_fraud !== 0) return false;
    if (searchTerm) {
      const matchAmount = r.amount.toString().includes(searchTerm);
      const matchDistance = r.distance_from_home.toString().includes(searchTerm);
      return matchAmount || matchDistance;
    }
    return true;
  });

  return (
    <div
      className="bg-[#111c38]/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl p-5 flex flex-col gap-6"
      id="dataset-inspector-card"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Synthetic INR Dataset & XGBoost Model Architecture
              </h2>
              <p className="text-xs text-slate-400">
                1,000 in-memory credit card transactions generated with seed 42 for 5-signal risk analysis
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 bg-white/5 text-slate-200 rounded-full border border-white/10 font-mono">
            N = {dataset.totalSamples.toLocaleString()} Samples
          </span>
          <span className="text-xs font-semibold px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full border border-rose-500/40 font-mono">
            Fraud Rate: {dataset.fraudRate}%
          </span>
        </div>
      </div>

      {/* Model Specs & Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-white/5">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            MODEL ALGORITHM
          </div>
          <div className="text-sm font-extrabold text-white mt-0.5">
            {dataset.modelSpecs.algorithm}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            60 trees, max_depth=3, lr=0.1
          </div>
        </div>

        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-white/5">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            ACCURACY
          </div>
          <div className="text-sm font-extrabold text-emerald-400 mt-0.5 font-mono">
            {dataset.modelSpecs.evaluation.accuracy}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Precision: {dataset.modelSpecs.evaluation.precision}
          </div>
        </div>

        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-white/5">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            RECALL & F1 SCORE
          </div>
          <div className="text-sm font-extrabold text-cyan-400 mt-0.5 font-mono">
            {dataset.modelSpecs.evaluation.f1_score}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Recall: {dataset.modelSpecs.evaluation.recall}
          </div>
        </div>

        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-white/5">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            DECISION BOUNDARIES
          </div>
          <div className="text-xs font-mono font-bold text-slate-200 mt-0.5 truncate">
            ₹1,00,000 / 5,000 km
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Hard regulatory threshold
          </div>
        </div>
      </div>

      {/* Feature Importances */}
      <div className="p-4 bg-slate-900/60 rounded-xl border border-white/5 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-200">
          <span className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            5-Signal Feature Importance Weighting (Normalized Gain)
          </span>
          <span className="text-[11px] font-mono text-slate-400">Total: 100%</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {dataset.features.map((feat) => (
            <div key={feat.name} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-medium text-slate-300">
                <span className="font-mono text-white font-semibold">{feat.name}</span>
                <span className="font-mono text-cyan-300">{(feat.importance * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  style={{ width: `${feat.importance * 100}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {feat.range} • {feat.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Records Table */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wide">
            Sample In-Memory Records (Preview of 30)
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search amount/distance..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs bg-black/40 border border-white/10 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-44"
              />
            </div>
            <div className="flex items-center border border-white/10 rounded-lg overflow-hidden text-xs">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`px-2.5 py-1 ${filter === "all" ? "bg-cyan-500 text-slate-950 font-bold" : "bg-white/5 text-slate-300 hover:bg-white/10 cursor-pointer"}`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter("fraud")}
                className={`px-2.5 py-1 ${filter === "fraud" ? "bg-rose-600 text-white font-bold" : "bg-white/5 text-slate-300 hover:bg-white/10 cursor-pointer"}`}
              >
                Fraud
              </button>
              <button
                type="button"
                onClick={() => setFilter("legit")}
                className={`px-2.5 py-1 ${filter === "legit" ? "bg-emerald-600 text-white font-bold" : "bg-white/5 text-slate-300 hover:bg-white/10 cursor-pointer"}`}
              >
                Legit
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-900/40 max-h-64">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-mono border-b border-white/10 uppercase tracking-wider text-[10px] sticky top-0">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Amount (₹)</th>
                <th className="py-2.5 px-3">Distance (km)</th>
                <th className="py-2.5 px-3">Network</th>
                <th className="py-2.5 px-3">Cadence</th>
                <th className="py-2.5 px-3">Ground Truth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2 px-3 font-mono text-slate-500">#{r.id}</td>
                  <td className="py-2 px-3 font-mono font-bold text-white">
                    ₹{r.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2 px-3 font-mono text-slate-300">
                    {r.distance_from_home.toLocaleString()} km
                  </td>
                  <td className="py-2 px-3">
                    {r.is_vpn === 1 ? (
                      <span className="text-rose-400 font-mono text-[10px]">Tor/VPN</span>
                    ) : (
                      <span className="text-slate-400 font-mono text-[10px]">Direct ISP</span>
                    )}
                  </td>
                  <td className="py-2 px-3 font-mono text-slate-400 text-[10px]">
                    {r.time_delta.toFixed(1)} hrs
                  </td>
                  <td className="py-2 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        r.is_fraud === 1
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                          : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      }`}
                    >
                      {r.is_fraud === 1 ? "FRAUD" : "LEGIT"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
