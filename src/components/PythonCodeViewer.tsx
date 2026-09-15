import React, { useState, useEffect } from "react";
import { Copy, Check, Terminal, FileCode, Download, Sparkles } from "lucide-react";

export const PythonCodeViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [codeContent, setCodeContent] = useState<string>("");

  useEffect(() => {
    fetch("/api/raw-app-py")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.text();
      })
      .then((text) => setCodeContent(text))
      .catch((err) => {
        console.warn("Using bundled app.py code fallback:", err);
      });
  }, []);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    if (type === "all") {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } else {
      setCopiedCommand(type);
      setTimeout(() => setCopiedCommand(null), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([codeContent], { type: "text/x-python;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "app.py");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6" id="python-code-viewer">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#0b1a24] rounded-2xl border border-[#143547] shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-tight">
                Complete Python Source (app.py) • SOC Edition
              </h2>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                Streamlit + 5-Signal Engine + Siren & FCM Push
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              MechaMinds AI • Real-Time Credit Card Fraud Detection Platform • Single-File app.py
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleDownload}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            id="download-app-py-btn"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Download app.py</span>
          </button>

          <button
            type="button"
            onClick={() => copyToClipboard(codeContent, "all")}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            id="copy-python-code-btn"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>Copied app.py!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Full app.py Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Terminal Execution Steps */}
      <div className="p-4 bg-[#0b1a24] rounded-xl border border-[#143547] text-slate-100 flex flex-col gap-3 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-black text-cyan-400 uppercase tracking-wider font-mono">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Terminal Quickstart Commands</span>
        </div>

        {/* Step 1 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-black/40 rounded-lg border border-white/10 font-mono text-xs">
          <div className="flex items-center gap-2 text-emerald-300 overflow-x-auto">
            <span className="text-slate-500 select-none">1.</span>
            <span>pip install streamlit plotly pandas</span>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard("pip install streamlit plotly pandas", "pip")}
            className="text-[11px] text-slate-400 hover:text-white px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
          >
            {copiedCommand === "pip" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy</span>
          </button>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-black/40 rounded-lg border border-white/10 font-mono text-xs">
          <div className="flex items-center gap-2 text-cyan-300">
            <span className="text-slate-500 select-none">2.</span>
            <span>streamlit run app.py</span>
          </div>
          <button
            type="button"
            onClick={() => copyToClipboard("streamlit run app.py", "run")}
            className="text-[11px] text-slate-400 hover:text-white px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
          >
            {copiedCommand === "run" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy</span>
          </button>
        </div>
      </div>

      {/* Code Editor Preview */}
      <div className="relative rounded-2xl border border-[#143547] overflow-hidden bg-[#04090e] font-mono text-xs text-slate-200 shadow-2xl">
        <div className="bg-[#0b1a24] px-4 py-3 flex items-center justify-between border-b border-[#143547] text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 font-bold text-slate-200">app.py</span>
          </div>
          <span className="text-cyan-400 font-mono">Python 3.10+ • Streamlit 1.30+ • Sub-50ms SOC Terminal</span>
        </div>

        <pre className="p-4 overflow-x-auto max-h-[520px] leading-relaxed text-[11.5px] text-slate-200 scrollbar-thin">
          <code>{codeContent}</code>
        </pre>
      </div>
    </div>
  );
};
