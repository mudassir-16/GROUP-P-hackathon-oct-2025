"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Brain, 
  Target, 
  Users, 
  Globe, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  ArrowRight,
  Lightbulb,
  TrendingUp
} from "lucide-react"

interface ProblemStatement {
  id: string
  title: string
  description: string
  scope: string
  stakeholders: string[]
  impact_metrics: string[]
  urgency_level: "low" | "medium" | "high" | "critical"
  complexity_score: number
  feasibility_score: number
  sdg_alignment: string[]
  root_causes: string[]
  success_criteria: string[]
  constraints: string[]
  opportunities: string[]
}

interface ProblemSynthesizerProps {
  onProblemSynthesized: (problemStatement: ProblemStatement) => void
  initialChallenge?: string
}

export function ProblemSynthesizer({ onProblemSynthesized, initialChallenge }: ProblemSynthesizerProps) {
  const [challengeInput, setChallengeInput] = useState(initialChallenge || "")
  const [context, setContext] = useState("")
  const [targetRegion, setTargetRegion] = useState("")
  const [isSynthesizing, setIsSynthesizing] = useState(false)
  const [synthesizedProblem, setSynthesizedProblem] = useState<ProblemStatement | null>(null)
  const [error, setError] = useState<string | null>(null)

  const synthesizeProblem = async () => {
    if (!challengeInput.trim()) {
      setError("Please enter a challenge to synthesize")
      return
    }

    setIsSynthesizing(true)
    setError(null)

    try {
      const response = await fetch("/api/synthesize-problem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challenge: challengeInput,
          context: context,
          targetRegion: targetRegion
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to synthesize problem")
      }

      const data = await response.json()
      if (data.success) {
        setSynthesizedProblem(data.problemStatement)
        onProblemSynthesized(data.problemStatement)
      } else {
        setError(data.error || "Failed to synthesize problem")
      }
    } catch (error) {
      console.error("Error synthesizing problem:", error)
      setError("Failed to synthesize problem. Please try again.")
    } finally {
      setIsSynthesizing(false)
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical": return "text-red-500 bg-red-500/20"
      case "high": return "text-orange-500 bg-orange-500/20"
      case "medium": return "text-yellow-500 bg-yellow-500/20"
      case "low": return "text-green-500 bg-green-500/20"
      default: return "text-gray-500 bg-gray-500/20"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Problem Synthesizer</h2>
            <p className="text-muted-foreground">Transform challenges into concrete, actionable problem statements</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Challenge Area <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Describe the challenge you want to address (e.g., 'Lack of access to clean water in rural communities', 'Educational inequality in underserved areas')"
              className="w-full p-3 border border-border rounded-lg bg-background h-32"
              value={challengeInput}
              onChange={(e) => setChallengeInput(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Additional Context</label>
              <Textarea
                placeholder="Provide additional context, background information, or specific details..."
                className="w-full p-3 border border-border rounded-lg bg-background h-24"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Target Region</label>
              <Input
                placeholder="e.g., Sub-Saharan Africa, Southeast Asia, Global"
                className="w-full p-3 border border-border rounded-lg bg-background"
                value={targetRegion}
                onChange={(e) => setTargetRegion(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-500 text-sm">{error}</span>
            </div>
          )}

          <Button
            onClick={synthesizeProblem}
            disabled={isSynthesizing || !challengeInput.trim()}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
          >
            {isSynthesizing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Synthesizing Problem...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5 mr-2" />
                Synthesize Problem Statement
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Synthesized Problem Display */}
      {synthesizedProblem && (
        <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Synthesized Problem Statement</h3>
              <p className="text-muted-foreground">AI-analyzed problem breakdown</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Problem Overview */}
            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Problem Overview
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Problem Title</div>
                  <div className="font-medium">{synthesizedProblem.title}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Detailed Description</div>
                  <div className="text-sm leading-relaxed">{synthesizedProblem.description}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Scope</div>
                  <div className="text-sm">{synthesizedProblem.scope}</div>
                </div>
              </div>
            </div>

            {/* Metrics and Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Urgency Level</span>
                </div>
                <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(synthesizedProblem.urgency_level)}`}>
                  {synthesizedProblem.urgency_level.toUpperCase()}
                </div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">Complexity Score</span>
                </div>
                <div className={`text-lg font-bold ${getScoreColor(synthesizedProblem.complexity_score)}`}>
                  {synthesizedProblem.complexity_score}/100
                </div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Feasibility Score</span>
                </div>
                <div className={`text-lg font-bold ${getScoreColor(synthesizedProblem.feasibility_score)}`}>
                  {synthesizedProblem.feasibility_score}/100
                </div>
              </div>
            </div>

            {/* Stakeholders */}
            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                Key Stakeholders
              </h4>
              <div className="flex flex-wrap gap-2">
                {synthesizedProblem.stakeholders.map((stakeholder, index) => (
                  <span key={index} className="bg-purple-500/20 text-purple-400 text-xs px-3 py-1 rounded-full">
                    {stakeholder}
                  </span>
                ))}
              </div>
            </div>

            {/* SDG Alignment */}
            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-500" />
                SDG Alignment
              </h4>
              <div className="flex flex-wrap gap-2">
                {synthesizedProblem.sdg_alignment.map((sdg, index) => (
                  <span key={index} className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full">
                    {sdg}
                  </span>
                ))}
              </div>
            </div>

            {/* Root Causes */}
            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Root Causes
              </h4>
              <div className="space-y-2">
                {synthesizedProblem.root_causes.map((cause, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{cause}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Criteria */}
            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                Success Criteria
              </h4>
              <div className="space-y-2">
                {synthesizedProblem.success_criteria.map((criteria, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{criteria}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Metrics */}
            <div>
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Impact Metrics
              </h4>
              <div className="space-y-2">
                {synthesizedProblem.impact_metrics.map((metric, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{metric}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-border">
              <Button
                onClick={() => {
                  // This would typically move to the next step in the pipeline
                  console.log("Moving to solution generation with problem:", synthesizedProblem)
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Generate Solutions for This Problem
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
