import React from 'react';
import { DecodingConfig, ModelOption } from '../types';
import { Cpu, Zap, Sliders, Play, RotateCcw, Pause, Sparkles, Gauge } from 'lucide-react';

interface ModelSelectorProps {
  config: DecodingConfig;
  targetModels: ModelOption[];
  draftModels: ModelOption[];
  onConfigChange: (newConfig: Partial<DecodingConfig>) => void;
  onRunSpeculative: () => void;
  onRunStandard: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  phase: string;
  isPaused: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  config,
  targetModels,
  draftModels,
  onConfigChange,
  onRunSpeculative,
  onRunStandard,
  onPause,
  onResume,
  onReset,
  phase,
  isPaused
}) => {
  const isRunning = phase !== 'idle' && phase !== 'completed' && phase !== 'paused';
  const isCompleted = phase === 'completed';

  const selectedTarget = targetModels.find(m => m.id === config.targetModelId) || targetModels[0];
  const selectedDraft = draftModels.find(m => m.id === config.draftModelId) || draftModels[0];

  return (
    <div className="rounded-xl border border-pink-200/80 bg-white/90 p-5 space-y-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-pink-100 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-pink-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Decoding Configuration & Hyperparameters
          </h3>
        </div>
        <span className="text-[11px] font-mono text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-200 font-medium">
          Target + Draft System
        </span>
      </div>

      {/* Grid for Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Target Model Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              Target Verifier Model (Large)
            </span>
            <span className="text-[10px] font-mono text-indigo-700 font-bold">
              {selectedTarget.paramSize}
            </span>
          </label>
          <select
            id="target-model-select"
            value={config.targetModelId}
            disabled={isRunning}
            onChange={(e) => onConfigChange({ targetModelId: e.target.value })}
            className="w-full bg-pink-50/30 border border-pink-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-400 font-mono disabled:opacity-60 cursor-pointer"
          >
            {targetModels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.paramSize})
              </option>
            ))}
          </select>
          <p className="text-[10px] text-slate-700 leading-snug">
            {selectedTarget.description}
          </p>
        </div>

        {/* Draft Model Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-pink-600" />
              Draft Speculative Model (Small)
            </span>
            <span className="text-[10px] font-mono text-pink-700 font-bold">
              {selectedDraft.paramSize}
            </span>
          </label>
          <select
            id="draft-model-select"
            value={config.draftModelId}
            disabled={isRunning}
            onChange={(e) => onConfigChange({ draftModelId: e.target.value })}
            className="w-full bg-pink-50/30 border border-pink-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-400 font-mono disabled:opacity-60 cursor-pointer"
          >
            {draftModels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.paramSize})
              </option>
            ))}
          </select>
          <p className="text-[10px] text-slate-700 leading-snug">
            {selectedDraft.description}
          </p>
        </div>

      </div>

      {/* Hyperparameter Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-pink-100">
        
        {/* Draft Tokens (Gamma) */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-700">Draft Tokens (γ):</span>
            <span className="text-pink-600 font-bold">{config.gammaDraftTokens}</span>
          </div>
          <input
            id="gamma-slider"
            type="range"
            min={3}
            max={8}
            step={1}
            disabled={isRunning}
            value={config.gammaDraftTokens}
            onChange={(e) => onConfigChange({ gammaDraftTokens: Number(e.target.value) })}
            className="w-full h-1.5 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-600 disabled:opacity-60"
          />
          <div className="flex justify-between text-[9px] text-slate-700 font-mono">
            <span>3 tokens</span>
            <span>Default: 5</span>
            <span>8 tokens</span>
          </div>
        </div>

        {/* Temperature */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-700">Temperature (T):</span>
            <span className="text-rose-600 font-bold">{config.temperature.toFixed(2)}</span>
          </div>
          <input
            id="temperature-slider"
            type="range"
            min={0.0}
            max={1.0}
            step={0.05}
            disabled={isRunning}
            value={config.temperature}
            onChange={(e) => onConfigChange({ temperature: Number(e.target.value) })}
            className="w-full h-1.5 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-rose-500 disabled:opacity-60"
          />
          <div className="flex justify-between text-[9px] text-slate-700 font-mono">
            <span>0.0 (Greedy)</span>
            <span>0.7</span>
            <span>1.0 (Creative)</span>
          </div>
        </div>

        {/* Max Tokens */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-700">Max Tokens:</span>
            <span className="text-emerald-700 font-bold">{config.maxTokens}</span>
          </div>
          <input
            id="max-tokens-slider"
            type="range"
            min={50}
            max={300}
            step={10}
            disabled={isRunning}
            value={config.maxTokens}
            onChange={(e) => onConfigChange({ maxTokens: Number(e.target.value) })}
            className="w-full h-1.5 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-emerald-600 disabled:opacity-60"
          />
          <div className="flex justify-between text-[9px] text-slate-700 font-mono">
            <span>50</span>
            <span>100</span>
            <span>300</span>
          </div>
        </div>

      </div>

      {/* Speed Multiplier & Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-pink-100">
        
        {/* Speed Multiplier */}
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-700">
          <Gauge className="w-3.5 h-3.5 text-pink-600" />
          <span>Animation Speed:</span>
          {[1, 2, 4].map((mult) => (
            <button
              key={mult}
              type="button"
              onClick={() => onConfigChange({ speedMultiplier: mult })}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                config.speedMultiplier === mult
                  ? 'bg-pink-100 text-pink-800 border border-pink-300 font-bold'
                  : 'bg-white text-slate-700 hover:text-slate-900 border border-pink-100 shadow-xs'
              }`}
            >
              {mult}×
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Pause / Resume Controls during active run */}
          {isRunning && (
            <button
              type="button"
              onClick={onPause}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
          )}

          {isPaused && (
            <button
              type="button"
              onClick={onResume}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Resume</span>
            </button>
          )}

          {/* Reset button */}
          {(isRunning || isPaused || isCompleted) && (
            <button
              type="button"
              id="reset-simulation-btn"
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-pink-50 border border-pink-200 text-slate-700 text-xs font-medium shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-pink-600" />
              <span>Reset</span>
            </button>
          )}

          {/* Run Standard Decoding */}
          <button
            type="button"
            id="run-standard-btn"
            disabled={isRunning}
            onClick={onRunStandard}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-pink-50/80 border border-pink-200 text-slate-800 text-xs font-semibold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-slate-700" />
            <span>Run Standard Decoding</span>
          </button>

          {/* Run Speculative Decoding Primary CTA */}
          <button
            type="button"
            id="run-speculative-btn"
            disabled={isRunning}
            onClick={onRunSpeculative}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-pink-500/20 transition-all hover:scale-[1.02] active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Run Speculative Decoding</span>
          </button>

        </div>

      </div>

    </div>
  );
};
