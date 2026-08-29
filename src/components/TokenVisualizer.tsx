import React, { useState } from 'react';
import { TokenItem, TokenStatus } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  CircleDot, 
  Sparkles, 
  Info,
  Layers,
  ArrowRight,
  Zap,
  Cpu
} from 'lucide-react';

interface TokenVisualizerProps {
  currentBatch: TokenItem[];
  allTokens: TokenItem[];
  phase: string;
  logMessage: string;
  activeBatchIndex: number;
  gamma: number;
}

export const TokenVisualizer: React.FC<TokenVisualizerProps> = ({
  currentBatch,
  allTokens,
  phase,
  logMessage,
  activeBatchIndex,
  gamma
}) => {
  const [selectedToken, setSelectedToken] = useState<TokenItem | null>(null);

  const getStatusBadge = (status: TokenStatus) => {
    switch (status) {
      case 'accepted':
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs font-semibold',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
          label: 'Accepted'
        };
      case 'rejected':
        return {
          bg: 'bg-rose-50 border-rose-300 text-rose-800 shadow-xs line-through opacity-80',
          icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
          label: 'Rejected'
        };
      case 'corrected':
        return {
          bg: 'bg-indigo-50 border-indigo-300 text-indigo-800 shadow-xs font-bold',
          icon: <Sparkles className="w-3.5 h-3.5 text-indigo-600" />,
          label: 'Target Corrected'
        };
      case 'verifying':
        return {
          bg: 'bg-pink-50 border-pink-300 text-pink-800 animate-pulse',
          icon: <Loader2 className="w-3.5 h-3.5 text-pink-600 animate-spin" />,
          label: 'Verifying'
        };
      case 'drafted':
      case 'pending':
      default:
        return {
          bg: 'bg-pink-50/70 border-pink-200 text-pink-800 font-medium',
          icon: <CircleDot className="w-3.5 h-3.5 text-pink-600" />,
          label: 'Draft Candidate'
        };
    }
  };

  return (
    <div className="rounded-xl border border-pink-200/80 bg-white/95 p-5 space-y-4 shadow-sm">
      
      {/* Header with Title and Phase status */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-pink-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-pink-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Live Token Pipeline: Draft &rarr; Verify &rarr; Accept / Reject
            </h3>
          </div>
          <p className="text-[11px] text-slate-700 mt-0.5">
            Watch candidate tokens proposed by the draft model verified in parallel by the target model.
          </p>
        </div>

        {/* Phase Badge */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono uppercase px-2.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-slate-800 font-medium flex items-center gap-1.5 shadow-xs">
            {phase === 'drafting' && <Zap className="w-3 h-3 text-pink-600 animate-bounce" />}
            {phase === 'verifying' && <Cpu className="w-3 h-3 text-indigo-600 animate-spin" />}
            {phase === 'accepting' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
            {phase === 'idle' && <CircleDot className="w-3 h-3 text-slate-400" />}
            <span>Phase: <strong className="text-pink-600">{phase.toUpperCase()}</strong></span>
          </span>
        </div>
      </div>

      {/* Real-time Step Log Message */}
      <div className="rounded-lg bg-pink-50/40 border border-pink-100 px-3.5 py-2 font-mono text-xs text-slate-800 flex items-start gap-2">
        <span className="text-pink-600 shrink-0 font-bold">&gt;</span>
        <span className="leading-relaxed">{logMessage || 'Ready to begin speculative decoding sequence.'}</span>
      </div>

      {/* Active Speculative Batch Window (Current Step) */}
      <div className="rounded-xl border border-pink-200 bg-gradient-to-b from-pink-50/50 to-white p-4 space-y-2 shadow-xs">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-pink-800 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-pink-600" />
            Active Batch #{activeBatchIndex > 0 ? activeBatchIndex : 1} (Speculative Window γ={gamma})
          </span>
          <span className="font-mono text-[10px] text-slate-700">
            {currentBatch.length} tokens in current evaluation
          </span>
        </div>

        {/* Tokens in Active Batch */}
        <div className="flex flex-wrap gap-2 pt-2 min-h-[52px] items-center">
          {currentBatch.length === 0 ? (
            <div className="text-xs text-slate-700 font-mono italic">
              Awaiting next speculative proposal batch...
            </div>
          ) : (
            currentBatch.map((tok) => {
              const badge = getStatusBadge(tok.status);
              return (
                <button
                  key={tok.id}
                  onClick={() => setSelectedToken(tok)}
                  className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all transform hover:scale-105 cursor-pointer ${badge.bg}`}
                >
                  {badge.icon}
                  <span className="font-semibold">{tok.token}</span>
                  {tok.correctedFrom && (
                    <span className="text-[10px] text-slate-700 ml-1 font-normal">
                      (replacing {tok.correctedFrom})
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Historical Generated Tokens Stream */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-700">
          <span className="font-semibold text-slate-800">
            Generated Token Stream ({allTokens.length} total tokens processed):
          </span>
          <span className="text-[10px] font-mono text-slate-700">
            Click any token to inspect verification telemetry
          </span>
        </div>

        <div className="max-h-48 overflow-y-auto rounded-lg border border-pink-100 bg-pink-50/20 p-3 flex flex-wrap gap-1.5 content-start">
          {allTokens.length === 0 ? (
            <span className="text-xs text-slate-700 font-mono italic">
              No tokens emitted yet. Click "Run Speculative Decoding" to observe token-by-token verification.
            </span>
          ) : (
            allTokens.map((tok) => {
              const badge = getStatusBadge(tok.status);
              return (
                <button
                  key={tok.id}
                  onClick={() => setSelectedToken(tok)}
                  title={`${badge.label}: ${tok.token}`}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-mono border transition-all cursor-pointer ${badge.bg}`}
                >
                  <span className="text-[10px] opacity-85">{badge.icon}</span>
                  <span>{tok.token}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Interactive Token Inspection Modal / Drawer */}
      {selectedToken && (
        <div className="rounded-lg border border-pink-300 bg-white p-3.5 text-xs space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-bold text-pink-700 flex items-center gap-1.5 font-mono">
              <Info className="w-3.5 h-3.5 text-pink-600" /> Token Telemetry: '{selectedToken.token}'
            </span>
            <button
              onClick={() => setSelectedToken(null)}
              className="text-slate-700 hover:text-slate-900 text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
            <div className="p-2 rounded bg-pink-50/50 border border-pink-100">
              <div className="text-slate-700 text-[10px]">Status</div>
              <div className="font-bold text-slate-900 capitalize">{selectedToken.status}</div>
            </div>
            <div className="p-2 rounded bg-pink-50/50 border border-pink-100">
              <div className="text-slate-700 text-[10px]">Proposed By</div>
              <div className="font-bold text-pink-700">{selectedToken.model === 'corrected' ? 'Target (Correction)' : 'Draft Model'}</div>
            </div>
            <div className="p-2 rounded bg-pink-50/50 border border-pink-100">
              <div className="text-slate-700 text-[10px]">Confidence</div>
              <div className="font-bold text-emerald-700">{selectedToken.confidence ? `${Math.round(selectedToken.confidence * 100)}%` : '92%'}</div>
            </div>
            <div className="p-2 rounded bg-pink-50/50 border border-pink-100">
              <div className="text-slate-700 text-[10px]">Batch ID</div>
              <div className="font-bold text-pink-600">#{selectedToken.batchId || 1}</div>
            </div>
          </div>
        </div>
      )}

      {/* Visual Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-pink-100 text-xs">
        <div className="flex flex-wrap items-center gap-3 text-slate-700 font-mono text-[11px]">
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Accepted Token
          </span>
          <span className="flex items-center gap-1 text-rose-700 font-medium">
            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Rejected Token
          </span>
          <span className="flex items-center gap-1 text-indigo-700 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Target Corrected
          </span>
          <span className="flex items-center gap-1 text-pink-700 font-medium">
            <Loader2 className="w-3.5 h-3.5 text-pink-600" /> Verifying
          </span>
          <span className="flex items-center gap-1 text-pink-800 font-medium">
            <CircleDot className="w-3.5 h-3.5 text-pink-600" /> Draft Proposed
          </span>
        </div>
      </div>

    </div>
  );
};
