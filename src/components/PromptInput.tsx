import React from 'react';
import { PresetPrompt } from '../types';
import { Sparkles, Terminal, FileCode, Brain, Calculator } from 'lucide-react';

interface PromptInputProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  presetPrompts: PresetPrompt[];
  selectedPresetId: string;
  onSelectPreset: (preset: PresetPrompt) => void;
  disabled?: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  onPromptChange,
  presetPrompts,
  selectedPresetId,
  onSelectPreset,
  disabled = false
}) => {
  // Approximate token count (~4 chars per token)
  const charCount = prompt.length;
  const estimatedTokens = Math.max(1, Math.round(charCount / 4));

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Math': return <Calculator className="w-3.5 h-3.5 text-pink-600" />;
      case 'Coding': return <FileCode className="w-3.5 h-3.5 text-indigo-600" />;
      case 'Reasoning': return <Brain className="w-3.5 h-3.5 text-purple-600" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-rose-500" />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Preset Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          Example Prompts:
        </span>
        {presetPrompts.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              id={`preset-btn-${preset.id}`}
              type="button"
              disabled={disabled}
              onClick={() => onSelectPreset(preset)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-pink-100 text-pink-800 border border-pink-300 shadow-xs shadow-pink-500/10 font-semibold ring-2 ring-pink-400/20'
                  : 'bg-white text-slate-700 border border-pink-100 hover:bg-pink-50/60 hover:border-pink-200 shadow-xs'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {getCategoryIcon(preset.category)}
              <span>{preset.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Textarea */}
      <div className="relative rounded-xl border border-pink-200/80 bg-white shadow-xs focus-within:border-pink-500 focus-within:ring-2 focus-within:ring-pink-500/20 transition-all">
        <div className="flex items-center justify-between px-3.5 py-2 border-b border-pink-100/70 text-xs text-slate-700 bg-pink-50/30 rounded-t-xl">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-pink-600" />
            <span className="font-mono text-[11px] font-medium text-slate-700">Prompt Context</span>
          </div>
          <span className="text-[11px] text-slate-700 font-mono">
            LLM Input Stream
          </span>
        </div>

        <textarea
          id="prompt-input-textarea"
          rows={3}
          value={prompt}
          disabled={disabled}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Enter your prompt or select an example above (e.g., Calculate the equation or Explain neural networks)..."
          className="w-full bg-transparent px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none resize-none font-mono"
        />

        {/* Bottom Status Bar with Char & Token Counts */}
        <div className="flex items-center justify-between px-3.5 py-2 border-t border-pink-100/70 text-[11px] font-mono text-slate-700 bg-pink-50/20 rounded-b-xl">
          <div className="flex items-center gap-3">
            <span>Length: <strong className="text-slate-800">{charCount}</strong> chars</span>
            <span>Est. Prompt Tokens: <strong className="text-pink-600">{estimatedTokens}</strong></span>
          </div>
          <span className="text-[10px] text-slate-700">
            Speculative decoding will predict responses to this prompt
          </span>
        </div>
      </div>
    </div>
  );
};
