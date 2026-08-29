import React, { useState, useEffect, useRef } from 'react';
import { 
  DecodingConfig, 
  GenerationMetrics, 
  ModelOption, 
  PageTab, 
  PresetPrompt, 
  SimulationStep, 
  TokenItem 
} from '../types';
import { PromptInput } from '../components/PromptInput';
import { ModelSelector } from '../components/ModelSelector';
import { TokenVisualizer } from '../components/TokenVisualizer';
import { LiveOutput } from '../components/LiveOutput';
import { MetricsPanel } from '../components/MetricsPanel';
import { CompletionCard } from '../components/CompletionCard';
import { ModelComparison } from '../components/ModelComparison';
import { apiService } from '../services/api';
import { SimulationController } from '../simulation/simulationEngine';
import { Activity, Sparkles, Zap, RotateCcw, AlertTriangle, Layers } from 'lucide-react';

interface LiveDemoProps {
  onTabChange: (tab: PageTab) => void;
  presetPrompts: PresetPrompt[];
  targetModels: ModelOption[];
  draftModels: ModelOption[];
}

export const LiveDemo: React.FC<LiveDemoProps> = ({
  onTabChange,
  presetPrompts,
  targetModels,
  draftModels
}) => {
  // Config state
  const [prompt, setPrompt] = useState<string>(presetPrompts[0]?.prompt || 'Explain how neural networks learn from data.');
  const [selectedPresetId, setSelectedPresetId] = useState<string>(presetPrompts[0]?.id || 'prompt-nn-learning');
  const [config, setConfig] = useState<DecodingConfig>({
    targetModelId: targetModels[0]?.id || 'target-llama-70b',
    draftModelId: draftModels[0]?.id || 'draft-llama-8b',
    gammaDraftTokens: 5,
    temperature: 0.7,
    maxTokens: 100,
    speedMultiplier: 1
  });

  // Simulation state
  const [mode, setMode] = useState<'speculative' | 'standard' | 'demo'>('speculative');
  const [phase, setPhase] = useState<SimulationStep['phase']>('idle');
  const [currentBatch, setCurrentBatch] = useState<TokenItem[]>([]);
  const [allTokens, setAllTokens] = useState<TokenItem[]>([]);
  const [outputText, setOutputText] = useState<string>('');
  const [logMessage, setLogMessage] = useState<string>('Ready to launch inference simulation.');
  const [activeBatchIndex, setActiveBatchIndex] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showCompletionCard, setShowCompletionCard] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Real-time metrics
  const [metrics, setMetrics] = useState<GenerationMetrics>({
    latencyMs: 0,
    tokensPerSecond: 82.4,
    acceptanceRate: 81.0,
    draftTokens: 0,
    acceptedTokens: 0,
    rejectedTokens: 0,
    targetModelCalls: 0,
    speedup: 1.80,
    totalTokensGenerated: 0,
    estimatedStandardCalls: 0,
    timeElapsedMs: 0,
    kvCacheHitRate: 94.2,
    speculativeBatchCount: 0
  });

  const controllerRef = useRef<SimulationController | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.stop();
      }
    };
  }, []);

  const handleSelectPreset = (preset: PresetPrompt) => {
    setSelectedPresetId(preset.id);
    setPrompt(preset.prompt);
    setErrorMessage(null);
  };

  const handleConfigChange = (newConfig: Partial<DecodingConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const startSimulation = (selectedMode: 'speculative' | 'standard') => {
    if (!prompt.trim()) {
      setErrorMessage('Please enter a prompt or select an example preset above before running the simulation.');
      return;
    }

    setErrorMessage(null);
    setMode(selectedMode);
    setShowCompletionCard(false);
    setIsPaused(false);

    if (controllerRef.current) {
      controllerRef.current.stop();
    }

    const controller = apiService.createDecodingSession(
      {
        prompt,
        config,
        mode: selectedMode
      },
      (step: SimulationStep) => {
        setPhase(step.phase);
        setCurrentBatch(step.currentBatch);
        setAllTokens(step.allTokens);
        setOutputText(step.outputText);
        setMetrics(step.metrics);
        setLogMessage(step.logMessage);
        setActiveBatchIndex(step.activeBatchIndex);
        setProgressPercent(step.progressPercent);
      },
      (finalMetrics) => {
        setPhase('completed');
        setMetrics(finalMetrics);
        setShowCompletionCard(true);
      }
    );

    controllerRef.current = controller;
    controller.start();
  };

  const handlePause = () => {
    if (controllerRef.current) {
      controllerRef.current.pause();
      setIsPaused(true);
      setPhase('paused');
    }
  };

  const handleResume = () => {
    if (controllerRef.current) {
      controllerRef.current.resume();
      setIsPaused(false);
    }
  };

  const handleReset = () => {
    if (controllerRef.current) {
      controllerRef.current.stop();
    }
    setPhase('idle');
    setIsPaused(false);
    setShowCompletionCard(false);
    setCurrentBatch([]);
    setAllTokens([]);
    setOutputText('');
    setProgressPercent(0);
    setActiveBatchIndex(0);
    setLogMessage('Simulation reset. Ready for next prompt.');
  };

  const isRunning = phase !== 'idle' && phase !== 'completed' && phase !== 'paused';
  const isCompleted = phase === 'completed';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-pink-100 border border-pink-300 text-pink-600 shadow-xs">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Speculative Decoding Playground
              </h1>
              <p className="text-xs sm:text-sm text-slate-700 mt-0.5">
                Compare conventional autoregressive generation with speculative decoding in real time.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold shadow-xs">
            ● Deterministic Simulation Engine Active
          </span>
        </div>
      </div>

      {/* Error Message if Empty Prompt */}
      {errorMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 flex items-center justify-between gap-3 text-xs text-rose-800 font-mono shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-600 hover:text-rose-900 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* 1. Prompt Input Section */}
      <PromptInput
        prompt={prompt}
        onPromptChange={(val) => { setPrompt(val); setErrorMessage(null); }}
        presetPrompts={presetPrompts}
        selectedPresetId={selectedPresetId}
        onSelectPreset={handleSelectPreset}
        disabled={isRunning}
      />

      {/* 2. Decoding Configuration & Controls Panel */}
      <ModelSelector
        config={config}
        targetModels={targetModels}
        draftModels={draftModels}
        onConfigChange={handleConfigChange}
        onRunSpeculative={() => startSimulation('speculative')}
        onRunStandard={() => startSimulation('standard')}
        onPause={handlePause}
        onResume={handleResume}
        onReset={handleReset}
        phase={phase}
        isPaused={isPaused}
      />

      {/* 3. Completion Summary Card (if run finished) */}
      {showCompletionCard && (
        <CompletionCard
          metrics={metrics}
          onRunAgain={() => startSimulation('speculative')}
          onViewBenchmark={() => onTabChange('benchmark')}
        />
      )}

      {/* 4. Live Token Generation Pipeline (Draft -> Verify -> Accept / Reject) */}
      <TokenVisualizer
        currentBatch={currentBatch}
        allTokens={allTokens}
        phase={phase}
        logMessage={logMessage}
        activeBatchIndex={activeBatchIndex}
        gamma={config.gammaDraftTokens}
      />

      {/* 5. Two-column grid: Live Output + Real-time Telemetry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveOutput
          outputText={outputText}
          totalTokensGenerated={metrics.totalTokensGenerated}
          maxTokens={config.maxTokens}
          progressPercent={progressPercent}
          isRunning={isRunning}
          isCompleted={isCompleted}
          mode={mode}
        />

        <MetricsPanel
          metrics={metrics}
          mode={mode}
          isRunning={isRunning}
        />
      </div>

      {/* 6. Side-by-Side Model Comparison Visualizer */}
      <ModelComparison />

    </div>
  );
};
