import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  BookOpen,
  Layers,
  Check,
  X
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = window.setInterval(() => {
        setActiveStep((prev) => (prev + 1) % 4);
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const steps = [
    {
      id: 0,
      title: 'Step 1 — Draft Candidate Generation',
      subtitle: 'The small draft model rapidly predicts several future tokens.',
      tag: 'Fast Autoregression',
      color: 'pink',
      explanation: 'A lightweight draft model (e.g. Llama-3-8B) runs autoregressively for γ=5 iterations. Because small models require drastically less memory bandwidth per step, candidate tokens are generated at near-zero latency (~3ms/token).',
      visual: (
        <div className="p-4 rounded-xl bg-pink-50/80 border border-pink-200/80 space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs text-pink-700">
            <span className="flex items-center gap-1.5 font-bold">
              <Zap className="w-3.5 h-3.5 text-pink-600" /> Draft Model (8B)
            </span>
            <span className="font-semibold">~3ms / step</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {['Quantum', 'superposition', 'enables', 'ultra', 'fast'].map((tok, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-pink-300 text-pink-700 text-xs font-semibold shadow-xs">
                [{tok}]
              </span>
            ))}
          </div>
          <div className="text-[11px] text-slate-700 font-sans">
            5 candidate tokens proposed in ~15ms total draft time.
          </div>
        </div>
      )
    },
    {
      id: 1,
      title: 'Step 2 — Batched Target Verification',
      subtitle: 'The large target model evaluates all proposed tokens simultaneously.',
      tag: 'Single Forward Pass',
      color: 'indigo',
      explanation: 'Instead of evaluating 5 separate target model steps, the large 70B target model processes the entire candidate sequence in a single forward pass. Deep neural networks are computationally parallel on tensor cores, so evaluating 5 tokens simultaneously takes virtually the same time as 1 token.',
      visual: (
        <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs text-indigo-700">
            <span className="flex items-center gap-1.5 font-bold">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" /> Target Model (70B) Parallel Verification
            </span>
            <span className="font-semibold">1 Forward Pass (~28ms)</span>
          </div>
          <div className="grid grid-cols-5 gap-2 pt-1 text-center">
            {['Quantum', 'superposition', 'enables', 'ultra', 'fast'].map((tok, i) => (
              <div key={i} className="p-2 rounded-lg bg-white border border-indigo-200 text-indigo-900 text-xs shadow-xs">
                <div className="text-[10px] text-slate-700 font-mono">P(w_{i})</div>
                <div className="font-bold truncate">{tok}</div>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-indigo-700 font-sans font-medium">
            Parallel tensor verification runs simultaneously across all candidate positions.
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Step 3 — Speculative Acceptance',
      subtitle: 'Correct predictions matching the target distribution are accepted.',
      tag: 'Acceptance Criterion',
      color: 'green',
      explanation: 'The verification algorithm checks candidate tokens against target probability distributions. If Draft Probability satisfies acceptance criteria (via speculative sampling), tokens are accepted with guaranteed mathematical equivalence.',
      visual: (
        <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs text-emerald-800">
            <span className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Probability Verification Test
            </span>
            <span className="font-semibold">Tokens 1, 2, 3 Passed</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="px-3 py-1.5 rounded-lg bg-white border border-emerald-400 text-emerald-800 text-xs font-bold flex items-center gap-1 shadow-xs">
              <Check className="w-3 h-3 text-emerald-600" /> Quantum
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white border border-emerald-400 text-emerald-800 text-xs font-bold flex items-center gap-1 shadow-xs">
              <Check className="w-3 h-3 text-emerald-600" /> superposition
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white border border-emerald-400 text-emerald-800 text-xs font-bold flex items-center gap-1 shadow-xs">
              <Check className="w-3 h-3 text-emerald-600" /> enables
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs">
              ...
            </span>
          </div>
          <div className="text-[11px] text-emerald-700 font-sans font-medium">
            3 tokens accepted instantly from 1 forward pass!
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Step 4 — Rejection & Target Correction',
      subtitle: 'Incorrect predictions are replaced by the target model at zero extra cost.',
      tag: 'Distribution Recovery',
      color: 'rose',
      explanation: 'At the first candidate mismatch, the candidate is discarded. Crucially, the target model already computed the true next-token probability distribution during verification, allowing it to immediately output the exact correct token without an additional model call.',
      visual: (
        <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200 space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs text-rose-800">
            <span className="flex items-center gap-1.5 font-bold">
              <XCircle className="w-3.5 h-3.5 text-rose-600" /> Rejection &amp; Correction Step
            </span>
            <span className="font-semibold">Target Correction Emitted</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="px-2.5 py-1 rounded-lg bg-white border border-rose-300 text-rose-700 text-xs line-through flex items-center gap-1 shadow-xs">
              <X className="w-3 h-3 text-rose-600" /> ultra
            </span>
            <span className="text-slate-700 font-bold">&rarr;</span>
            <span className="px-3 py-1 rounded-lg bg-pink-600 border border-pink-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3 text-pink-200" /> parallel
            </span>
          </div>
          <div className="text-[11px] text-slate-700 font-sans">
            Result: 4 valid output tokens emitted from 1 target verification pass!
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* Header and Interactive Stepper Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-pink-600" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              How Speculative Decoding Works
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 mt-1">
            The mathematical and computational mechanics of lossless inference acceleration.
          </p>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20'
                : 'bg-pink-600 hover:bg-pink-700 text-white shadow-md shadow-pink-500/20'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{isPlaying ? 'Pause Stepper' : 'Play Explanation'}</span>
          </button>

          <button
            onClick={() => { setActiveStep(0); setIsPlaying(false); }}
            className="p-2 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-slate-700 hover:text-slate-900 cursor-pointer"
            title="Reset stepper"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Step Selector Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step) => {
          const isCurrent = activeStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => { setActiveStep(step.id); setIsPlaying(false); }}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer shadow-xs ${
                isCurrent
                  ? 'bg-pink-50/90 border-pink-400 shadow-sm ring-1 ring-pink-400/40'
                  : 'bg-white border-pink-100 hover:border-pink-300 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className={`px-2 py-0.5 rounded font-bold ${
                  isCurrent ? 'bg-pink-600 text-white' : 'bg-pink-100 text-pink-700'
                }`}>
                  0{step.id + 1}
                </span>
                <span className="text-[10px] text-slate-700 font-medium">{step.tag}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 leading-snug">
                {step.title}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Active Step Deep Dive Card */}
      <div className="rounded-2xl border border-pink-200/80 bg-white/95 p-6 sm:p-8 space-y-6 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-100 pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-pink-600 font-bold">
              Deep Dive &bull; Phase {activeStep + 1} of 4
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              {steps[activeStep].title}
            </h3>
            <p className="text-sm text-slate-700 mt-1">
              {steps[activeStep].subtitle}
            </p>
          </div>
        </div>

        {/* Interactive Visual Demonstration Box */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-700 font-mono">
            Pipeline Visual State:
          </div>
          {steps[activeStep].visual}
        </div>

        {/* Detailed Mathematical & Engineering Explanation */}
        <div className="p-4 rounded-xl bg-pink-50/60 border border-pink-200/70 space-y-2">
          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            Engineering Details:
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
            {steps[activeStep].explanation}
          </p>
        </div>

        {/* Next Step Nav Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => setActiveStep((prev) => (prev + 1) % 4)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-pink-50 hover:bg-pink-100 border border-pink-200 text-xs font-semibold text-slate-800 hover:text-pink-700 transition-colors cursor-pointer"
          >
            <span>Next Step ({((activeStep + 1) % 4) + 1}/4)</span>
            <ArrowRight className="w-3.5 h-3.5 text-pink-600" />
          </button>
        </div>

      </div>

    </div>
  );
};
