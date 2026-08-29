import React, { useState } from 'react';
import { PageTab } from '../types';
import { 
  Zap, 
  Activity, 
  BarChart3, 
  BookOpen, 
  Cpu, 
  Play, 
  Info, 
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeTab: PageTab;
  onTabChange: (tab: PageTab) => void;
  onTriggerDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onTriggerDemo
}) => {
  const [showStatusModal, setShowStatusModal] = useState(false);

  const navItems: { id: PageTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'demo', label: 'Live Demo', icon: <Activity className="w-4 h-4" /> },
    { id: 'benchmark', label: 'Benchmark', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'how-it-works', label: 'How It Works', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'architecture', label: 'Architecture', icon: <Cpu className="w-4 h-4" /> },
    { id: 'about', label: 'Tech Details', icon: <Info className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-pink-100/80 bg-white/90 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand / Logo */}
        <div 
          onClick={() => onTabChange('overview')}
          className="flex items-center gap-3 cursor-pointer group"
          id="nav-brand-logo"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-500/15 to-rose-500/25 border border-pink-300 flex items-center justify-center shadow-sm shadow-pink-500/10 group-hover:border-pink-500 transition-colors">
            <Zap className="w-5 h-5 text-pink-600 fill-pink-500/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-pink-600 transition-colors">
                SpecDecode
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-pink-100 text-pink-700 border border-pink-200">
                v1.2
              </span>
            </div>
            <p className="text-[10px] text-slate-700 hidden sm:block">
              LLM Speculative Decoding Engine
            </p>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-pink-50 text-pink-700 border border-pink-200/80 shadow-xs shadow-pink-500/5 font-semibold'
                    : 'text-slate-800 hover:text-pink-600 hover:bg-pink-50/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Side: Status Indicator & Demo CTA */}
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <button
            id="status-indicator-btn"
            onClick={() => setShowStatusModal(!showStatusModal)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-pink-50/80 border border-pink-200 hover:border-pink-300 text-xs text-slate-700 transition-colors cursor-pointer"
            title="Click to view inference simulation status"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] text-slate-700">Simulation Mode</span>
          </button>

          {/* Run Guided Demo CTA */}
          <button
            id="nav-run-demo-btn"
            onClick={onTriggerDemo}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold text-xs transition-all shadow-md shadow-pink-500/20 active:scale-95 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Run Demo</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden border-t border-pink-100 bg-white/95 px-3 py-2 flex items-center justify-between overflow-x-auto space-x-2 text-xs">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`whitespace-nowrap px-2.5 py-1 rounded text-xs ${
              activeTab === item.id
                ? 'bg-pink-100 text-pink-700 font-semibold border border-pink-200'
                : 'text-slate-800 hover:text-pink-600'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Status Modal Info */}
      {showStatusModal && (
        <div className="absolute right-6 top-18 z-50 w-80 p-4 rounded-xl bg-white border border-pink-200 shadow-xl text-xs space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-pink-100">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-pink-500" />
              Runtime Architecture
            </span>
            <button 
              onClick={() => setShowStatusModal(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1.5 text-slate-600">
            <p className="text-[11px] text-slate-600 leading-relaxed">
              This interactive dashboard is powered by the standalone <strong className="text-pink-600">SpecDecode Simulation Engine</strong>.
            </p>
            <div className="p-2 rounded bg-pink-50/60 border border-pink-100 font-mono text-[10px] space-y-1 text-slate-700">
              <div className="flex justify-between">
                <span>Inference Mode:</span>
                <span className="text-emerald-700 font-medium">Simulated (Deterministic)</span>
              </div>
              <div className="flex justify-between">
                <span>API Gateway:</span>
                <span className="text-pink-600 font-medium">/services/api.ts (Ready)</span>
              </div>
              <div className="flex justify-between">
                <span>Target Model:</span>
                <span>Llama-3-70B</span>
              </div>
              <div className="flex justify-between">
                <span>Draft Model:</span>
                <span>Llama-3-8B (γ=5)</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-700">
              Backend engineers can connect real vLLM / HuggingFace speculative decoding endpoints by implementing the exported handlers in <code className="text-pink-600">src/services/api.ts</code>.
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
