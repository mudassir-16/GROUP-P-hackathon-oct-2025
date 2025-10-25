"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Lightbulb, 
  Code, 
  Zap, 
  Target, 
  Clock, 
  Users, 
  DollarSign, 
  TrendingUp,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Star,
  ArrowRight,
  RefreshCw,
  Download,
  Share2
} from "lucide-react"

interface TechStack {
  category: string
  technologies: string[]
  rationale: string
}

interface SolutionConcept {
  id: string
  title: string
  description: string
  innovation_level: "incremental" | "moderate" | "breakthrough"
  feasibility_score: number
  impact_potential: number
  uniqueness_score: number
  tech_stack: TechStack[]
  implementation_approach: string
  key_features: string[]
  target_users: string[]
  competitive_advantages: string[]
  risks: string[]
  success_metrics: string[]
  estimated_timeline: string
  resource_requirements: string[]
  monetization_strategy?: string
  scalability_potential: number
}

interface SolutionComposerProps {
  problemStatement: any
  onSolutionsGenerated: (solutions: SolutionConcept[]) => void
}

export function SolutionComposer({ problemStatement, onSolutionsGenerated }: SolutionComposerProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSolutions, setGeneratedSolutions] = useState<SolutionConcept[]>([])
  const [selectedSolution, setSelectedSolution] = useState<SolutionConcept | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [generationParams, setGenerationParams] = useState({
    solutionCount: 3,
    innovationFocus: "balanced", // "incremental", "moderate", "breakthrough", "balanced"
    techPreference: "modern", // "traditional", "modern", "cutting-edge"
    budgetRange: "medium" // "low", "medium", "high"
  })

  const generateSolutions = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-solutions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problemStatement,
          solutionCount: generationParams.solutionCount,
          innovationFocus: generationParams.innovationFocus,
          techPreference: generationParams.techPreference,
          budgetRange: generationParams.budgetRange
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate solutions")
      }

      const data = await response.json()
      if (data.success) {
        setGeneratedSolutions(data.solutions)
        onSolutionsGenerated(data.solutions)
      } else {
        setError(data.error || "Failed to generate solutions")
      }
    } catch (error) {
      console.error("Error generating solutions:", error)
      setError("Failed to generate solutions. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const getInnovationColor = (level: string) => {
    switch (level) {
      case "breakthrough": return "text-purple-500 bg-purple-500/20"
      case "moderate": return "text-blue-500 bg-blue-500/20"
      case "incremental": return "text-green-500 bg-green-500/20"
      default: return "text-gray-500 bg-gray-500/20"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Needs Improvement"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Solution Composer</h2>
            <p className="text-muted-foreground">Generate creative solution concepts with comprehensive tech stacks</p>
          </div>
        </div>

        {/* Generation Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Number of Solutions</label>
            <select
              className="w-full p-2 border border-border rounded-lg bg-background"
              value={generationParams.solutionCount}
              onChange={(e) => setGenerationParams({...generationParams, solutionCount: parseInt(e.target.value)})}
            >
              <option value={2}>2 Solutions</option>
              <option value={3}>3 Solutions</option>
              <option value={5}>5 Solutions</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Innovation Focus</label>
            <select
              className="w-full p-2 border border-border rounded-lg bg-background"
              value={generationParams.innovationFocus}
              onChange={(e) => setGenerationParams({...generationParams, innovationFocus: e.target.value})}
            >
              <option value="incremental">Incremental</option>
              <option value="moderate">Moderate</option>
              <option value="breakthrough">Breakthrough</option>
              <option value="balanced">Balanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tech Preference</label>
            <select
              className="w-full p-2 border border-border rounded-lg bg-background"
              value={generationParams.techPreference}
              onChange={(e) => setGenerationParams({...generationParams, techPreference: e.target.value})}
            >
              <option value="traditional">Traditional</option>
              <option value="modern">Modern</option>
              <option value="cutting-edge">Cutting-edge</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Budget Range</label>
            <select
              className="w-full p-2 border border-border rounded-lg bg-background"
              value={generationParams.budgetRange}
              onChange={(e) => setGenerationParams({...generationParams, budgetRange: e.target.value})}
            >
              <option value="low">Low Budget</option>
              <option value="medium">Medium Budget</option>
              <option value="high">High Budget</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-500 text-sm">{error}</span>
          </div>
        )}

        <Button
          onClick={generateSolutions}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Composing Solutions...
            </>
          ) : (
            <>
              <Lightbulb className="w-5 h-5 mr-2" />
              Generate Solution Concepts
            </>
          )}
        </Button>
      </Card>

      {/* Generated Solutions */}
      {generatedSolutions.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Generated Solution Concepts</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setGeneratedSolutions([])}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {generatedSolutions.map((solution, index) => (
              <Card key={solution.id} className="p-6 bg-card/50 backdrop-blur border-border/50">
                <div className="space-y-4">
                  {/* Solution Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-2">{solution.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{solution.description}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getInnovationColor(solution.innovation_level)}`}>
                      {solution.innovation_level.toUpperCase()}
                    </div>
                  </div>

                  {/* Scores */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Feasibility</div>
                      <div className={`text-lg font-bold ${getScoreColor(solution.feasibility_score)}`}>
                        {solution.feasibility_score}%
                      </div>
                      <div className="text-xs text-muted-foreground">{getScoreLabel(solution.feasibility_score)}</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Impact</div>
                      <div className={`text-lg font-bold ${getScoreColor(solution.impact_potential)}`}>
                        {solution.impact_potential}%
                      </div>
                      <div className="text-xs text-muted-foreground">{getScoreLabel(solution.impact_potential)}</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Uniqueness</div>
                      <div className={`text-lg font-bold ${getScoreColor(solution.uniqueness_score)}`}>
                        {solution.uniqueness_score}%
                      </div>
                      <div className="text-xs text-muted-foreground">{getScoreLabel(solution.uniqueness_score)}</div>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div>
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      Key Features
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {solution.key_features.slice(0, 3).map((feature, i) => (
                        <span key={i} className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                      {solution.key_features.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{solution.key_features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tech Stack Preview */}
                  <div>
                    <h5 className="font-medium mb-2 flex items-center gap-2">
                      <Code className="w-4 h-4 text-blue-500" />
                      Tech Stack
                    </h5>
                    <div className="space-y-2">
                      {solution.tech_stack.slice(0, 2).map((stack, i) => (
                        <div key={i} className="text-sm">
                          <div className="font-medium">{stack.category}</div>
                          <div className="text-muted-foreground">{stack.technologies.slice(0, 3).join(", ")}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline & Resources */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span className="font-medium">Timeline</span>
                      </div>
                      <div className="text-muted-foreground">{solution.estimated_timeline}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span className="font-medium">Resources</span>
                      </div>
                      <div className="text-muted-foreground">{solution.resource_requirements.length} required</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedSolution(solution)}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // This would typically move to the next step in the pipeline
                        console.log("Selected solution for blueprint generation:", solution)
                      }}
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Use This
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Solution Detail Modal */}
      {selectedSolution && (
        <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Solution Details</h3>
            <Button variant="outline" onClick={() => setSelectedSolution(null)}>
              Close
            </Button>
          </div>

          <div className="space-y-6">
            {/* Overview */}
            <div>
              <h4 className="font-semibold text-lg mb-3">{selectedSolution.title}</h4>
              <p className="text-muted-foreground leading-relaxed">{selectedSolution.description}</p>
            </div>

            {/* Implementation Approach */}
            <div>
              <h5 className="font-semibold mb-2">Implementation Approach</h5>
              <p className="text-sm text-muted-foreground">{selectedSolution.implementation_approach}</p>
            </div>

            {/* Tech Stack Details */}
            <div>
              <h5 className="font-semibold mb-3">Complete Tech Stack</h5>
              <div className="space-y-4">
                {selectedSolution.tech_stack.map((stack, index) => (
                  <div key={index} className="p-4 bg-muted/50 rounded-lg">
                    <h6 className="font-medium mb-2">{stack.category}</h6>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {stack.technologies.map((tech, i) => (
                        <span key={i} className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{stack.rationale}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitive Advantages */}
            <div>
              <h5 className="font-semibold mb-2">Competitive Advantages</h5>
              <div className="space-y-1">
                {selectedSolution.competitive_advantages.map((advantage, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{advantage}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Metrics */}
            <div>
              <h5 className="font-semibold mb-2">Success Metrics</h5>
              <div className="space-y-1">
                {selectedSolution.success_metrics.map((metric, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{metric}</span>
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
