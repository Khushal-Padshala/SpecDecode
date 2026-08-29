import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Play, 
  RotateCcw,
  Cpu,
  Layers,
  FastForward
} from 'lucide-react';

interface HeroProps {
  onGoToDemo: () => void;
  onGoToHowItWorks: () => void;
  onTriggerGuidedDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onGoToDemo,
  onGoToHowItWorks,
  onTriggerGuidedDemo
}) => {
  const [animStep, setAnimStep] = useState<number>(0);

  // Cycle the interactive hero token flow animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimStep((prev) => (prev + 1) % 5);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const sampleDraftTokens = [
    { token: 'Quantum', status: 'accepted', confidence: '94%' },
    { token: ' computing', status: 'accepted', confidence: '91%' },
    { token: ' enables', status: 'accepted', confidence: '88%' },
    { token: ' ultra', status: 'rejected', confidence: '62%' },
    { token: ' fast', status: 'pending', confidence: '-' }
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-14 border-b border-pink-100 bg-radial-glow">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-mono font-medium shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Next-Gen LLM Inference Acceleration</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-medium shadow-xs">
            <Cpu className="w-3 h-3 text-rose-500" />
            <span>Target: 70B &bull; Draft: 8B (γ=5)</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
            Supercharge <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500">LLM Inference</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            Speculative Decoding uses a fast draft model to predict multiple tokens while a powerful target model verifies them in parallel — reducing expensive inference steps and delivering up to <strong>2× faster generation</strong> with mathematical equivalence.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              id="hero-try-demo-btn"
              onClick={onGoToDemo}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-sm sm:text-base shadow-md shadow-pink-500/25 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
            >
              <span>Try Live Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-see-how-btn"
              onClick={onGoToHowItWorks}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-pink-50/70 border border-pink-200 text-slate-800 font-semibold text-sm shadow-xs transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-pink-600" />
              <span>See How It Works</span>
            </button>

            <button
              id="hero-guided-tour-btn"
              onClick={onTriggerGuidedDemo}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-pink-50 hover:bg-pink-100/70 border border-pink-200 text-pink-800 font-medium text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-pink-600 text-pink-600" />
              <span>Watch 20s Hackathon Demo</span>
            </button>
          </div>
        </div>

        {/* Interactive Speculative Decoding Animation Flow Banner */}
        <div className="mt-12 max-w-4xl mx-auto rounded-2xl border border-pink-200/80 bg-white/90 p-5 sm:p-7 shadow-lg shadow-pink-500/5 backdrop-blur-sm">
          
          <div className="flex items-center justify-between border-b border-pink-100 pb-3 mb-5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-pink-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Speculative Inference Pipeline (Step-by-Step Flow)
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-700">
                Phase {animStep + 1}/5: {
                  animStep === 0 ? 'User Prompt Input' :
                  animStep === 1 ? 'Fast Draft Model Proposing Tokens' :
                  animStep === 2 ? 'Target Model Parallel Verification' :
                  animStep === 3 ? 'Acceptance / Rejection Resolution' : 'Accelerated Output Emitted'
                }
              </span>
              <button
                onClick={() => setAnimStep((s) => (s + 1) % 5)}
                className="p-1 rounded bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs cursor-pointer"
                title="Next step"
              >
                <FastForward className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Visual Step Container */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center">
            
            {/* Step 1: User Prompt */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              animStep >= 0 ? 'bg-pink-50/60 border-pink-300 text-slate-800 shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              <div className="text-[10px] font-mono uppercase tracking-wider text-pink-700 font-semibold mb-1">
                1. Input Prompt
              </div>
              <div className="text-xs font-mono bg-white px-2 py-1.5 rounded border border-pink-200 text-slate-700 font-medium">
                "Calculate..."
              </div>
              <div className="text-[10px] text-slate-700 mt-1.5">Context Token</div>
            </div>

            {/* Step 2: Draft Model */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              animStep >= 1 ? 'bg-rose-50/70 border-rose-300 shadow-xs text-slate-800' : 'bg-slate-50 border-slate-200 opacity-60'
            }`}>
              <div className="text-[10px] font-mono uppercase tracking-wider text-rose-700 font-semibold mb-1">
                2. Draft (8B)
              </div>
              <div className="text-[11px] font-semibold text-slate-800">
                Proposes γ=5 tokens
              </div>
              <div className="text-[10px] text-rose-600 font-mono mt-1">~3ms / token</div>
            </div>

            {/* Step 3: Candidate Tokens */}
            <div className={`p-3 rounded-xl border transition-all md:col-span-1 ${
              animStep >= 1 ? 'bg-pink-50/40 border-pink-200' : 'bg-slate-50 border-slate-200 opacity-60'
            }`}>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-700 font-semibold mb-1">
                3. Proposed Batch
              </div>
              <div className="flex flex-wrap gap-1 justify-center">
                {sampleDraftTokens.map((t, idx) => (
                  <span
                    key={idx}
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-medium ${
                      animStep >= 3 
                        ? (t.status === 'accepted' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-rose-50 border-rose-300 text-rose-700')
                        : 'bg-white border-pink-200 text-slate-700'
                    }`}
                  >
                    {t.token}
                  </span>
                ))}
              </div>
            </div>

            {/* Step 4: Target Model Verification */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              animStep >= 2 ? 'bg-indigo-50/60 border-indigo-200 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-60'
            }`}>
              <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-700 font-semibold mb-1">
                4. Target (70B)
              </div>
              <div className="text-[11px] font-semibold text-slate-800">
                1 Forward Pass
              </div>
              <div className="text-[10px] text-indigo-600 font-mono mt-1">Parallel Verification</div>
            </div>

            {/* Step 5: Speedup Outcome */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              animStep >= 4 ? 'bg-emerald-50 border-emerald-300 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-60'
            }`}>
              <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-semibold mb-1">
                5. Outcome
              </div>
              <div className="text-sm font-extrabold text-emerald-700 font-mono">
                1.88× Faster
              </div>
              <div className="text-[10px] text-slate-700 mt-1 font-medium">4 accepted + 1 corrected</div>
            </div>

          </div>

          {/* Bottom Visual Acceptance Legend */}
          <div className="mt-4 pt-3 border-t border-pink-100 flex flex-wrap items-center justify-between text-[11px] text-slate-700">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-700 font-mono font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 3 Accepted Tokens
              </span>
              <span className="flex items-center gap-1.5 text-rose-700 font-mono font-medium">
                <XCircle className="w-3.5 h-3.5 text-rose-600" /> 1 Rejected & Replaced
              </span>
            </div>
            <div className="font-mono text-pink-700 text-[11px] font-medium">
              &bull; 1 Target Call instead of 5 Sequential Calls
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
