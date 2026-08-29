import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  X, 
  Zap, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Activity, 
  Check, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface DemoModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToPlayground: () => void;
}

export const DemoModeModal: React.FC<DemoModeModalProps> = ({
  isOpen,
  onClose,
  onJumpToPlayground
}) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) {
      setSeconds(0);
      return;
    }

    let interval: number;
    if (isPlaying && seconds < 20) {
      interval = window.setInterval(() => {
        setSeconds((prev) => {
          if (prev >= 20) {
            setIsPlaying(false);
            return 20;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, isPlaying, seconds]);

  if (!isOpen) return null;

  const restartDemo = () => {
    setSeconds(0);
    setIsPlaying(true);
  };

  // Determine stage based on elapsed seconds (0 to 20s)
  const isStage1 = seconds >= 0 && seconds < 2;    // Initializing
  const isStage2 = seconds >= 2 && seconds < 6;    // Draft generating
  const isStage3 = seconds >= 6 && seconds < 10;   // Target verifying
  const isStage4 = seconds >= 10 && seconds < 13;  // Accepted / rejected
  const isStage5 = seconds >= 13 && seconds < 16;  // Metrics updating
  const isStage6 = seconds >= 16;                  // Final result complete

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-2xl border border-pink-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-pink-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-100/80 border border-pink-300 flex items-center justify-center text-pink-600 shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Hackathon 20-Second Guided Demo
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-50 text-pink-700 border border-pink-200 font-bold">
                  {seconds}s / 20s
                </span>
              </div>
              <p className="text-xs text-slate-700">
                Automated 6-stage walkthrough of speculative inference.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-pink-50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-pink-100 h-2 rounded-full overflow-hidden border border-pink-200">
          <div
            className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 h-full transition-all duration-1000"
            style={{ width: `${(seconds / 20) * 100}%` }}
          />
        </div>

        {/* Dynamic Stage Display Container */}
        <div className="min-h-[220px] rounded-xl border border-pink-100 bg-pink-50/30 p-6 flex flex-col justify-center text-center space-y-4">
          
          {/* Stage 1 (0-2s): Initializing */}
          {isStage1 && (
            <div className="space-y-3 animate-in fade-in">
              <div className="inline-flex p-3 rounded-full bg-pink-100 border border-pink-300 text-pink-600 animate-pulse">
                <Cpu className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Initializing Models &amp; Unified GPU Memory...</h4>
              <p className="text-xs text-slate-700 font-mono">
                Target Model: Llama-3-70B &bull; Draft Model: Llama-3-8B (γ=5)
              </p>
            </div>
          )}

          {/* Stage 2 (2-6s): Draft Generation */}
          {isStage2 && (
            <div className="space-y-3 animate-in fade-in">
              <div className="inline-flex p-2.5 rounded-full bg-pink-100 border border-pink-300 text-pink-600">
                <Zap className="w-6 h-6 animate-bounce" />
              </div>
              <h4 className="text-base font-bold text-pink-700">Phase 1: Draft Model Generates 5 Candidate Tokens</h4>
              <div className="flex flex-wrap justify-center gap-2 font-mono text-xs">
                {['Neural', 'networks', 'learn', 'from', 'patterns'].map((t, idx) => (
                  <span key={idx} className="px-3 py-1 rounded bg-white border border-pink-300 text-pink-700 font-semibold shadow-xs animate-pulse">
                    [{t}]
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-700 font-mono">
                Rapid autoregression &bull; ~3ms per token &bull; Total draft time: 15ms
              </p>
            </div>
          )}

          {/* Stage 3 (6-10s): Target Verification */}
          {isStage3 && (
            <div className="space-y-3 animate-in fade-in">
              <div className="inline-flex p-2.5 rounded-full bg-indigo-100 border border-indigo-300 text-indigo-600">
                <Cpu className="w-6 h-6 animate-spin" />
              </div>
              <h4 className="text-base font-bold text-indigo-700">Phase 2: Target Model (70B) Verifies All 5 Tokens in Parallel</h4>
              <div className="grid grid-cols-5 gap-2 max-w-md mx-auto font-mono text-xs">
                {['Neural', 'networks', 'learn', 'from', 'patterns'].map((t, idx) => (
                  <div key={idx} className="p-2 rounded bg-white border border-indigo-200 text-indigo-900 shadow-xs">
                    <div className="text-[9px] text-slate-700">P(tok)</div>
                    <div className="font-bold truncate">{t}</div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-indigo-700 font-mono font-medium">
                1 Single Target Forward Pass instead of 5 Sequential Passes!
              </p>
            </div>
          )}

          {/* Stage 4 (10-13s): Accepted / Rejected States */}
          {isStage4 && (
            <div className="space-y-3 animate-in fade-in">
              <div className="inline-flex p-2.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-emerald-700">Phase 3: Acceptance &amp; Correction Resolution</h4>
              <div className="flex flex-wrap justify-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-1 rounded bg-white border border-emerald-400 text-emerald-800 flex items-center gap-1 font-bold shadow-xs">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Neural
                </span>
                <span className="px-2.5 py-1 rounded bg-white border border-emerald-400 text-emerald-800 flex items-center gap-1 font-bold shadow-xs">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> networks
                </span>
                <span className="px-2.5 py-1 rounded bg-white border border-emerald-400 text-emerald-800 flex items-center gap-1 font-bold shadow-xs">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> learn
                </span>
                <span className="px-2.5 py-1 rounded bg-white border border-emerald-400 text-emerald-800 flex items-center gap-1 font-bold shadow-xs">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> from
                </span>
                <span className="px-2.5 py-1 rounded bg-white border border-rose-300 text-rose-700 line-through shadow-xs">
                  patterns
                </span>
                <span className="px-2.5 py-1 rounded bg-pink-600 border border-pink-700 text-white font-bold flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-pink-200" /> data.
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 font-mono font-medium">
                4 Draft Tokens Accepted + 1 Target Correction = 5 Tokens Emitted
              </p>
            </div>
          )}

          {/* Stage 5 (13-16s): Metrics Update */}
          {isStage5 && (
            <div className="space-y-3 animate-in fade-in">
              <div className="inline-flex p-2.5 rounded-full bg-pink-100 border border-pink-300 text-pink-600">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-pink-700">Phase 4: Telemetry &amp; Throughput Computation</h4>
              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto font-mono text-center">
                <div className="p-2 rounded bg-white border border-pink-200 shadow-xs">
                  <div className="text-[10px] text-slate-700">Throughput</div>
                  <div className="text-lg font-bold text-emerald-700">82.4 t/s</div>
                </div>
                <div className="p-2 rounded bg-white border border-pink-200 shadow-xs">
                  <div className="text-[10px] text-slate-700">Acceptance (α)</div>
                  <div className="text-lg font-bold text-pink-700">81%</div>
                </div>
                <div className="p-2 rounded bg-white border border-pink-200 shadow-xs">
                  <div className="text-[10px] text-slate-700">Target Calls</div>
                  <div className="text-lg font-bold text-indigo-700">20</div>
                </div>
              </div>
            </div>
          )}

          {/* Stage 6 (16-20s): Final Results */}
          {isStage6 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Simulation Complete</span>
              </div>
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto font-mono text-center">
                <div className="p-3 rounded-xl bg-white border border-pink-200 shadow-xs">
                  <div className="text-[10px] text-slate-700 uppercase">Simulated Speedup</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-pink-700">1.8×</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-pink-200 shadow-xs">
                  <div className="text-[10px] text-slate-700 uppercase">Acceptance Rate</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-pink-700">81%</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-pink-200 shadow-xs">
                  <div className="text-[10px] text-slate-700 uppercase">Target Calls</div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-indigo-700">20</div>
                </div>
              </div>
              <p className="text-xs text-slate-700 font-sans">
                Speculative decoding successfully reduced target-model forward passes from 100 to 20 with zero loss in output quality.
              </p>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={restartDemo}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-pink-600" />
            <span>Replay Demo</span>
          </button>

          <button
            onClick={() => { onClose(); onJumpToPlayground(); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-pink-500/20 transition-all cursor-pointer"
          >
            <span>Open Interactive Playground</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
