// Database Schema for OpenIdeaX
export interface Blueprint {
  id: string
  title: string
  description: string
  problem_analysis: string
  solutions: Solution[]
  roadmap: RoadmapPhase[]
  sdg_alignment: SDGAlignment[]
  estimated_budget?: string
  team_composition?: string[]
  success_metrics?: string[]
  risks?: string[]
  created_at: Date
  updated_at: Date
  created_by: string
  status: 'draft' | 'published' | 'archived'
  visibility: 'public' | 'private' | 'community'
  tags: string[]
  github_url?: string
  notion_url?: string
  views: number
  stars: number
  forks: number
}

export interface Solution {
  id: string
  title: string
  description: string
  impact: number
  timeline: string
  resources: string[]
  implementation_steps: string[]
  technical_stack?: string[]
  estimated_cost?: string
}

export interface RoadmapPhase {
  id: string
  phase: string
  description: string
  duration: string
  tasks: number
  milestones: string[]
  dependencies?: string[]
  resources_needed: string[]
}

export interface SDGAlignment {
  sdg: string
  alignment_score: number
  description: string
  indicators: string[]
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'user' | 'admin' | 'moderator'
  created_at: Date
  last_active: Date
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  language: string
  timezone: string
}

export interface CollaborationRoom {
  id: string
  blueprint_id: string
  name: string
  description: string
  created_by: string
  created_at: Date
  members: RoomMember[]
  is_active: boolean
  max_members: number
}

export interface RoomMember {
  user_id: string
  role: 'owner' | 'editor' | 'viewer'
  joined_at: Date
  last_active: Date
}

export interface Comment {
  id: string
  blueprint_id: string
  user_id: string
  content: string
  section: string
  created_at: Date
  updated_at: Date
  parent_id?: string
  likes: number
  is_resolved: boolean
}

export interface VisualPrototype {
  id: string
  blueprint_id: string
  type: 'architecture' | 'user-flow' | 'wireframe' | 'concept-art'
  title: string
  description: string
  image_url?: string
  mermaid_code?: string
  created_at: Date
  created_by: string
}

export interface PitchDeck {
  id: string
  blueprint_id: string
  title: string
  slides: PitchSlide[]
  created_at: Date
  created_by: string
  exported_formats: string[]
}

export interface PitchSlide {
  slide_number: number
  title: string
  content: string
  type: 'title' | 'problem' | 'solution' | 'impact' | 'roadmap' | 'team' | 'call-to-action'
}

export interface ImpactScore {
  id: string
  blueprint_id: string
  overall_score: number
  social_impact: number
  environmental_impact: number
  economic_impact: number
  innovation_score: number
  calculated_at: Date
  metrics: ImpactMetric[]
}

export interface ImpactMetric {
  name: string
  value: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
}
