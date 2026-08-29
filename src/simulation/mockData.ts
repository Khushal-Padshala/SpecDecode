import { CentralBenchmarkData, ModelOption, PresetPrompt } from '../types';

export const TARGET_MODELS: ModelOption[] = [
  {
    id: 'target-llama-70b',
    name: 'Llama 3 70B Instruct',
    type: 'target',
    paramSize: '70B',
    latencyPerStepMs: 28.5,
    memoryFootprintGb: 39.2,
    description: 'High-capacity target verifier providing state-of-the-art accuracy and reasoning.'
  },
  {
    id: 'target-deepseek-67b',
    name: 'DeepSeek LLM 67B',
    type: 'target',
    paramSize: '67B',
    latencyPerStepMs: 26.2,
    memoryFootprintGb: 36.8,
    description: 'Powerful coding and reasoning target model with dense attention layers.'
  },
  {
    id: 'target-demo-model',
    name: 'SpecDecode Large Target (Demo)',
    type: 'target',
    paramSize: '32B',
    latencyPerStepMs: 22.0,
    memoryFootprintGb: 18.5,
    description: 'Optimized demo target model balanced for lightning-fast visual verification.'
  }
];

export const DRAFT_MODELS: ModelOption[] = [
  {
    id: 'draft-llama-8b',
    name: 'Llama 3 8B Draft',
    type: 'draft',
    paramSize: '8B',
    latencyPerStepMs: 3.2,
    memoryFootprintGb: 4.8,
    description: 'High-speed autoregressive draft engine generating candidates in ~3ms/token.'
  },
  {
    id: 'draft-qwen-1.5b',
    name: 'Qwen 2.5 1.5B Tiny',
    type: 'draft',
    paramSize: '1.5B',
    latencyPerStepMs: 1.4,
    memoryFootprintGb: 1.2,
    description: 'Ultra-lightweight draft model delivering near-zero latency speculative proposals.'
  },
  {
    id: 'draft-demo-model',
    name: 'SpecDecode Tiny Draft (Demo)',
    type: 'draft',
    paramSize: '1.1B',
    latencyPerStepMs: 1.8,
    memoryFootprintGb: 0.9,
    description: 'Compact speculative draft agent configured for optimal acceptance rate (γ=5).'
  }
];

export const CENTRAL_BENCHMARK_DATA: CentralBenchmarkData = {
  overviewMetrics: {
    speedImprovement: '1.8×',
    tokensPerSecond: 82.4,
    standardTokensPerSecond: 45.8,
    acceptanceRate: 81.0,
    targetModelCalls: 20,
    standardTargetModelCalls: 100,
    averageLatencyMs: 1213,
    memoryEfficiencyPct: 78.5
  },
  comparisonSeries: [
    { category: 'Python Coding', standardSpeed: 44.2, speculativeSpeed: 84.8, acceptanceRate: 83.5, speedup: 1.92 },
    { category: 'Math & Proofs', standardSpeed: 42.1, speculativeSpeed: 76.5, acceptanceRate: 77.2, speedup: 1.82 },
    { category: 'Reasoning / Q&A', standardSpeed: 46.8, speculativeSpeed: 82.4, acceptanceRate: 81.0, speedup: 1.76 },
    { category: 'Summarization', standardSpeed: 48.3, speculativeSpeed: 91.2, acceptanceRate: 86.4, speedup: 1.89 },
    { category: 'Creative Text', standardSpeed: 45.0, speculativeSpeed: 77.8, acceptanceRate: 76.1, speedup: 1.73 }
  ],
  timeSeriesSpeed: [
    { tokenCount: 10, standardTimeMs: 285, speculativeTimeMs: 154, tokensPerSecStd: 35.1, tokensPerSecSpec: 64.9 },
    { tokenCount: 25, standardTimeMs: 712, speculativeTimeMs: 382, tokensPerSecStd: 35.1, tokensPerSecSpec: 65.4 },
    { tokenCount: 50, standardTimeMs: 1425, speculativeTimeMs: 720, tokensPerSecStd: 35.1, tokensPerSecSpec: 69.4 },
    { tokenCount: 75, standardTimeMs: 2137, speculativeTimeMs: 1025, tokensPerSecStd: 35.1, tokensPerSecSpec: 73.2 },
    { tokenCount: 100, standardTimeMs: 2850, speculativeTimeMs: 1213, tokensPerSecStd: 35.1, tokensPerSecSpec: 82.4 },
    { tokenCount: 150, standardTimeMs: 4275, speculativeTimeMs: 1780, tokensPerSecStd: 35.1, tokensPerSecSpec: 84.3 },
    { tokenCount: 200, standardTimeMs: 5700, speculativeTimeMs: 2310, tokensPerSecStd: 35.1, tokensPerSecSpec: 86.5 }
  ],
  gammaAblation: [
    { gamma: 1, speedup: 1.0, acceptanceRate: 88.2, overheadMs: 1.8, effectiveTps: 45.8 },
    { gamma: 2, speedup: 1.34, acceptanceRate: 85.6, overheadMs: 3.6, effectiveTps: 61.3 },
    { gamma: 3, speedup: 1.58, acceptanceRate: 83.9, overheadMs: 5.4, effectiveTps: 72.4 },
    { gamma: 4, speedup: 1.72, acceptanceRate: 82.4, overheadMs: 7.2, effectiveTps: 78.8 },
    { gamma: 5, speedup: 1.80, acceptanceRate: 81.0, overheadMs: 9.0, effectiveTps: 82.4 },
    { gamma: 6, speedup: 1.77, acceptanceRate: 77.1, overheadMs: 10.8, effectiveTps: 81.1 },
    { gamma: 7, speedup: 1.71, acceptanceRate: 73.4, overheadMs: 12.6, effectiveTps: 78.3 },
    { gamma: 8, speedup: 1.63, acceptanceRate: 69.8, overheadMs: 14.4, effectiveTps: 74.6 }
  ],
  modelPairs: [
    { pairName: 'Llama 3 (70B / 8B)', target: 'Llama 3 70B', draft: 'Llama 3 8B', speedup: '1.92×', acceptanceRate: '83.5%', vramMb: '+4,800 MB' },
    { pairName: 'DeepSeek (67B / 7B)', target: 'DeepSeek 67B', draft: 'DeepSeek 7B', speedup: '1.85×', acceptanceRate: '81.2%', vramMb: '+4,200 MB' },
    { pairName: 'Qwen 2.5 (72B / 1.5B)', target: 'Qwen 72B', draft: 'Qwen 1.5B', speedup: '2.14×', acceptanceRate: '78.9%', vramMb: '+1,200 MB' },
    { pairName: 'Mistral Large / Small', target: 'Mistral Large 2', draft: 'Mistral Nemo', speedup: '1.78×', acceptanceRate: '80.4%', vramMb: '+3,800 MB' }
  ]
};

export const PRESET_PROMPTS: PresetPrompt[] = [
  {
    id: 'prompt-calculate-equation',
    title: 'Calculate the Equation',
    category: 'Math',
    prompt: 'Calculate the equation: Solve for x in 2x² - 8x + 6 = 0 using the quadratic formula, and evaluate the definite integral ∫(3x² - 4x + 1) dx from x=0 to x=3.',
    estimatedSpeedup: 1.88,
    tokenSequence: {
      finalText: '### Step 1: Solving the Quadratic Equation\nFor 2x² - 8x + 6 = 0 (where a = 2, b = -8, c = 6):\nDiscriminant D = b² - 4ac = (-8)² - 4(2)(6) = 64 - 48 = 16.\nRoots: x = (-b ± √D) / (2a) = (8 ± 4) / 4.\n• x₁ = (8 + 4) / 4 = 3\n• x₂ = (8 - 4) / 4 = 1\n\n### Step 2: Evaluating the Definite Integral\n∫₀³ (3x² - 4x + 1) dx = [x³ - 2x² + x]₀³\n= (3³ - 2(3)² + 3) - 0\n= (27 - 18 + 3) = 12.\n\nFinal Answer: The equation roots are x = 1, 3 and the integral value is 12.',
      batches: [
        {
          draft: ['###', ' Step', ' 1:', ' Solving', ' the'],
          acceptedCount: 5
        },
        {
          draft: [' Quadratic', ' Equation', '\nFor', ' 2', 'x'],
          acceptedCount: 5
        },
        {
          draft: ['²', ' -', ' 8', 'x', ' +'],
          acceptedCount: 5
        },
        {
          draft: [' 6', ' =', ' 0', ' (where', ' a'],
          acceptedCount: 5
        },
        {
          draft: [' =', ' 2,', ' b', ' =', ' -8,'],
          acceptedCount: 5
        },
        {
          draft: [' c', ' =', ' 6):\n', 'Discrimin', 'ant'],
          acceptedCount: 5
        },
        {
          draft: [' D', ' =', ' b²', ' -', ' 4'],
          acceptedCount: 5
        },
        {
          draft: ['ac', ' =', ' (-8', ')²', ' ='],
          acceptedCount: 4,
          correctionToken: ' -'
        },
        {
          draft: [' 4(2)(', '6)', ' =', ' 64', ' -'],
          acceptedCount: 5
        },
        {
          draft: [' 48', ' =', ' 16.\n', 'Roots', ':'],
          acceptedCount: 5
        },
        {
          draft: [' x', ' =', ' (-b', ' ±', ' √'],
          acceptedCount: 5
        },
        {
          draft: ['D)', ' /', ' (2', 'a)', ' ='],
          acceptedCount: 5
        },
        {
          draft: [' (8', ' ±', ' 4)', ' /', ' 4.\n'],
          acceptedCount: 5
        },
        {
          draft: ['•', ' x₁', ' =', ' (8', ' +'],
          acceptedCount: 5
        },
        {
          draft: [' 4)', ' /', ' 4', ' =', ' 3\n'],
          acceptedCount: 5
        },
        {
          draft: ['•', ' x₂', ' =', ' (8', ' -'],
          acceptedCount: 5
        },
        {
          draft: [' 4)', ' /', ' 4', ' =', ' 1\n'],
          acceptedCount: 5
        },
        {
          draft: ['\n###', ' Step', ' 2:', ' Evaluating', ' the'],
          acceptedCount: 5
        },
        {
          draft: [' Definite', ' Integral', '\n∫', '₀', '³'],
          acceptedCount: 5
        },
        {
          draft: [' (3', 'x²', ' -', ' 4', 'x'],
          acceptedCount: 5
        },
        {
          draft: [' +', ' 1)', ' dx', ' =', ' [x'],
          acceptedCount: 5
        },
        {
          draft: ['³', ' -', ' 2', 'x²', ' +'],
          acceptedCount: 5
        },
        {
          draft: [' x', ']₀', '³\n', '=', ' (3'],
          acceptedCount: 5
        },
        {
          draft: ['³', ' -', ' 2(3', ')²', ' +'],
          acceptedCount: 5
        },
        {
          draft: [' 3)', ' -', ' 0\n', '=', ' (27'],
          acceptedCount: 5
        },
        {
          draft: [' -', ' 18', ' +', ' 3)', ' ='],
          acceptedCount: 5
        },
        {
          draft: [' 12.\n', '\nFinal', ' Answer', ':', ' The'],
          acceptedCount: 5
        },
        {
          draft: [' equation', ' roots', ' are', ' x', ' ='],
          acceptedCount: 5
        },
        {
          draft: [' 1,', ' 3', ' and', ' the', ' integral'],
          acceptedCount: 5
        },
        {
          draft: [' value', ' is', ' 12.'],
          acceptedCount: 3
        }
      ]
    }
  },
  {
    id: 'prompt-nn-learning',
    title: 'Neural Network Learning',
    category: 'Science',
    prompt: 'Explain how neural networks learn from data.',
    estimatedSpeedup: 1.80,
    tokenSequence: {
      finalText: 'Neural networks learn from data through an iterative mathematical optimization process. First, inputs propagate forward across interconnected layers with tunable weights and biases to produce a prediction. A loss function calculates the error between predictions and true labels. Then, backpropagation computes partial derivatives using the chain rule to update internal parameters via gradient descent.',
      batches: [
        {
          draft: ['Neural', ' networks', ' learn', ' from', ' data'],
          acceptedCount: 5
        },
        {
          draft: [' through', ' an', ' iterative', ' mathematical', ' optimization'],
          acceptedCount: 5
        },
        {
          draft: [' process.', ' First,', ' inputs', ' propagate', ' forward'],
          acceptedCount: 5
        },
        {
          draft: [' across', ' interconnected', ' nodes', ' and', ' weights'],
          acceptedCount: 2, // 'across', 'interconnected' accepted
          correctionToken: ' layers'
        },
        {
          draft: [' with', ' tunable', ' weights', ' and', ' biases'],
          acceptedCount: 5
        },
        {
          draft: [' to', ' produce', ' an', ' output', ' prediction.'],
          acceptedCount: 2, // 'to', 'produce' accepted
          correctionToken: ' a'
        },
        {
          draft: [' prediction.', ' A', ' loss', ' function', ' calculates'],
          acceptedCount: 5
        },
        {
          draft: [' the', ' error', ' between', ' predictions', ' and'],
          acceptedCount: 5
        },
        {
          draft: [' ground', ' truth', ' values.', ' Next,', ' backpropagation'],
          acceptedCount: 0,
          correctionToken: ' true'
        },
        {
          draft: [' labels.', ' Then,', ' backpropagation', ' computes', ' partial'],
          acceptedCount: 5
        },
        {
          draft: [' derivatives', ' using', ' the', ' chain', ' rule'],
          acceptedCount: 5
        },
        {
          draft: [' to', ' update', ' model', ' weights', ' efficiently.'],
          acceptedCount: 2, // 'to', 'update'
          correctionToken: ' internal'
        },
        {
          draft: [' parameters', ' via', ' gradient', ' descent', ' algorithms.'],
          acceptedCount: 4,
          correctionToken: ' descent.'
        }
      ]
    }
  },
  {
    id: 'prompt-python-binary-search',
    title: 'Python Binary Search',
    category: 'Coding',
    prompt: 'Write an optimized binary search function in Python.',
    estimatedSpeedup: 1.94,
    tokenSequence: {
      finalText: 'def binary_search(arr: list[int], target: int) -> int:\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1',
      batches: [
        {
          draft: ['def', ' binary', '_search', '(arr', ':'],
          acceptedCount: 5
        },
        {
          draft: [' list', '[int', '],', ' target', ':'],
          acceptedCount: 5
        },
        {
          draft: [' int', ')', ' ->', ' int', ':\n'],
          acceptedCount: 5
        },
        {
          draft: ['    low', ',', ' high', ' =', ' 0,'],
          acceptedCount: 5
        },
        {
          draft: [' len', '(arr', ')', ' -', ' 1\n'],
          acceptedCount: 5
        },
        {
          draft: ['    while', ' low', ' <', ' high', ':\n'],
          acceptedCount: 2, // 'while', 'low'
          correctionToken: ' <='
        },
        {
          draft: [' high', ':\n', '        mid', ' =', ' (low'],
          acceptedCount: 5
        },
        {
          draft: [' +', ' high', ')', ' //', ' 2\n'],
          acceptedCount: 5
        },
        {
          draft: ['        if', ' arr', '[mid', ']', ' =='],
          acceptedCount: 5
        },
        {
          draft: [' target', ':\n', '            return', ' mid', '\n'],
          acceptedCount: 5
        },
        {
          draft: ['        elif', ' arr', '[mid', ']', ' <'],
          acceptedCount: 5
        },
        {
          draft: [' target', ':\n', '            low', ' =', ' mid'],
          acceptedCount: 5
        },
        {
          draft: [' +', ' 1\n', '        else', ':\n', '            high'],
          acceptedCount: 5
        },
        {
          draft: [' =', ' mid', ' -', ' 1\n', '    return'],
          acceptedCount: 5
        },
        {
          draft: [' None', ' or', ' -1', '\n', '#'],
          acceptedCount: 0,
          correctionToken: ' -1'
        }
      ]
    }
  },
  {
    id: 'prompt-quantum-computing',
    title: 'Quantum Superposition',
    category: 'Reasoning',
    prompt: 'Explain the fundamental principle of quantum superposition in computing.',
    estimatedSpeedup: 1.78,
    tokenSequence: {
      finalText: 'Quantum superposition allows a qubit to exist in a linear combination of both |0⟩ and |1⟩ states simultaneously. Unlike classical bits constrained to binary 0 or 1, quantum systems leverage complex probability amplitudes. This enables parallel evaluation of vast solution spaces before measurement collapses the state.',
      batches: [
        {
          draft: ['Quantum', ' superposition', ' allows', ' a', ' qubit'],
          acceptedCount: 5
        },
        {
          draft: [' to', ' exist', ' in', ' a', ' linear'],
          acceptedCount: 5
        },
        {
          draft: [' combination', ' of', ' both', ' |', '0'],
          acceptedCount: 5
        },
        {
          draft: ['⟩', ' and', ' |', '1', '⟩'],
          acceptedCount: 5
        },
        {
          draft: [' states', ' at', ' the', ' same', ' time.'],
          acceptedCount: 1, // 'states'
          correctionToken: ' simultaneously.'
        },
        {
          draft: [' Unlike', ' classical', ' bits', ' constrained', ' to'],
          acceptedCount: 5
        },
        {
          draft: [' binary', ' 0', ' or', ' 1,', ' quantum'],
          acceptedCount: 5
        },
        {
          draft: [' computers', ' use', ' probability', ' matrices', ' freely.'],
          acceptedCount: 1, // 'systems' was not drafted, draft was 'computers'
          correctionToken: ' systems'
        },
        {
          draft: [' leverage', ' complex', ' probability', ' amplitudes', '.'],
          acceptedCount: 4,
          correctionToken: ' amplitudes.'
        },
        {
          draft: [' This', ' enables', ' parallel', ' evaluation', ' of'],
          acceptedCount: 5
        },
        {
          draft: [' vast', ' solution', ' spaces', ' before', ' measurement'],
          acceptedCount: 5
        },
        {
          draft: [' collapses', ' the', ' state', ' deterministically', '.'],
          acceptedCount: 3,
          correctionToken: ' state.'
        }
      ]
    }
  }
];
