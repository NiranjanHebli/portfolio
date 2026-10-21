// ============================================================================
// PROJECT TYPES
// ============================================================================

export interface ImpactMetric {
  label: string;
  metric: string;
  numericValue: number;
  prefix?: string;
  suffix: string;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  role: string;
  latency: string;
}

export interface Project {
  slug: string;
  title: string;
  codename: string;
  summary: string;
  problem: string;
  stack: string[];
  skills: string[];
  repo: string;
  liveUrl: string;
  diagramUrl: string;
  architectureAscii: string;
  architectureNodes: ArchitectureNode[];
  metrics: string[];
  experienceIds: string[];
  githubMeta: {
    stars: number;
    lastCommit: string;
    ciStatus: 'passing' | 'running' | 'failing';
  };
  featured?: boolean;
  completionDate?: string;
}

// ============================================================================
// PROJECTS DATASET
// ============================================================================

export const PROJECTS: Project[] = [
  {
    slug: 'operations-assistant',
    title: 'Operations Assistant (CrewAI & MCP)',
    codename: '06/2026 - 06/2026',
    summary:
      'Architected a CrewAI multi-agent workflow via MCP, autonomously synthesising operational data into structured reports 5 times faster than manual processes, processing 60+ documents per minute.',
    problem:
      'Manual operational report generation across siloed APIs, enterprise databases, and unstructured web sources was slow and vulnerable to factual inaccuracies.',
    stack: [
      'CrewAI',
      'Model Context Protocol (MCP)',
      'Python',
      'OpenTelemetry',
      'Langfuse',
      'FastAPI',
    ],
    skills: [
      'CrewAI',
      'Model Context Protocol',
      'Multi-Agent System',
      'Langfuse',
      'FastAPI',
      'Python',
    ],
    repo: 'https://github.com/NiranjanHebli/operations-assistant/tree/main',
    liveUrl: 'https://github.com/NiranjanHebli/operations-assistant/tree/main',
    diagramUrl: '/diagrams/operations-assistant.mmd',
    architectureAscii: `[Operational Data Sources]
          |
          v
 [CrewAI Multi-Agent Workflow]
   +-- Research Agent
   +-- Analysis Agent
   +-- Synthesis Agent
          |
  +-------+-------+
  v               v
[MCP Server]    [MCP Server]
 (SSE / Web)    (Stdio / DB)
  +-------+-------+
          v
[Human-in-the-Loop Gate]
          |
          v
[Structured Report + Langfuse Observability]`,
    architectureNodes: [
      {
        id: 'crew-orch',
        label: 'CrewAI Orchestrator',
        role: 'Autonomous multi-agent delegation & task graph',
        latency: '180ms',
      },
      {
        id: 'mcp-sse',
        label: 'MCP Server (SSE)',
        role: 'Real-time web scraping and external API tooling',
        latency: '95ms',
      },
      {
        id: 'mcp-stdio',
        label: 'MCP Server (Stdio)',
        role: 'Local document retrieval & structured DB queries',
        latency: '35ms',
      },
      {
        id: 'hitl-gate',
        label: 'HITL Verification',
        role: 'Human-in-the-loop accuracy verification checkpoint',
        latency: '40ms',
      },
      {
        id: 'langfuse-trace',
        label: 'Langfuse + OTel',
        role: 'Trajectory monitoring and latency trace telemetry',
        latency: '12ms',
      },
    ],
    metrics: [
      'Architected a CrewAI multi-agent workflow via MCP, autonomously synthesising operational data into structured reports 5 times faster than manual processes, processing 60+ documents per minute.',
      'Engineered dual MCP servers (SSE & Stdio) to expose custom execution tools for real-time document retrieval, database queries, and web scraping.',
      'Implemented LLM observability pipelines via OpenTelemetry and Langfuse, integrating a Human-in-the-Loop (HITL) gate to ensure factual accuracy.',
    ],
    experienceIds: ['exp-01', 'exp-04'],
    githubMeta: {
      stars: 0,
      lastCommit: '06/2026',
      ciStatus: 'passing',
    },
    featured: true,
  },
  {
    slug: 'drive-thru-voice-assistant',
    title: 'Drive Thru Voice Assistant',
    codename: '05/2026 - 05/2026',
    summary:
      'Built a voice-first AI ordering assistant for QSRs using Llama-3, Faster-Whisper, Edge-TTS, and FastAPI with multi-turn conversational memory.',
    problem:
      'High ambient noise and rapid, conversational customer changes at drive-thru kiosks cause high order error rates and costly latency spikes.',
    stack: [
      'Llama-3',
      'Faster-Whisper',
      'Edge-TTS',
      'FastAPI',
      'Python',
      'WebSockets',
    ],
    skills: [
      'Faster-Whisper',
      'Edge-TTS',
      'FastAPI',
      'Python',
      'LLM Tool Calling',
      'Conversational Memory',
    ],
    repo: 'https://github.com/NiranjanHebli/drive-thru-voice-assistant',
    liveUrl: 'https://github.com/NiranjanHebli/drive-thru-voice-assistant',
    diagramUrl: '/diagrams/drive-thru-voice.mmd',
    architectureAscii: `[Customer Audio Stream]
          |
          v
[Faster-Whisper STT (<120ms)]
          |
          v
[FastAPI Real-Time WebSocket Session]
          |
          v
[Llama-3 Reasoning + Conversational Memory]
          |
          v
[Deterministic JSON Menu Tool-Calling]
          |
          v
[Edge-TTS Audio Response (<95ms)]`,
    architectureNodes: [
      {
        id: 'stt-whisper',
        label: 'Faster-Whisper STT',
        role: 'Low-latency streaming speech-to-text',
        latency: '115ms',
      },
      {
        id: 'session-ws',
        label: 'FastAPI Router',
        role: 'Bi-directional audio/event WebSocket gateway',
        latency: '18ms',
      },
      {
        id: 'llama-memory',
        label: 'Llama-3 Engine',
        role: 'Multi-turn order state tracking & intent reasoning',
        latency: '210ms',
      },
      {
        id: 'menu-tool',
        label: 'Menu Schema Tool',
        role: 'Deterministic validation against live pricing & items',
        latency: '14ms',
      },
      {
        id: 'tts-edge',
        label: 'Edge-TTS Streamer',
        role: 'Natural audio synthesis streamed to speaker',
        latency: '95ms',
      },
    ],
    metrics: [
      'Built a voice-first AI ordering assistant for QSRs using Llama-3, Faster-Whisper, Edge-TTS, and FastAPI.',
      'Implemented conversational memory to track order history and maintain context across multiple turns.',
      'Engineered deterministic LLM tool-calling to strictly validate user requests against structured JSON menus.',
    ],
    experienceIds: ['exp-01', 'exp-04'],
    githubMeta: {
      stars: 0,
      lastCommit: '05/2026',
      ciStatus: 'passing',
    },
    featured: true,
  },
  {
    slug: 'ncert-rag-system',
    title: 'NCERT based RAG System',
    codename: '04/2026 - 04/2026',
    summary:
      'Hybrid Retrieval (BM25 & ChromaDB) and OCR-augmented AI study assistant achieving 1.0 faithfulness and 0.98 answer relevancy evaluated on Ragas.',
    problem:
      'Standard vector-only RAG hallucinated when answering questions grounded in scanned textbooks containing complex diagrams and tables.',
    stack: [
      'Groq (Llama 3.1)',
      'ChromaDB',
      'BM25',
      'Ragas',
      'PaddleOCR',
      'Python',
    ],
    skills: [
      'Hybrid RAG',
      'BM25 Retrieval',
      'ChromaDB',
      'Ragas Evaluation',
      'OCR Ingestion',
      'Groq API',
    ],
    repo: 'https://github.com/NiranjanHebli/ncert-class-ix-retrieval-system',
    liveUrl: 'https://github.com/NiranjanHebli/ncert-class-ix-retrieval-system',
    diagramUrl: '/diagrams/ncert-rag-architecture.svg',
    architectureAscii: `[Scanned NCERT Textbook PDFs]
          |
          v
[PaddleOCR Diagram & Table Ingestion]
          |
    +-----+-----+
    v           v
[BM25 Lexical] [ChromaDB Vector]
    +-----+-----+
          v
[Reciprocal Rank Fusion (RRF)]
          |
          v
[Strict Grounding Prompt + Groq Llama 3.1]
          |
          v
[Ragas Validation Pipeline (1.0 Faithfulness)]`,
    architectureNodes: [
      {
        id: 'ocr-pipe',
        label: 'OCR Ingestion',
        role: 'Diagram extraction & text bounding box parser',
        latency: '140ms',
      },
      {
        id: 'rrf-hybrid',
        label: 'Hybrid RRF Engine',
        role: 'BM25 keyword + ChromaDB dense vector fusion',
        latency: '42ms',
      },
      {
        id: 'groq-infer',
        label: 'Groq (Llama 3.1)',
        role: 'Strict textbook-grounded reasoning pipeline',
        latency: '160ms',
      },
      {
        id: 'ragas-eval',
        label: 'Ragas Evaluator',
        role: '30-query automated faithfulness & relevancy audit',
        latency: '28ms',
      },
    ],
    metrics: [
      'Built a RAG-powered AI study assistant using Python and Groq (Llama 3.1) for an ed-tech non-profit problem statement.',
      'Implemented Hybrid Retrieval (BM25 & ChromaDB) to accurately process noisy, real-world text inputs.',
      'Engineered strict grounding prompts to eliminate hallucinations and enforce textbook-only answers.',
      'Automated evaluation pipelines using Ragas, validating the system against 30 test queries to achieve a 1.0 faithfulness score and a 0.98 answer relevancy metric.',
      'Integrated a OCR workflow to parse unstructured text from diagrams and scanned PDF pages, overcoming the limitations of pypdf4llm and ensuring comprehensive data ingestion for the RAG knowledge base.',
    ],
    experienceIds: ['exp-01', 'exp-04'],
    githubMeta: {
      stars: 0,
      lastCommit: '04/2026',
      ciStatus: 'passing',
    },
    featured: true,
  },
];

// ============================================================================
// SELECTOR HELPERS
// ============================================================================

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
