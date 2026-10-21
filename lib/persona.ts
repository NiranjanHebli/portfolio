export interface PersonaProfile {
  name: string;
  shortName: string;
  initials: string;
  badgeId: string;
  title: string;
  clearance: string;
  department: string;
  issuedDate: string;
  location: string;
  email: string;
  githubHandle: string;
  githubUrl: string;
  linkedinUrl: string;
  codechefUrl: string;
  googleSkillBoostUrl: string;
  resumeUrl: string;
  bioShort: string;
  bioExtended: string;
  stackHighlights: string[];
}

export const PERSONA: PersonaProfile = {
  name: 'NIRANJAN HEBLI',
  shortName: 'NIRANJAN HEBLI',
  initials: 'NH',
  badgeId: 'NH-AIE-2026',
  title: 'AI Engineer',
  clearance: 'AI ENGINEER',
  department: 'AI & SYSTEMS ENGINEERING',
  issuedDate: '2026 // VERIFIED',
  location: 'Ponda - Goa / India',
  email: 'niranjanhebli77@gmail.com',
  githubHandle: 'NiranjanHebli',
  githubUrl: 'https://github.com/NiranjanHebli',
  linkedinUrl: 'https://www.linkedin.com/in/niranjan-hebli-333211211/',
  codechefUrl: 'https://www.codechef.com/users/niranjan_hebli',
  googleSkillBoostUrl: 'https://skills.google/public_profiles/068568ff-9859-4969-9af7-3000b7ca1f74',
  resumeUrl: '/Niranjan_Hebli_Resume.pdf',
  bioShort:
    'Solutions-driven AI Engineer specializing in building scalable AI applications, Vision-Language Models, and intelligent automation workflows. Proven ability to translate complex business requirements into robust AI solutions, with a strong foundation in machine learning and scalable product development.',
  bioExtended:
    'AI Engineer with production experience architecting stateful LangGraph conversational agents on Azure Cloud, CrewAI multi-agent workflows over dual MCP servers (SSE & Stdio), voice-first Llama-3 assistants, and Ragas-verified Hybrid RAG pipelines (BM25 + ChromaDB + OCR). Holds a PG Diploma in Agentic AI & ML from IIT Gandhinagar (10 CGPA), B.Tech in CSE from NIT Goa (8.16 CGPA), and pursuing M.Tech in CSE at IIT Kharagpur (Batch 2026 - 2028).',
  stackHighlights: [
    'LangGraph & LangChain',
    'CrewAI & AutoGen',
    'Model Context Protocol (MCP)',
    'Hybrid RAG (BM25 + ChromaDB)',
    'Python, Golang, C++, TypeScript',
    'LangSmith, Langfuse & Ragas',
    'PyTorch, OpenCV, YOLO & VLMs',
    'Azure, GCP, AWS & Docker',
    'FastAPI, NestJS & ReactJS',
  ],
};
