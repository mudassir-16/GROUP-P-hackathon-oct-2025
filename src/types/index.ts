export interface Problem {
  id: string;
  title: string;
  description: string;
  category: string;
  sdgGoals: number[];
  complexity: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface Solution {
  id: string;
  problemId: string;
  title: string;
  description: string;
  approach: string;
  techStack: string[];
  implementation: string;
  timeline: string;
  resources: string[];
  stakeholders: string[];
  kpis: string[];
  impactScore: number;
  feasibilityScore: number;
  sustainabilityScore: number;
  sdgAlignment: number[];
  createdAt: Date;
}

// New PRD-compliant interfaces
export interface Idea {
  id: string;
  title: string;
  problem_text: string;
  summary: string;
  solutions: SolutionConcept[];
  roadmap: RoadmapPhase[];
  partners: PartnerSuggestion[];
  tags: string[];
  creator: {
    userId: string;
    name: string;
  };
  createdAt: Date;
  public: boolean;
  upvotes: number;
  remixes: number;
  conceptImageUrl?: string;
}

export interface SolutionConcept {
  id: number;
  title: string;
  description: string;
  stakeholders: string[];
  tech_stack: string[];
  effort_level: 'low' | 'medium' | 'high';
  impact_estimate: 'low' | 'medium' | 'high';
}

export interface PartnerSuggestion {
  name: string;
  type: string;
  reason: string;
  contact_link?: string;
}

export interface Room {
  roomId: string;
  ideaId: string;
  participants: Participant[];
  chat: ChatMessage[];
  blueprint: Idea;
  createdAt: Date;
}

export interface Participant {
  userId: string;
  name: string;
  avatar?: string;
  joinedAt: Date;
}

export interface Roadmap {
  id: string;
  solutionId: string;
  phases: RoadmapPhase[];
  totalDuration: string;
  milestones: Milestone[];
  dependencies: string[];
  risks: Risk[];
  createdAt: Date;
}

export interface RoadmapPhase {
  id: string;
  name: string;
  description: string;
  duration: string;
  deliverables: string[];
  dependencies: string[];
  resources: string[];
  phase: string;
  tasks: string[];
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  targetDate: string;
  successCriteria: string[];
  dependencies: string[];
}

export interface Risk {
  id: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
}

export interface ImpactScore {
  relevance: number;
  feasibility: number;
  impact: number;
  sustainability: number;
  innovation: number;
  collaboration: number;
}

export interface AIPersona {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  perspective: string;
}

export interface CoCreateRoom {
  id: string;
  problemId: string;
  participants: string[];
  aiPersonas: AIPersona[];
  messages: ChatMessage[];
  activeIdeas: string[];
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  sender: 'user' | 'ai';
  personaId?: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'idea' | 'vote' | 'synthesis';
}

export interface Blueprint {
  id: string;
  title: string;
  description: string;
  problem: Problem;
  solution: Solution;
  roadmap: Roadmap;
  impactScore: ImpactScore;
  visualPrototype?: string;
  pitchDeck?: string;
  license: 'CC-BY-SA' | 'CC-BY' | 'MIT' | 'Apache-2.0';
  provenance: ProvenanceCard;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProvenanceCard {
  dataSources: string[];
  aiModels: string[];
  reasoning: string;
  confidence: number;
  biasNotes: string[];
  lastUpdated: Date;
}

export interface SDGGoal {
  id: number;
  title: string;
  description: string;
  targets: string[];
  indicators: string[];
}

export interface ExportOptions {
  format: 'notion' | 'pdf' | 'markdown' | 'json';
  includeVisuals: boolean;
  includeRoadmap: boolean;
  includeImpact: boolean;
}
