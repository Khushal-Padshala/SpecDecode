import { DecodingConfig, DecodingRequest, GenerationMetrics, SimulationStep, TokenItem, TokenStatus } from '../types';
import { PRESET_PROMPTS } from './mockData';

export type SimulationCallback = (step: SimulationStep) => void;
export type CompletionCallback = (finalMetrics: GenerationMetrics, allTokens: TokenItem[], outputText: string) => void;

export class SimulationController {
  private request: DecodingRequest;
  private onUpdate: SimulationCallback;
  private onComplete?: CompletionCallback;
  private timerId: number | null = null;
  private isPaused: boolean = false;
  private isStopped: boolean = false;
  private currentStepIndex: number = 0;
  private activeBatchIndex: number = 0;
  
  // State accumulation
  private allTokens: TokenItem[] = [];
  private currentBatchTokens: TokenItem[] = [];
  private currentOutputText: string = '';
  private draftCount: number = 0;
  private acceptedCount: number = 0;
  private rejectedCount: number = 0;
  private targetCalls: number = 0;
  private startTime: number = 0;
  private elapsedSimulatedMs: number = 0;

  constructor(
    request: DecodingRequest,
    onUpdate: SimulationCallback,
    onComplete?: CompletionCallback
  ) {
    this.request = request;
    this.onUpdate = onUpdate;
    this.onComplete = onComplete;
  }

  public start() {
    this.isPaused = false;
    this.isStopped = false;
    this.currentStepIndex = 0;
    this.activeBatchIndex = 0;
    this.allTokens = [];
    this.currentBatchTokens = [];
    this.currentOutputText = '';
    this.draftCount = 0;
    this.acceptedCount = 0;
    this.rejectedCount = 0;
    this.targetCalls = 0;
    this.startTime = Date.now();
    this.elapsedSimulatedMs = 0;

    if (this.request.mode === 'standard') {
      this.runStandardPipeline();
    } else {
      this.runSpeculativePipeline();
    }
  }

  public pause() {
    this.isPaused = true;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.emitState('paused', 'Simulation paused by user.');
  }

  public resume() {
    if (!this.isPaused || this.isStopped) return;
    this.isPaused = false;
    if (this.request.mode === 'standard') {
      this.runStandardStep();
    } else {
      this.runSpeculativeBatchStep();
    }
  }

  public stop() {
    this.isStopped = true;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.emitState('idle', 'Simulation reset.');
  }

  public getStatus() {
    return {
      isPaused: this.isPaused,
      isStopped: this.isStopped,
      step: this.currentStepIndex
    };
  }

  private findPresetSequence() {
    const promptLower = this.request.prompt.toLowerCase();
    const matched = PRESET_PROMPTS.find(p => 
      promptLower.includes('neural') || 
      promptLower.includes('network') ||
      promptLower.includes('learn')
    );
    if (promptLower.includes('python') || promptLower.includes('binary') || promptLower.includes('search') || promptLower.includes('code')) {
      return PRESET_PROMPTS[1];
    }
    if (promptLower.includes('quantum') || promptLower.includes('superposition') || promptLower.includes('qubit')) {
      return PRESET_PROMPTS[2];
    }
    return matched || PRESET_PROMPTS[0];
  }

  // -------------------------------------------------------------
  // SPECULATIVE DECODING PIPELINE
  // -------------------------------------------------------------
  private runSpeculativePipeline() {
    this.emitState('initializing', 'Initializing draft and target models in unified memory...');

    const baseDelay = this.getSpeedDelay(600);
    this.timerId = window.setTimeout(() => {
      if (this.isStopped || this.isPaused) return;
      this.runSpeculativeBatchStep();
    }, baseDelay);
  }

  private runSpeculativeBatchStep() {
    if (this.isStopped || this.isPaused) return;

    const preset = this.findPresetSequence();
    const batches = preset.tokenSequence.batches;
    const gamma = this.request.config.gammaDraftTokens || 5;

    if (this.activeBatchIndex >= batches.length || this.allTokens.length >= this.request.config.maxTokens) {
      this.finishSimulation();
      return;
    }

    const currentBatchData = batches[this.activeBatchIndex];
    // Slice according to gamma
    const draftWords = currentBatchData.draft.slice(0, gamma);
    const acceptedCountForThisBatch = Math.min(currentBatchData.acceptedCount, draftWords.length);
    const hasRejection = acceptedCountForThisBatch < draftWords.length;
    const correctionToken = hasRejection ? (currentBatchData.correctionToken || ' next') : undefined;

    // Phase 1: Drafting (Draft model generates gamma candidate tokens)
    const draftTokens: TokenItem[] = draftWords.map((word, idx) => ({
      id: `tok-${this.activeBatchIndex}-${idx}-${Date.now()}`,
      token: word,
      status: 'drafted' as TokenStatus,
      draftIndex: idx + 1,
      batchId: this.activeBatchIndex + 1,
      model: 'draft',
      confidence: 0.85 + Math.random() * 0.12
    }));

    this.currentBatchTokens = draftTokens;
    this.draftCount += draftTokens.length;
    this.elapsedSimulatedMs += draftTokens.length * 3.2; // ~3.2ms per draft token

    this.emitState(
      'drafting',
      `Draft Model: Autoregressively proposed ${draftTokens.length} candidate tokens (γ=${gamma}).`
    );

    // Phase 2: Verifying (Target Model verifies in 1 forward pass)
    const draftDelay = this.getSpeedDelay(450);
    this.timerId = window.setTimeout(() => {
      if (this.isStopped || this.isPaused) return;

      // Update status to verifying
      this.currentBatchTokens = this.currentBatchTokens.map(t => ({
        ...t,
        status: 'verifying' as TokenStatus
      }));
      this.targetCalls += 1;
      this.elapsedSimulatedMs += 24.5; // Single target verification call

      this.emitState(
        'verifying',
        `Target Model: Verifying candidate batch [${draftTokens.map(t => t.token.trim()).join(', ')}] in 1 single forward pass...`
      );

      // Phase 3: Accept / Reject resolution
      const verifyDelay = this.getSpeedDelay(550);
      this.timerId = window.setTimeout(() => {
        if (this.isStopped || this.isPaused) return;

        const resolvedTokens: TokenItem[] = [];
        let batchAddedText = '';

        for (let i = 0; i < draftTokens.length; i++) {
          if (i < acceptedCountForThisBatch) {
            resolvedTokens.push({
              ...draftTokens[i],
              status: 'accepted',
              model: 'draft'
            });
            this.acceptedCount += 1;
            batchAddedText += draftTokens[i].token;
          } else if (i === acceptedCountForThisBatch) {
            // First rejected token
            resolvedTokens.push({
              ...draftTokens[i],
              status: 'rejected',
              model: 'draft'
            });
            this.rejectedCount += 1;

            // If correction token exists from target model
            if (correctionToken) {
              resolvedTokens.push({
                id: `tok-corr-${this.activeBatchIndex}-${Date.now()}`,
                token: correctionToken,
                status: 'corrected',
                model: 'corrected',
                correctedFrom: draftTokens[i].token,
                confidence: 0.99
              });
              this.acceptedCount += 1; // Correction token counts as an emitted valid token
              batchAddedText += correctionToken;
            }
            break; // Speculative decoding halts at first rejection
          }
        }

        this.currentBatchTokens = resolvedTokens;
        this.allTokens = [...this.allTokens, ...resolvedTokens];
        this.currentOutputText += batchAddedText;

        const acceptedInBatch = resolvedTokens.filter(t => t.status === 'accepted').length;
        const rejectedInBatch = resolvedTokens.filter(t => t.status === 'rejected').length;
        const logMsg = rejectedInBatch > 0
          ? `Batch ${this.activeBatchIndex + 1}: Accepted ${acceptedInBatch} tokens, Rejected 1. Target model generated correction '${correctionToken?.trim()}'.`
          : `Batch ${this.activeBatchIndex + 1}: 100% Accepted (${acceptedInBatch}/${draftTokens.length} tokens). High draft alignment!`;

        this.emitState('accepting', logMsg);

        // Advance to next batch
        this.activeBatchIndex += 1;
        this.currentStepIndex += 1;

        const nextBatchDelay = this.getSpeedDelay(500);
        this.timerId = window.setTimeout(() => {
          if (this.isStopped || this.isPaused) return;
          this.runSpeculativeBatchStep();
        }, nextBatchDelay);

      }, verifyDelay);

    }, draftDelay);
  }

  // -------------------------------------------------------------
  // STANDARD AUTOREGRESSIVE PIPELINE
  // -------------------------------------------------------------
  private runStandardPipeline() {
    this.emitState('initializing', 'Running Standard Autoregressive Decoding: 1 token = 1 expensive target call...');

    const baseDelay = this.getSpeedDelay(500);
    this.timerId = window.setTimeout(() => {
      if (this.isStopped || this.isPaused) return;
      this.runStandardStep();
    }, baseDelay);
  }

  private runStandardStep() {
    if (this.isStopped || this.isPaused) return;

    const preset = this.findPresetSequence();
    const allWords = preset.tokenSequence.finalText.split(/(\s+)/).filter(Boolean);

    if (this.currentStepIndex >= allWords.length || this.allTokens.length >= this.request.config.maxTokens) {
      this.finishSimulation();
      return;
    }

    const nextWord = allWords[this.currentStepIndex];
    this.targetCalls += 1;
    this.elapsedSimulatedMs += 28.5; // full target evaluation per token

    const standardToken: TokenItem = {
      id: `tok-std-${this.currentStepIndex}-${Date.now()}`,
      token: nextWord,
      status: 'accepted',
      model: 'target',
      confidence: 0.98
    };

    this.currentBatchTokens = [standardToken];
    this.allTokens = [...this.allTokens, standardToken];
    this.currentOutputText += nextWord;
    this.acceptedCount += 1;

    this.emitState(
      'drafting',
      `Target Model Call #${this.targetCalls}: Evaluated 70B parameters for token '${nextWord.trim()}'`
    );

    this.currentStepIndex += 1;

    const stepDelay = this.getSpeedDelay(220);
    this.timerId = window.setTimeout(() => {
      if (this.isStopped || this.isPaused) return;
      this.runStandardStep();
    }, stepDelay);
  }

  private finishSimulation() {
    this.emitState('completed', 'Inference completed successfully. All tokens generated and verified.');
    const finalMetrics = this.calculateMetrics();
    if (this.onComplete) {
      this.onComplete(finalMetrics, this.allTokens, this.currentOutputText);
    }
  }

  private getSpeedDelay(baseMs: number): number {
    const mult = this.request.config.speedMultiplier || 1;
    return Math.max(40, Math.round(baseMs / mult));
  }

  private calculateMetrics(): GenerationMetrics {
    const totalTokens = this.allTokens.filter(t => t.status === 'accepted' || t.status === 'corrected').length;
    const totalDraftAndCorr = this.draftCount;
    
    // Acceptance rate
    const acceptanceRate = totalDraftAndCorr > 0 
      ? Math.min(100, Math.round((this.acceptedCount / Math.max(1, totalDraftAndCorr)) * 100))
      : 81.0;

    // Tokens per second
    const simulatedSeconds = Math.max(0.1, this.elapsedSimulatedMs / 1000);
    const tokensPerSecond = Number((totalTokens / simulatedSeconds).toFixed(1));

    // Standard comparison
    const estimatedStandardCalls = totalTokens;
    const speedupRatio = this.targetCalls > 0 
      ? Number((estimatedStandardCalls / this.targetCalls * (this.request.mode === 'speculative' ? 0.9 : 1.0)).toFixed(2))
      : 1.80;

    return {
      latencyMs: Math.round(this.elapsedSimulatedMs),
      tokensPerSecond: tokensPerSecond || 82.4,
      acceptanceRate: acceptanceRate || 81.0,
      draftTokens: this.draftCount,
      acceptedTokens: this.acceptedCount,
      rejectedTokens: this.rejectedCount,
      targetModelCalls: this.targetCalls,
      speedup: this.request.mode === 'standard' ? 1.0 : Math.max(1.2, speedupRatio),
      totalTokensGenerated: totalTokens,
      estimatedStandardCalls,
      timeElapsedMs: Date.now() - this.startTime,
      kvCacheHitRate: 94.2,
      speculativeBatchCount: this.activeBatchIndex
    };
  }

  private emitState(phase: SimulationStep['phase'], logMessage: string) {
    const preset = this.findPresetSequence();
    const maxEstimate = this.request.mode === 'standard' 
      ? preset.tokenSequence.finalText.split(/(\s+)/).filter(Boolean).length
      : preset.tokenSequence.batches.length;
    const progressPercent = Math.min(100, Math.round((this.activeBatchIndex / Math.max(1, maxEstimate)) * 100));

    this.onUpdate({
      stepIndex: this.currentStepIndex,
      phase,
      currentBatch: [...this.currentBatchTokens],
      allTokens: [...this.allTokens],
      outputText: this.currentOutputText,
      metrics: this.calculateMetrics(),
      logMessage,
      activeBatchIndex: this.activeBatchIndex,
      progressPercent
    });
  }
}
