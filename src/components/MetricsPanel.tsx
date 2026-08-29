import React from 'react';
import { GenerationMetrics } from '../types';
import { 
  Zap, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Cpu, 
  Clock, 
  TrendingUp, 
  Layers,
  Gauge,
  Percent
} from 'lucide-react';

interface MetricsPanelProps {
  metrics: GenerationMetrics;
  mode: 'speculative' | 'standard' | 'demo';
  isRunning: boolean;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({
  metrics,
  mode,
  isRunning
}) => {
  return (
    <div className="rounded-xl border border-pink-200/80 bg-white/95 p-5 space-y-4 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-pink-100 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-pink-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Real-Time Inference Telemetry
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          {isRunning && (
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-pink-600 font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
              </span>
              Streaming...
            </span>
          )}
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-pink-50 border border-pink-200 text-slate-700 font-medium">
            {mode} mode
          </span>
        </div>
      </div>

      {/* Primary Highlights 2x4 Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Metric 1: Speedup Ratio */}
        <div className="p-3.5 rounded-xl border border-pink-200 bg-pink-50/40 shadow-xs">
          <div className="flex items-center justify-between text-slate-700 text-xs">
            <span className="font-semibold">Simulated Speedup</span>
            <TrendingUp className="w-3.5 h-3.5 text-pink-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-pink-600 font-mono">
              {metrics.speedup ? `${metrics.speedup.toFixed(2)}×` : '1.80×'}
            </span>
          </div>
          <p className="mt-1 text-[10px] text-slate-700 font-mono">
            vs. autoregressive
          </p>
        </div>

        {/* Metric 2: Tokens / Second */}
        <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-xs">
          <div className="flex items-center justify-between text-slate-700 text-xs">
            <span className="font-semibold">Tokens / Sec (TPS)</span>
            <Gauge className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono">
              {metrics.tokensPerSecond ? metrics.tokensPerSecond.toFixed(1) : '82.4'}
            </span>
            <span className="text-[11px] text-slate-700 font-mono">tok/s</span>
          </div>
          <p className="mt-1 text-[10px] text-slate-700 font-mono">
            Standard: ~45.8 tok/s
          </p>
        </div>

        {/* Metric 3: Acceptance Rate */}
        <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 shadow-xs">
          <div className="flex items-center justify-between text-slate-700 text-xs">
            <span className="font-semibold">Acceptance Rate (α)</span>
            <Percent className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 font-mono">
              {metrics.acceptanceRate ? `${metrics.acceptanceRate}%` : '81%'}
            </span>
          </div>
          <p className="mt-1 text-[10px] text-slate-700 font-mono">
            Draft accuracy
          </p>
        </div>

        {/* Metric 4: Target Model Calls */}
        <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/40 shadow-xs">
          <div className="flex items-center justify-between text-slate-700 text-xs">
            <span className="font-semibold">Target Model Calls</span>
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-700 font-mono">
              {metrics.targetModelCalls || 0}
            </span>
            <span className="text-[11px] text-slate-700 font-mono">
              / {metrics.totalTokensGenerated || metrics.estimatedStandardCalls || 0} std
            </span>
          </div>
          <p className="mt-1 text-[10px] text-slate-700 font-mono">
            {metrics.estimatedStandardCalls ? `${Math.max(0, metrics.estimatedStandardCalls - metrics.targetModelCalls)} calls saved` : '75% reduction'}
          </p>
        </div>

      </div>

      {/* Secondary Detailed Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-pink-100 font-mono text-xs">
        
        <div className="p-2.5 rounded-lg bg-pink-50/40 border border-pink-100 flex justify-between items-center shadow-xs">
          <span className="text-slate-700 text-[11px]">Draft Proposed:</span>
          <span className="text-pink-700 font-bold">{metrics.draftTokens || 0}</span>
        </div>

        <div className="p-2.5 rounded-lg bg-emerald-50/40 border border-emerald-100 flex justify-between items-center shadow-xs">
          <span className="text-slate-700 text-[11px]">Tokens Accepted:</span>
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {metrics.acceptedTokens || 0}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-rose-50/40 border border-rose-100 flex justify-between items-center shadow-xs">
          <span className="text-slate-700 text-[11px]">Tokens Rejected:</span>
          <span className="text-rose-700 font-bold flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-600" /> {metrics.rejectedTokens || 0}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-pink-50/40 border border-pink-100 flex justify-between items-center shadow-xs">
          <span className="text-slate-700 text-[11px]">Latency:</span>
          <span className="text-pink-700 font-bold flex items-center gap-1">
            <Clock className="w-3 h-3 text-pink-600" /> {metrics.latencyMs || 0} ms
          </span>
        </div>

      </div>

    </div>
  );
};
