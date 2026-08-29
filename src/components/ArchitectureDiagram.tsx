import React, { useState } from 'react';
import { 
  User, 
  Monitor, 
  Server, 
  Zap, 
  Cpu, 
  Shuffle, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Activity,
  Layers,
  Sparkles,
  Database,
  ArrowDown
} from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string>('decoder');

  const nodes = [
    {
      id: 'user',
      title: 'User Client',
      role: 'Prompt Submission & Token Streaming',
      icon: <User className="w-5 h-5 text-pink-600" />,
      desc: 'Dispatches prompts to the inference engine and receives streaming accelerated tokens in real-time.',
      specs: 'WebSocket / SSE Stream • React SPA'
    },
    {
      id: 'frontend',
      title: 'React Visualizer',
      role: 'UI & Telemetry State Engine',
      icon: <Monitor className="w-5 h-5 text-pink-600" />,
      desc: 'Controls sampling temperature, batch draft lengths (γ), and renders token-by-token verification diagnostics.',
      specs: 'Client State Manager • Framer & CSS Motion'
    },
    {
      id: 'gateway',
      title: 'API Gateway',
      role: 'Inference Orchestrator',
      icon: <Server className="w-5 h-5 text-indigo-600" />,
      desc: 'Routes requests to the unified GPU memory cluster hosting both the target and draft model weights.',
      specs: 'gRPC / REST Gateway • PagedAttention Manager'
    },
    {
      id: 'draft',
      title: 'Draft Model Engine (8B)',
      role: 'Candidate Token Proposer',
      icon: <Zap className="w-5 h-5 text-pink-600" />,
      desc: 'Executes rapid autoregression to generate γ candidate tokens with minimal memory bandwidth consumption.',
      specs: '8B Parameters • ~3ms per token proposal'
    },
    {
      id: 'target',
      title: 'Target Model Verifier (70B)',
      role: 'Ground Truth Parallel Verifier',
      icon: <Cpu className="w-5 h-5 text-indigo-600" />,
      desc: 'Evaluates entire draft candidate sequences in a single batched tensor forward pass on GPU tensor cores.',
      specs: '70B Parameters • 1 Forward Pass (~28ms)'
    },
    {
      id: 'decoder',
      title: 'Speculative Decoder & Verifier',
      role: 'Distribution Alignment Algorithm',
      icon: <Shuffle className="w-5 h-5 text-emerald-600" />,
      desc: 'Performs speculative sampling: accept tokens where P_target(x) >= P_draft(x); reject and resample otherwise.',
      specs: 'Zero-Quality-Loss Theorem (Leviathan 2023)'
    },
    {
      id: 'accepted',
      title: 'Accepted Tokens Buffer',
      role: 'KV-Cache Append',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      desc: 'Draft tokens that passed target verification are committed directly to the persistent KV Cache.',
      specs: '81% Average Acceptance Rate (α)'
    },
    {
      id: 'rejected',
      title: 'Correction & Fallback',
      role: 'Target Distribution Resampler',
      icon: <XCircle className="w-5 h-5 text-rose-600" />,
      desc: 'Rejected tokens are trimmed from the speculative tree, replaced immediately with target model samples.',
      specs: 'Zero extra target calls required'
    },
    {
      id: 'output',
      title: 'Final Output & Telemetry',
      role: 'Accelerated Token Stream',
      icon: <Activity className="w-5 h-5 text-pink-600" />,
      desc: 'Emits complete verified token stream with live latency, TPS throughput, and speedup metrics.',
      specs: '1.8× Effective Throughput Speedup'
    }
  ];

  const selectedNodeInfo = nodes.find(n => n.id === activeNode) || nodes[5];

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-pink-600" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              SpecDecode System Architecture
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 mt-1">
            End-to-end tensor pipeline from draft candidate generation to parallel target verification.
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded-full bg-pink-100/70 border border-pink-300 text-pink-700 font-medium">
          ● Interactive Architecture Node Inspector
        </span>
      </div>

      {/* Main Visual Node Diagram Container */}
      <div className="relative rounded-2xl border border-pink-200/80 bg-white/95 p-6 sm:p-8 overflow-hidden shadow-sm">
        
        {/* Animated Background Flow Paths */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto space-y-6">
          
          {/* Layer 1: Client & Frontend */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <button
              onClick={() => setActiveNode('user')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer shadow-xs ${
                activeNode === 'user'
                  ? 'bg-pink-50 border-pink-400 shadow-sm'
                  : 'bg-white border-pink-100 hover:border-pink-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-50 border border-pink-200">
                  <User className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-pink-700 font-bold">1. Client Layer</div>
                  <h4 className="text-sm font-bold text-slate-900">User Prompt Input</h4>
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveNode('frontend')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer shadow-xs ${
                activeNode === 'frontend'
                  ? 'bg-pink-50 border-pink-400 shadow-sm'
                  : 'bg-white border-pink-100 hover:border-pink-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-50 border border-pink-200">
                  <Monitor className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-pink-700 font-bold">2. Dashboard Layer</div>
                  <h4 className="text-sm font-bold text-slate-900">React SpecDecode UI</h4>
                </div>
              </div>
            </button>

          </div>

          {/* Flow Connector Arrow */}
          <div className="flex justify-center text-pink-500">
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>

          {/* Layer 2: API Gateway */}
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setActiveNode('gateway')}
              className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer shadow-xs ${
                activeNode === 'gateway'
                  ? 'bg-pink-50 border-pink-400 shadow-sm'
                  : 'bg-white border-pink-100 hover:border-pink-300'
              }`}
            >
              <div className="flex items-center gap-3 justify-center text-center">
                <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200">
                  <Server className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-indigo-700 font-bold">3. Orchestrator</div>
                  <h4 className="text-sm font-bold text-slate-900">API Gateway &amp; Shared GPU Memory</h4>
                </div>
              </div>
            </button>
          </div>

          {/* Flow Connector Split */}
          <div className="flex justify-center text-pink-400">
            <ArrowDown className="w-5 h-5" />
          </div>

          {/* Layer 3: Dual Models (Draft + Target) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Draft Model */}
            <button
              onClick={() => setActiveNode('draft')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer shadow-xs ${
                activeNode === 'draft'
                  ? 'bg-pink-50 border-pink-400 shadow-sm'
                  : 'bg-white border-pink-100 hover:border-pink-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-100/80 border border-pink-300">
                  <Zap className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-pink-700 font-bold">Draft Model (8B)</div>
                  <h4 className="text-sm font-bold text-slate-900">Candidate Proposer (γ=5)</h4>
                  <div className="text-[11px] text-slate-700 font-mono mt-0.5">Rapid Autoregressive Loop</div>
                </div>
              </div>
            </button>

            {/* Target Model */}
            <button
              onClick={() => setActiveNode('target')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer shadow-xs ${
                activeNode === 'target'
                  ? 'bg-indigo-50 border-indigo-300 shadow-sm'
                  : 'bg-white border-pink-100 hover:border-pink-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200">
                  <Cpu className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-indigo-700 font-bold">Target Model (70B)</div>
                  <h4 className="text-sm font-bold text-slate-900">Parallel Tensor Verifier</h4>
                  <div className="text-[11px] text-slate-700 font-mono mt-0.5">1 Forward Pass Verification</div>
                </div>
              </div>
            </button>

          </div>

          {/* Flow Connector Convergence */}
          <div className="flex justify-center text-emerald-600">
            <ArrowDown className="w-5 h-5" />
          </div>

          {/* Layer 4: Speculative Decoder Engine */}
          <div className="max-w-lg mx-auto">
            <button
              onClick={() => setActiveNode('decoder')}
              className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer shadow-xs ${
                activeNode === 'decoder'
                  ? 'bg-emerald-50 border-emerald-400 shadow-sm'
                  : 'bg-white border-pink-100 hover:border-pink-300'
              }`}
            >
              <div className="flex items-center gap-3 justify-center text-center">
                <div className="p-2 rounded-lg bg-emerald-100 border border-emerald-300">
                  <Shuffle className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">Core Speculative Engine</div>
                  <h4 className="text-sm font-bold text-slate-900">Token Verifier &amp; Distribution Sampler</h4>
                  <div className="text-[11px] text-slate-700 font-mono mt-0.5 font-medium">P_target(x) &ge; P_draft(x) Test</div>
                </div>
              </div>
            </button>
          </div>

          {/* Flow Connector to Output */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            
            <button
              onClick={() => setActiveNode('accepted')}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer shadow-xs ${
                activeNode === 'accepted' ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-pink-100 hover:border-pink-300'
              }`}
            >
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Accepted Tokens
              </div>
              <p className="text-[10px] text-slate-700 mt-1">Appended to KV Cache</p>
            </button>

            <button
              onClick={() => setActiveNode('rejected')}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer shadow-xs ${
                activeNode === 'rejected' ? 'bg-rose-50 border-rose-400' : 'bg-white border-pink-100 hover:border-pink-300'
              }`}
            >
              <div className="flex items-center gap-2 text-rose-700 text-xs font-bold font-mono">
                <XCircle className="w-4 h-4 text-rose-600" /> Rejected Tokens
              </div>
              <p className="text-[10px] text-slate-700 mt-1">Replaced via Target Sample</p>
            </button>

          </div>

          {/* Layer 5: Output & Dashboard */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => setActiveNode('output')}
              className={`p-4 rounded-xl border text-center max-w-md w-full transition-all cursor-pointer shadow-xs ${
                activeNode === 'output' ? 'bg-pink-50 border-pink-400 shadow-sm' : 'bg-white border-pink-100 hover:border-pink-300'
              }`}
            >
              <div className="flex items-center justify-center gap-2 text-pink-700 font-bold text-sm">
                <Activity className="w-4 h-4 text-pink-600" /> Final Verified Output &amp; Telemetry Stream
              </div>
              <p className="text-xs text-slate-700 mt-1 font-mono">
                1.8× Effective Speedup Emitted to User
              </p>
            </button>
          </div>

        </div>

      </div>

      {/* Selected Node Detailed Inspector Card */}
      <div className="rounded-2xl border border-pink-200/80 bg-white/95 p-6 space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-pink-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-pink-50 border border-pink-200">
              {selectedNodeInfo.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {selectedNodeInfo.title}
              </h3>
              <p className="text-xs text-pink-700 font-mono font-medium">
                {selectedNodeInfo.role}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-pink-50 text-slate-700 border border-pink-200 font-medium">
            {selectedNodeInfo.specs}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {selectedNodeInfo.desc}
        </p>
      </div>

    </div>
  );
};
