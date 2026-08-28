import { CentralBenchmarkData, DecodingConfig, DecodingRequest, GenerationMetrics, ModelOption, PresetPrompt } from '../types';
import { CENTRAL_BENCHMARK_DATA, DRAFT_MODELS, PRESET_PROMPTS, TARGET_MODELS } from '../simulation/mockData';
import { SimulationController, SimulationCallback, CompletionCallback } from '../simulation/simulationEngine';

export interface SystemStatus {
  mode: 'simulation' | 'backend';
  status: 'ready' | 'busy' | 'error';
  backendUrl?: string;
  hardware: {
    gpu: string;
    vramAvailableGb: number;
    kvCacheStatus: string;
  };
  supportedFeatures: string[];
}

/**
 * SpecDecode API Service
 * 
 * Provides clean asynchronous interface for speculative decoding runs,
 * standard autoregressive inference benchmarks, and system configurations.
 * 
 * In this frontend demonstration, methods connect to the simulation engine.
 * When integrating with a production server, replace internal logic with
 * fetch()/WebSocket calls to the speculative decoding inference gateway.
 */
class SpecDecodeApiService {
  private isSimulationMode: boolean = true;
  private activeController: SimulationController | null = null;

  /**
   * Check connection status and available models
   */
  public async getSystemStatus(): Promise<SystemStatus> {
    return {
      mode: this.isSimulationMode ? 'simulation' : 'backend',
      status: 'ready',
      hardware: {
        gpu: 'NVIDIA H100 SXM5 80GB (Simulated)',
        vramAvailableGb: 64.8,
        kvCacheStatus: 'PagedAttention Tree-Branching Enabled'
      },
      supportedFeatures: [
        'speculative_decoding',
        'batched_verification',
        'kv_tree_pruning',
        'temperature_sampling'
      ]
    };
  }

  /**
   * Get available target and draft models
   */
  public async getModels(): Promise<{ targetModels: ModelOption[]; draftModels: ModelOption[] }> {
    return {
      targetModels: TARGET_MODELS,
      draftModels: DRAFT_MODELS
    };
  }

  public async getTargetModels(): Promise<ModelOption[]> {
    return TARGET_MODELS;
  }

  public async getDraftModels(): Promise<ModelOption[]> {
    return DRAFT_MODELS;
  }

  /**
   * Get centralized benchmark data for analytics and charts
   */
  public async getBenchmarkData(): Promise<CentralBenchmarkData> {
    // In production, this can call GET /api/v1/benchmarks
    return CENTRAL_BENCHMARK_DATA;
  }

  /**
   * Get preset prompts for the playground
   */
  public async getPresetPrompts(): Promise<PresetPrompt[]> {
    return PRESET_PROMPTS;
  }

  /**
   * Start a speculative decoding simulation session with streaming updates
   */
  public createDecodingSession(
    request: DecodingRequest,
    onUpdate: SimulationCallback,
    onComplete?: CompletionCallback
  ): SimulationController {
    if (this.activeController) {
      this.activeController.stop();
    }
    
    const controller = new SimulationController(request, onUpdate, onComplete);
    this.activeController = controller;
    return controller;
  }

  /**
   * Run one-shot speculative decoding (Promise-based for standard API integration)
   */
  public async runSpeculativeDecoding(request: DecodingRequest): Promise<GenerationMetrics> {
    return new Promise((resolve) => {
      const controller = new SimulationController(
        { ...request, mode: 'speculative' },
        () => {},
        (finalMetrics) => {
          resolve(finalMetrics);
        }
      );
      controller.start();
    });
  }

  /**
   * Run one-shot standard autoregressive decoding
   */
  public async runStandardDecoding(request: DecodingRequest): Promise<GenerationMetrics> {
    return new Promise((resolve) => {
      const controller = new SimulationController(
        { ...request, mode: 'standard' },
        () => {},
        (finalMetrics) => {
          resolve(finalMetrics);
        }
      );
      controller.start();
    });
  }
}

export const apiService = new SpecDecodeApiService();
export default apiService;
