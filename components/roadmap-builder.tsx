"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Calendar, 
  Target, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Download,
  Share2,
  Edit,
  Plus,
  Trash2,
  Save
} from "lucide-react"

interface Milestone {
  id: string
  title: string
  description: string
  due_date: string
  status: "not_started" | "in_progress" | "completed" | "blocked"
  priority: "low" | "medium" | "high" | "critical"
  dependencies: string[]
  deliverables: string[]
  success_criteria: string[]
}

interface Stakeholder {
  id: string
  name: string
  role: string
  organization: string
  contact_info: string
  influence_level: "low" | "medium" | "high" | "critical"
  engagement_level: "passive" | "supportive" | "active" | "champion"
  responsibilities: string[]
  communication_preferences: string[]
}

interface KPI {
  id: string
  name: string
  description: string
  metric_type: "quantitative" | "qualitative"
  target_value: string
  current_value: string
  unit: string
  frequency: "daily" | "weekly" | "monthly" | "quarterly" | "annually"
  owner: string
  measurement_method: string
  baseline_value?: string
  target_date: string
}

interface Phase {
  id: string
  name: string
  description: string
  start_date: string
  end_date: string
  duration_weeks: number
  status: "planning" | "active" | "completed" | "on_hold"
  milestones: Milestone[]
  budget_allocation: number
  resource_requirements: string[]
  risks: string[]
  success_criteria: string[]
}

interface Roadmap {
  id: string
  title: string
  description: string
  total_duration_months: number
  start_date: string
  end_date: string
  phases: Phase[]
  stakeholders: Stakeholder[]
  kpis: KPI[]
  budget_breakdown: {
    total_budget: number
    phases: { [phaseId: string]: number }
    categories: { [category: string]: number }
  }
  risk_assessment: {
    high_risks: string[]
    medium_risks: string[]
    low_risks: string[]
    mitigation_strategies: string[]
  }
  success_metrics: string[]
}

interface RoadmapBuilderProps {
  solution: any
  problemStatement: any
  onRoadmapGenerated: (roadmap: Roadmap) => void
}

export function RoadmapBuilder({ solution, problemStatement, onRoadmapGenerated }: RoadmapBuilderProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedRoadmap, setGeneratedRoadmap] = useState<Roadmap | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null)
  const [editingMode, setEditingMode] = useState(false)
  const [roadmapParams, setRoadmapParams] = useState({
    timeline_preference: "standard", // "accelerated", "standard", "extended"
    budget_range: "medium", // "low", "medium", "high"
    team_size: "medium", // "small", "medium", "large"
    complexity_level: "moderate", // "simple", "moderate", "complex"
    stakeholder_engagement: "high" // "low", "medium", "high"
  })

  const generateRoadmap = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          solution,
          problemStatement,
          timeline_preference: roadmapParams.timeline_preference,
          budget_range: roadmapParams.budget_range,
          team_size: roadmapParams.team_size,
          complexity_level: roadmapParams.complexity_level,
          stakeholder_engagement: roadmapParams.stakeholder_engagement
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate roadmap")
      }

      const data = await response.json()
      if (data.success) {
        setGeneratedRoadmap(data.roadmap)
        onRoadmapGenerated(data.roadmap)
      } else {
        setError(data.error || "Failed to generate roadmap")
      }
    } catch (error) {
      console.error("Error generating roadmap:", error)
      setError("Failed to generate roadmap. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-500 bg-green-500/20"
      case "in_progress": return "text-blue-500 bg-blue-500/20"
      case "blocked": return "text-red-500 bg-red-500/20"
      case "not_started": return "text-gray-500 bg-gray-500/20"
      default: return "text-gray-500 bg-gray-500/20"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "text-red-500 bg-red-500/20"
      case "high": return "text-orange-500 bg-orange-500/20"
      case "medium": return "text-yellow-500 bg-yellow-500/20"
      case "low": return "text-green-500 bg-green-500/20"
      default: return "text-gray-500 bg-gray-500/20"
    }
  }

  const getInfluenceColor = (level: string) => {
    switch (level) {
      case "critical": return "text-purple-500"
      case "high": return "text-blue-500"
      case "medium": return "text-yellow-500"
      case "low": return "text-gray-500"
      default: return "text-gray-500"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const calculateProgress = (phase: Phase) => {
    if (phase.milestones.length === 0) return 0
    const completed = phase.milestones.filter(m => m.status === "completed").length
    return Math.round((completed / phase.milestones.length) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Roadmap Builder</h2>
            <p className="text-muted-foreground">Create comprehensive implementation timelines with milestones, stakeholders, and KPIs</p>
          </div>
        </div>

        {/* Generation Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Timeline</label>
            <select
              className="w-full p-2 border border-border rounded-lg bg-background"
              value={roadmapParams.timeline_preference}
              onChange={(e) => setRoadmapParams({...roadmapParams, timeline_preference: e.target.value})}
            >
              <option value="accelerated">Accelerated</option>
              <option value="standard">Standard</option>
              <option value="extended">Extended</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Budget Range</label>
            <select
              className="w-full p-2 border border-border rounded-lg bg-background"
              value={roadmapParams.budget_range}
              onChange={(e) => setRoadmapParams({...roadmapParams, budget_range: e.target.value})}
            >
              <option value="low">Low Budget</option>
              <option value="medium">Medium Budget</option>
              <option value="high">High Budget</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Team Size</label>
            <select
              className="w-full p-2 border border-border rounded-lg bg-background"
              value={roadmapParams.team_size}
              onChange={(e) => setRoadmapParams({...roadmapParams, team_size: e.target.value})}
            >
              <option value="small">Small Team (2-5)</option>
              <option value="medium">Medium Team (6-15)</option>
              <option value="large">Large Team (16+)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Complexity</label>
            <select
              className="w-full p-2 border border-border rounded-lg bg-background"
              value={roadmapParams.complexity_level}
              onChange={(e) => setRoadmapParams({...roadmapParams, complexity_level: e.target.value})}
            >
              <option value="simple">Simple</option>
              <option value="moderate">Moderate</option>
              <option value="complex">Complex</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stakeholder Engagement</label>
            <select
              className="w-full p-2 border border-border rounded-lg bg-background"
              value={roadmapParams.stakeholder_engagement}
              onChange={(e) => setRoadmapParams({...roadmapParams, stakeholder_engagement: e.target.value})}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-red-500 text-sm">{error}</span>
          </div>
        )}

        <Button
          onClick={generateRoadmap}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Building Roadmap...
            </>
          ) : (
            <>
              <Calendar className="w-5 h-5 mr-2" />
              Generate Implementation Roadmap
            </>
          )}
        </Button>
      </Card>

      {/* Generated Roadmap */}
      {generatedRoadmap && (
        <div className="space-y-6">
          {/* Roadmap Overview */}
          <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">{generatedRoadmap.title}</h3>
                <p className="text-muted-foreground">{generatedRoadmap.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingMode(!editingMode)}>
                  <Edit className="w-4 h-4 mr-2" />
                  {editingMode ? "View Mode" : "Edit Mode"}
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Roadmap Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-500">{generatedRoadmap.total_duration_months}</div>
                <div className="text-sm text-muted-foreground">Months</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-500">{generatedRoadmap.phases.length}</div>
                <div className="text-sm text-muted-foreground">Phases</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-500">{generatedRoadmap.stakeholders.length}</div>
                <div className="text-sm text-muted-foreground">Stakeholders</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-500">{generatedRoadmap.kpis.length}</div>
                <div className="text-sm text-muted-foreground">KPIs</div>
              </div>
            </div>

            {/* Budget Overview */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold mb-2">Budget Overview</h4>
              <div className="text-2xl font-bold text-green-500">
                {formatCurrency(generatedRoadmap.budget_breakdown.total_budget)}
              </div>
              <div className="text-sm text-muted-foreground">Total Project Budget</div>
            </div>
          </Card>

          {/* Phases */}
          <div>
            <h3 className="text-xl font-bold mb-4">Implementation Phases</h3>
            <div className="space-y-4">
              {generatedRoadmap.phases.map((phase, index) => (
                <Card key={phase.id} className="p-6 bg-card/50 backdrop-blur border-border/50">
                  <div className="space-y-4">
                    {/* Phase Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-lg">{phase.name}</h4>
                        <p className="text-sm text-muted-foreground">{phase.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Duration</div>
                        <div className="font-semibold">{phase.duration_weeks} weeks</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{calculateProgress(phase)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${calculateProgress(phase)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Phase Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Budget</div>
                        <div className="font-semibold">{formatCurrency(phase.budget_allocation)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Milestones</div>
                        <div className="font-semibold">{phase.milestones.length}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Status</div>
                        <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(phase.status)}`}>
                          {phase.status.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Milestones */}
                    {phase.milestones.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-2">Key Milestones</h5>
                        <div className="space-y-2">
                          {phase.milestones.slice(0, 3).map((milestone) => (
                            <div key={milestone.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                              <div className={`w-2 h-2 rounded-full ${getPriorityColor(milestone.priority).split(' ')[0].replace('text-', 'bg-')}`}></div>
                              <span className="text-sm flex-1">{milestone.title}</span>
                              <span className="text-xs text-muted-foreground">{milestone.due_date}</span>
                            </div>
                          ))}
                          {phase.milestones.length > 3 && (
                            <div className="text-xs text-muted-foreground text-center">
                              +{phase.milestones.length - 3} more milestones
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPhase(phase)}
                      className="w-full"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      View Phase Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Stakeholders */}
          <div>
            <h3 className="text-xl font-bold mb-4">Key Stakeholders</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedRoadmap.stakeholders.map((stakeholder) => (
                <Card key={stakeholder.id} className="p-4 bg-card/50 backdrop-blur border-border/50">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold">{stakeholder.name}</h4>
                      <p className="text-sm text-muted-foreground">{stakeholder.role}</p>
                      <p className="text-xs text-muted-foreground">{stakeholder.organization}</p>
                    </div>
                    <div className="flex gap-2">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getInfluenceColor(stakeholder.influence_level)} bg-opacity-20`}>
                        {stakeholder.influence_level.toUpperCase()}
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(stakeholder.engagement_level)}`}>
                        {stakeholder.engagement_level.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stakeholder.responsibilities.slice(0, 2).join(", ")}
                      {stakeholder.responsibilities.length > 2 && "..."}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* KPIs */}
          <div>
            <h3 className="text-xl font-bold mb-4">Key Performance Indicators</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedRoadmap.kpis.map((kpi) => (
                <Card key={kpi.id} className="p-4 bg-card/50 backdrop-blur border-border/50">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold">{kpi.name}</h4>
                      <p className="text-sm text-muted-foreground">{kpi.description}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-muted-foreground">Target</div>
                        <div className="font-semibold">{kpi.target_value} {kpi.unit}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Frequency</div>
                        <div className="text-sm font-medium">{kpi.frequency}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Owner: {kpi.owner} | Due: {kpi.target_date}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Risk Assessment */}
          <div>
            <h3 className="text-xl font-bold mb-4">Risk Assessment</h3>
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-red-500 mb-2">High Risks</h4>
                  <div className="space-y-1">
                    {generatedRoadmap.risk_assessment.high_risks.map((risk, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-500 mb-2">Medium Risks</h4>
                  <div className="space-y-1">
                    {generatedRoadmap.risk_assessment.medium_risks.map((risk, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-green-500 mb-2">Low Risks</h4>
                  <div className="space-y-1">
                    {generatedRoadmap.risk_assessment.low_risks.map((risk, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Phase Detail Modal */}
      {selectedPhase && (
        <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Phase Details: {selectedPhase.name}</h3>
            <Button variant="outline" onClick={() => setSelectedPhase(null)}>
              Close
            </Button>
          </div>

          <div className="space-y-6">
            {/* Phase Overview */}
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-muted-foreground">{selectedPhase.description}</p>
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Start Date</h4>
                <p className="text-muted-foreground">{selectedPhase.start_date}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">End Date</h4>
                <p className="text-muted-foreground">{selectedPhase.end_date}</p>
              </div>
            </div>

            {/* Milestones */}
            <div>
              <h4 className="font-semibold mb-3">Milestones</h4>
              <div className="space-y-3">
                {selectedPhase.milestones.map((milestone) => (
                  <div key={milestone.id} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{milestone.title}</h5>
                      <div className="flex gap-2">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(milestone.status)}`}>
                          {milestone.status.toUpperCase()}
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(milestone.priority)}`}>
                          {milestone.priority.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                    <div className="text-xs text-muted-foreground">Due: {milestone.due_date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resource Requirements */}
            <div>
              <h4 className="font-semibold mb-2">Resource Requirements</h4>
              <div className="space-y-1">
                {selectedPhase.resource_requirements.map((resource, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{resource}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
