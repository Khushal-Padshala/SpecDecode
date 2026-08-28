import React, { useState, useEffect } from 'react';
import { PageTab } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoModeModal } from './components/DemoModeModal';
import { Overview } from './pages/Overview';
import { LiveDemo } from './pages/LiveDemo';
import { Benchmark } from './pages/Benchmark';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { Architecture } from './pages/Architecture';
import { AboutDetails } from './pages/AboutDetails';
import { apiService } from './services/api';
import { 
  CentralBenchmarkData, 
  ModelOption, 
  PresetPrompt 
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<PageTab>('overview');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [benchmarkData, setBenchmarkData] = useState<CentralBenchmarkData | null>(null);
  const [targetModels, setTargetModels] = useState<ModelOption[]>([]);
  const [draftModels, setDraftModels] = useState<ModelOption[]>([]);
  const [presetPrompts, setPresetPrompts] = useState<PresetPrompt[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [bench, targets, drafts, presets] = await Promise.all([
          apiService.getBenchmarkData(),
          apiService.getTargetModels(),
          apiService.getDraftModels(),
          apiService.getPresetPrompts()
        ]);
        setBenchmarkData(bench);
        setTargetModels(targets);
        setDraftModels(drafts);
        setPresetPrompts(presets);
      } catch (err) {
        console.error('Failed to load initial simulation data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleTabChange = (tab: PageTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading || !benchmarkData) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center space-y-4 text-cyan-400 font-mono text-xs">
        <div className="w-10 h-10 rounded-xl border border-cyan-500/40 bg-cyan-500/10 flex items-center justify-center animate-spin">
          &bull;
        </div>
        <p>Loading SpecDecode Inference Engine...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* 1. Global Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onTriggerDemo={() => setIsDemoModalOpen(true)}
      />

      {/* 2. Main Tab View Router */}
      <main className="flex-1 pt-4">
        {activeTab === 'overview' && (
          <Overview
            benchmarkData={benchmarkData}
            onTabChange={handleTabChange}
            onTriggerGuidedDemo={() => setIsDemoModalOpen(true)}
          />
        )}

        {activeTab === 'demo' && (
          <LiveDemo
            onTabChange={handleTabChange}
            presetPrompts={presetPrompts}
            targetModels={targetModels}
            draftModels={draftModels}
          />
        )}

        {activeTab === 'benchmark' && (
          <Benchmark
            benchmarkData={benchmarkData}
            onTabChange={handleTabChange}
          />
        )}

        {activeTab === 'how-it-works' && (
          <HowItWorksPage
            onTabChange={handleTabChange}
          />
        )}

        {activeTab === 'architecture' && (
          <Architecture
            onTabChange={handleTabChange}
          />
        )}

        {activeTab === 'about' && (
          <AboutDetails
            onTabChange={handleTabChange}
          />
        )}
      </main>

      {/* 3. Global Footer */}
      <Footer onTabChange={handleTabChange} />

      {/* 4. Automated 20-Second Guided Demo Modal */}
      <DemoModeModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onJumpToPlayground={() => handleTabChange('demo')}
      />

    </div>
  );
}
