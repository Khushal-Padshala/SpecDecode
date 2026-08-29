import React from 'react';
import { PageTab } from '../types';
import { TechnicalCards } from '../components/TechnicalCards';
import { 
  FileCode, 
  Server, 
  Cpu, 
  Sparkles, 
  HelpCircle, 
  ExternalLink, 
  Layers, 
  Zap, 
  BookOpen 
} from 'lucide-react';

interface AboutDetailsProps {
  onTabChange: (tab: PageTab) => void;
}

export const AboutDetails: React.FC<AboutDetailsProps> = ({ onTabChange }) => {
  const faqs = [
    {
      q: 'Does speculative decoding alter or degrade model output quality?',
      a: 'No. Speculative decoding is proven to be strictly lossless (Leviathan et al., 2023). Because the target model evaluates the exact joint probability distribution, any rejected tokens are replaced with samples drawn from the target distribution. The final output is mathematically indistinguishable from running standard target-model generation.'
    },
    {
      q: 'What is the optimal draft length (γ)?',
      a: 'In most production configurations, γ=4 to γ=6 is optimal. Lower γ values leave throughput on the table, while excessively high γ values (γ>8) suffer from decaying acceptance probabilities and wasted draft compute.'
    },
    {
      q: 'Can any small model be used as a draft model?',
      a: 'Yes, provided both models share the same tokenizer vocabulary. Draft models trained on similar pretraining corpora (e.g. Llama-3-70B with Llama-3-8B) achieve the highest draft acceptance rates (80%+).'
    },
    {
      q: 'How can another developer connect a real speculative decoding backend?',
      a: 'The frontend is designed with a clean API abstraction in `src/services/api.ts`. Backend developers simply replace the simulation controller with real streaming SSE/WebSocket endpoints connected to vLLM, TensorRT-LLM, or Hugging Face TGI.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-pink-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-pink-100 border border-pink-300 text-pink-600 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Technical Specifications &amp; Research Foundations
              </h1>
              <p className="text-xs sm:text-sm text-slate-700 mt-0.5">
                Scientific background, developer guidelines, and architectural specifications for SpecDecode.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Core Concepts Cards */}
      <TechnicalCards />

      {/* 2. Developer Backend Integration Guide */}
      <div className="rounded-2xl border border-pink-200 bg-white/95 p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-pink-700 font-bold font-mono text-sm">
          <FileCode className="w-4 h-4 text-pink-600" />
          <span>Developer API Integration Blueprint (`src/services/api.ts`)</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          This frontend application isolates all inference logic into a clean asynchronous interface. When ready to connect real GPU hardware, update <code className="text-pink-700 font-mono font-semibold">src/services/api.ts</code>:
        </p>

        <div className="rounded-xl bg-pink-50/60 border border-pink-200 p-4 font-mono text-xs text-slate-800 space-y-2 overflow-x-auto">
          <div className="text-slate-500">// Example integration hook with vLLM speculative decoding API</div>
          <div className="text-slate-800">
            {`async function runSpeculativeDecoding(req: DecodingRequest) {
  const response = await fetch('/api/v1/speculative-inference', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: req.prompt,
      model: req.config.targetModelId,
      speculative_model: req.config.draftModelId,
      num_speculative_tokens: req.config.gammaDraftTokens,
      temperature: req.config.temperature
    })
  });
  return handleStreamingTokens(response);
}`}
          </div>
        </div>
      </div>

      {/* 3. Frequently Asked Questions */}
      <div className="rounded-2xl border border-pink-200/80 bg-white/95 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-2 border-b border-pink-100 pb-4">
          <HelpCircle className="w-5 h-5 text-pink-600" />
          <h3 className="text-lg font-bold text-slate-900">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-pink-50/40 border border-pink-200/70 space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 leading-snug">
                {faq.q}
              </h4>
              <p className="text-slate-700 leading-relaxed font-sans">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Research References */}
      <div className="rounded-xl border border-pink-200/80 bg-white p-5 space-y-3 text-xs text-slate-700 shadow-xs">
        <div className="font-bold text-slate-900 font-mono text-xs uppercase tracking-wider">
          Primary Research Citations
        </div>
        <ul className="space-y-2 font-mono text-[11px] list-disc list-inside text-slate-700">
          <li>
            <strong>Leviathan et al. (2023)</strong>: <em>"Fast Inference from Large Language Models via Speculative Decoding"</em> — ICML 2023.
          </li>
          <li>
            <strong>Chen et al. (2023)</strong>: <em>"Accelerating Large Language Model Decoding with Speculative Sampling"</em> — arXiv:2302.01318.
          </li>
          <li>
            <strong>Miao et al. (2024)</strong>: <em>"SpecInfer: Accelerating Generative LLM Serving with Tree-based Speculative Inference and Verification"</em> — ASPLOS 2024.
          </li>
        </ul>
      </div>

    </div>
  );
};
