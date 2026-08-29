import React, { useState } from 'react';
import { CentralBenchmarkData } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  LineChart,
  Line
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Cpu, 
  Zap, 
  AlertCircle, 
  Layers, 
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';

interface BenchmarkChartProps {
  data: CentralBenchmarkData;
}

export const BenchmarkChart: React.FC<BenchmarkChartProps> = ({ data }) => {
  const [metricTab, setMetricTab] = useState<'tps' | 'calls' | 'latency'>('tps');

  const barChartData = data.comparisonSeries.map((item) => ({
    name: item.category,
    'Standard (70B)': item.standardSpeed,
    'Speculative (70B+8B)': item.speculativeSpeed,
    'Acceptance %': item.acceptanceRate,
    'Speedup': item.speedup
  }));

  const latencyChartData = data.comparisonSeries.map((item) => ({
    name: item.category,
    'Standard Latency (ms)': Math.round((100 / item.standardSpeed) * 1000),
    'Speculative Latency (ms)': Math.round((100 / item.speculativeSpeed) * 1000)
  }));

  const targetCallsData = data.comparisonSeries.map((item) => ({
    name: item.category,
    'Standard Calls': 100,
    'Speculative Calls': Math.round(100 / item.speedup)
  }));

  return (
    <div className="space-y-8">
      
      {/* Top Highlight Banner */}
      <div className="rounded-2xl border border-pink-200/80 bg-gradient-to-r from-pink-50 via-white to-pink-50/50 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100/70 border border-pink-300 text-pink-700 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            <span>Empirical Inference Evaluation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Speculative Decoding achieved <span className="text-pink-600">1.8× simulated speedup</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 max-w-xl">
            Across 5 diverse task distributions (Python coding, math proofs, reasoning, and summarization) with an average draft acceptance rate of <strong>81.0%</strong>.
          </p>
        </div>

        {/* Circular Gauge / Progress Box for Acceptance Rate */}
        <div className="shrink-0 p-5 rounded-2xl bg-white border border-pink-200 text-center space-y-2 w-48 shadow-xs">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-700 font-medium">
            Token Acceptance Rate (α)
          </div>
          <div className="text-4xl font-extrabold text-emerald-700 font-mono">
            {data.overviewMetrics.acceptanceRate}%
          </div>
          <div className="w-full bg-pink-100/80 h-2 rounded-full overflow-hidden border border-pink-200/60">
            <div 
              className="bg-gradient-to-r from-pink-500 to-rose-500 h-full rounded-full"
              style={{ width: `${data.overviewMetrics.acceptanceRate}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-700 font-mono">
            Optimal operating range: 75%–85%
          </p>
        </div>
      </div>

      {/* Main Bar Chart: Standard vs Speculative across Categories */}
      <div className="rounded-2xl border border-pink-200/80 bg-white/95 p-6 space-y-5 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-pink-600" />
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Benchmark Comparison Across Workloads
              </h3>
            </div>
            <p className="text-xs text-slate-700 mt-0.5">
              Evaluating throughput and computational savings across diverse prompt categories.
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-pink-50/70 border border-pink-200 text-xs font-mono">
            <button
              onClick={() => setMetricTab('tps')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                metricTab === 'tps' ? 'bg-pink-600 text-white font-bold shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Throughput (Tokens/s)
            </button>
            <button
              onClick={() => setMetricTab('calls')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                metricTab === 'calls' ? 'bg-pink-600 text-white font-bold shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Target Calls
            </button>
            <button
              onClick={() => setMetricTab('latency')}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                metricTab === 'latency' ? 'bg-pink-600 text-white font-bold shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Total Latency (ms)
            </button>
          </div>
        </div>

        {/* Recharts Container */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {metricTab === 'tps' ? (
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" opacity={0.8} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" t/s" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#fbcfe8', borderRadius: '8px', color: '#1e293b', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Bar dataKey="Standard (70B)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Speculative (70B+8B)" fill="#db2777" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : metricTab === 'calls' ? (
              <BarChart data={targetCallsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" opacity={0.8} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#fbcfe8', borderRadius: '8px', color: '#1e293b', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Bar dataKey="Standard Calls" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Speculative Calls" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <BarChart data={latencyChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" opacity={0.8} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" ms" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#fbcfe8', borderRadius: '8px', color: '#1e293b', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Bar dataKey="Standard Latency (ms)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Speculative Latency (ms)" fill="#db2777" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

      </div>

      {/* Two Column Grid: Time-Series Line Chart + Gamma Ablation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Line Chart: Generation Speed Over Time */}
        <div className="rounded-2xl border border-pink-200/80 bg-white/95 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-pink-100 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Generation Speed Over Sequence Length
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-700 font-medium">Tokens vs. Time (ms)</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.timeSeriesSpeed} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" opacity={0.8} />
                <XAxis dataKey="tokenCount" stroke="#64748b" tick={{ fontSize: 11 }} unit=" tok" />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" ms" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#fbcfe8', borderRadius: '8px', color: '#1e293b', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="standardTimeMs" name="Standard (70B)" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="speculativeTimeMs" name="Speculative (70B+8B)" stroke="#db2777" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-700">
            Speculative decoding maintains consistent slope divergence, delivering larger cumulative latency gains over long contexts.
          </p>
        </div>

        {/* Draft Length (Gamma) Ablation Curve */}
        <div className="rounded-2xl border border-pink-200/80 bg-white/95 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-pink-100 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-pink-600" />
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Draft Tokens (γ) vs. Effective Speedup
              </h3>
            </div>
            <span className="text-[11px] font-mono text-pink-700 font-bold">Optimal γ = 5</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.gammaAblation} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" opacity={0.8} />
                <XAxis dataKey="gamma" stroke="#64748b" tick={{ fontSize: 11 }} label={{ value: 'Draft Length (γ)', position: 'insideBottom', offset: -4, fill: '#64748b', fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0.8, 2.2]} unit="×" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#fbcfe8', borderRadius: '8px', color: '#1e293b', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="speedup" name="Speedup (×)" stroke="#db2777" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-700">
            Speedup peaks at γ=5. Beyond γ=6, diminished token acceptance probability introduces verification overhead.
          </p>
        </div>

      </div>

      {/* Model Pairing Matrix Table */}
      <div className="rounded-2xl border border-pink-200/80 bg-white/95 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-pink-100 pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-pink-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Production Target / Draft Model Combinations
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-700 font-medium">Empirical LLM Pairs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-pink-200 text-slate-700 text-[11px]">
                <th className="pb-2 font-semibold">Model Pair</th>
                <th className="pb-2 font-semibold">Target Model</th>
                <th className="pb-2 font-semibold">Draft Model</th>
                <th className="pb-2 font-semibold">Simulated Speedup</th>
                <th className="pb-2 font-semibold">Draft Acceptance (α)</th>
                <th className="pb-2 font-semibold">Draft VRAM Overhead</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-100 text-slate-700">
              {data.modelPairs.map((pair, idx) => (
                <tr key={idx} className="hover:bg-pink-50/50">
                  <td className="py-2.5 font-bold text-pink-700">{pair.pairName}</td>
                  <td className="py-2.5 text-slate-900">{pair.target}</td>
                  <td className="py-2.5 text-rose-700">{pair.draft}</td>
                  <td className="py-2.5 font-bold text-emerald-700">{pair.speedup}</td>
                  <td className="py-2.5 text-slate-800">{pair.acceptanceRate}</td>
                  <td className="py-2.5 text-slate-700">{pair.vramMb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 flex items-start gap-3 text-xs text-amber-900 shadow-xs">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Disclaimer:</strong> Demo values are simulated based on standard speculative decoding benchmarks (Leviathan et al., Chen et al.). Real performance depends on model architecture, hardware (GPU memory bandwidth & tensor cores), batch size, sequence length, and draft-model alignment quality.
        </p>
      </div>

    </div>
  );
};
