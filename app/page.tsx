"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Zap, Users, TrendingUp, Globe } from "lucide-react"
import { CoCreationRoom } from "@/components/co-creation-room"
import { VisualPrototypeGenerator } from "@/components/visual-prototype-generator"
import { PitchDeckGenerator } from "@/components/pitch-deck-generator"
import { ImpactScorecard } from "@/components/impact-scorecard"
import { ProblemSynthesizer } from "@/components/problem-synthesizer"
import { SolutionComposer } from "@/components/solution-composer"
import { RoadmapBuilder } from "@/components/roadmap-builder"
import { KnowledgeGraphViewer } from "@/components/knowledge-graph-viewer"
import { EthicalImpactSummary } from "@/components/ethical-impact-summary"

export default function Home() {
  const [showForm, setShowForm] = useState(false)
  const [blueprint, setBlueprint] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    challengeArea: "",
    specificProblem: "",
    targetRegion: ""
  })
  const [showCoCreationRoom, setShowCoCreationRoom] = useState(false)
  const [showProblemSynthesizer, setShowProblemSynthesizer] = useState(false)
  const [synthesizedProblem, setSynthesizedProblem] = useState(null)
  const [showSolutionComposer, setShowSolutionComposer] = useState(false)
  const [generatedSolutions, setGeneratedSolutions] = useState(null)
  const [showRoadmapBuilder, setShowRoadmapBuilder] = useState(false)
  const [selectedSolution, setSelectedSolution] = useState(null)
  const [generatedRoadmap, setGeneratedRoadmap] = useState(null)
  const [showKnowledgeGraph, setShowKnowledgeGraph] = useState(false)

  const handleProblemSynthesized = (problemStatement: any) => {
    setSynthesizedProblem(problemStatement)
    // Move to solution composer
    setShowProblemSynthesizer(false)
    setShowSolutionComposer(true)
  }

  const handleSolutionsGenerated = (solutions: any[]) => {
    setGeneratedSolutions(solutions)
    // Move to roadmap builder with the best solution
    const bestSolution = solutions.reduce((best, current) => 
      (current.feasibility_score + current.impact_potential) > (best.feasibility_score + best.impact_potential) 
        ? current : best
    )
    setSelectedSolution(bestSolution)
    setShowSolutionComposer(false)
    setShowRoadmapBuilder(true)
  }

  const handleRoadmapGenerated = (roadmap: any) => {
    setGeneratedRoadmap(roadmap)
    // Move to blueprint generation with roadmap context
    setFormData({
      challengeArea: synthesizedProblem?.title || "Generated Challenge",
      specificProblem: `${synthesizedProblem?.description || ""}\n\nSelected Solution: ${selectedSolution?.title}\n${selectedSolution?.description}\n\nImplementation Roadmap: ${roadmap.title}\n${roadmap.description}`,
      targetRegion: synthesizedProblem?.scope || "Global"
    })
    setShowRoadmapBuilder(false)
    setShowForm(true)
  }

  const generateBlueprint = async () => {
    if (!formData.challengeArea || !formData.specificProblem) {
      alert("Please fill in all required fields")
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-blueprint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problemStatement: formData.specificProblem,
          context: formData.challengeArea,
          targetAudience: "Global community",
          constraints: `Target region: ${formData.targetRegion || "Global"}`
        }),
      })

      const data = await response.json()
      if (data.success) {
        setBlueprint(data.blueprint)
      } else {
        alert("Failed to generate blueprint: " + data.error)
      }
    } catch (error) {
      console.error("Error generating blueprint:", error)
      alert("Failed to generate blueprint. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">OpenIdeaX</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost">Docs</Button>
            <Button variant="ghost">Community</Button>
            <Button>Sign In</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {!showForm && !blueprint && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-balance leading-tight">
                  Turn Global Challenges Into Implementable Solutions
                </h1>
                <p className="text-xl text-muted-foreground">
                  OpenIdeaX combines generative AI, real-time collaboration, and impact evaluation to democratize
                  innovation. From problem statement to complete blueprint in minutes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                          onClick={() => setShowProblemSynthesizer(true)}
                        >
                          <Sparkles className="w-5 h-5 mr-2" />
                          Start with Problem Analysis
                        </Button>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  onClick={() => setShowForm(true)}
                >
                  <Zap className="w-5 h-5 mr-2" />
                          Generate Blueprint Directly
                </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0"
                          onClick={() => setShowKnowledgeGraph(true)}
                        >
                          <Globe className="w-5 h-5 mr-2" />
                          Explore Knowledge Graph
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div>
                  <div className="text-3xl font-bold">2 min</div>
                  <div className="text-sm text-muted-foreground">Blueprint generation</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">7 SDGs</div>
                  <div className="text-sm text-muted-foreground">Impact alignment</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">∞</div>
                  <div className="text-sm text-muted-foreground">Remix & share</div>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative h-96 lg:h-full min-h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl blur-3xl" />
              <Card className="relative h-full bg-card/50 backdrop-blur border-border/50 p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="h-3 bg-muted rounded-full w-3/4" />
                  <div className="h-3 bg-muted rounded-full w-1/2" />
                </div>
                <div className="space-y-3">
                  <div className="h-2 bg-muted rounded-full" />
                  <div className="h-2 bg-muted rounded-full w-5/6" />
                  <div className="h-2 bg-muted rounded-full w-4/6" />
                </div>
              </Card>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {[
              { icon: Sparkles, title: "AI-Powered", desc: "Multi-agent AI collaboration" },
              { icon: Users, title: "Co-Creation", desc: "Real-time collaboration rooms" },
              { icon: TrendingUp, title: "Impact Scoring", desc: "Measure SDG alignment" },
              { icon: Zap, title: "Open Registry", desc: "Remix & share blueprints" },
            ].map((feature, i) => (
              <Card
                key={i}
                className="p-6 bg-card/50 backdrop-blur border-border/50 hover:border-border transition-colors"
              >
                <feature.icon className="w-8 h-8 text-cyan-500 mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Problem Input Form */}
      {showForm && !blueprint && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-8 bg-card/50 backdrop-blur border-border/50">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Describe Your Global Challenge</h2>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  ← Back
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Challenge Area</label>
                  <input
                    type="text"
                    placeholder="e.g., Climate change, Education access, Healthcare equity"
                    className="w-full p-3 border border-border rounded-lg bg-background"
                    value={formData.challengeArea}
                    onChange={(e) => setFormData({...formData, challengeArea: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Specific Problem</label>
                  <textarea
                    placeholder="Describe the specific problem you want to solve..."
                    className="w-full p-3 border border-border rounded-lg bg-background h-32"
                    value={formData.specificProblem}
                    onChange={(e) => setFormData({...formData, specificProblem: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Target Region</label>
                  <input
                    type="text"
                    placeholder="e.g., Global, Sub-Saharan Africa, Southeast Asia"
                    className="w-full p-3 border border-border rounded-lg bg-background"
                    value={formData.targetRegion}
                    onChange={(e) => setFormData({...formData, targetRegion: e.target.value})}
                  />
                </div>
              </div>
              
              <Button
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                onClick={generateBlueprint}
                disabled={isGenerating}
              >
                <Zap className="w-5 h-5 mr-2" />
                {isGenerating ? "Generating..." : "Generate Blueprint"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Blueprint Preview */}
      {blueprint && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Generated Blueprint</h2>
              <Button variant="outline" onClick={() => setBlueprint(null)}>
                ← Back
              </Button>
            </div>

            {/* Problem Analysis */}
            <Card className="p-8 bg-card/50 backdrop-blur border-border/50">
              <h3 className="text-xl font-bold mb-4">Problem Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">
                {blueprint.problemAnalysis}
              </p>
            </Card>

            {/* Solutions */}
            <div>
              <h3 className="text-xl font-bold mb-4">Proposed Solutions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blueprint.solutions?.map((solution, i) => (
                  <Card key={i} className="p-6 bg-card/50 backdrop-blur border-border/50">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="font-semibold text-lg">{solution.title}</h4>
                      <div className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm font-medium">
                        {solution.impact}% Impact
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">{solution.description}</p>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Timeline</div>
                        <div className="text-sm font-medium">{solution.timeline}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-2">Required Resources</div>
                        <div className="flex flex-wrap gap-2">
                          {solution.resources?.map((r, j) => (
                            <span key={j} className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* SDG Alignment */}
            {blueprint.sdg_alignment && blueprint.sdg_alignment.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">SDG Alignment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {blueprint.sdg_alignment.map((sdg, i) => (
                    <Card key={i} className="p-4 bg-card/50 backdrop-blur border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{sdg.sdg}</h4>
                        <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm font-medium">
                          {sdg.alignment_score}% aligned
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{sdg.description}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Implementation Roadmap */}
            <div>
              <h3 className="text-xl font-bold mb-4">Implementation Roadmap</h3>
              <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                <div className="space-y-4">
                  {blueprint.roadmap?.map((phase, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                          <span className="text-white font-semibold text-sm">{i + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{phase.phase}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{phase.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {phase.duration} • {phase.tasks}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Additional Information */}
            {(blueprint.estimated_budget || blueprint.team_composition || blueprint.success_metrics) && (
              <div>
                <h3 className="text-xl font-bold mb-4">Project Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {blueprint.estimated_budget && (
                    <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
                      <h4 className="font-semibold mb-2">Estimated Budget</h4>
                      <p className="text-sm text-muted-foreground">{blueprint.estimated_budget}</p>
                    </Card>
                  )}
                  {blueprint.team_composition && (
                    <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
                      <h4 className="font-semibold mb-2">Team Composition</h4>
                      <div className="space-y-1">
                        {blueprint.team_composition.map((role, i) => (
                          <div key={i} className="text-sm text-muted-foreground">• {role}</div>
                        ))}
                      </div>
                    </Card>
                  )}
                  {blueprint.success_metrics && (
                    <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
                      <h4 className="font-semibold mb-2">Success Metrics</h4>
                      <div className="space-y-1">
                        {blueprint.success_metrics.map((metric, i) => (
                          <div key={i} className="text-sm text-muted-foreground">• {metric}</div>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* Impact Scorecard */}
            {blueprint && (
              <div>
                <h3 className="text-xl font-bold mb-4">Impact Analysis</h3>
                <ImpactScorecard
                  blueprintTitle={formData.specificProblem || "Generated Blueprint"}
                  overallScore={blueprint.sdg_alignment?.[0]?.alignment_score || 85}
                  metrics={[
                    {
                      name: "Social Impact",
                      value: 85,
                      target: 100,
                      unit: "%",
                      icon: <Users className="w-5 h-5" />,
                      color: "text-blue-500"
                    },
                    {
                      name: "Environmental Impact",
                      value: 78,
                      target: 100,
                      unit: "%",
                      icon: <Globe className="w-5 h-5" />,
                      color: "text-green-500"
                    },
                    {
                      name: "Economic Impact",
                      value: 92,
                      target: 100,
                      unit: "%",
                      icon: <TrendingUp className="w-5 h-5" />,
                      color: "text-purple-500"
                    },
                    {
                      name: "Innovation Score",
                      value: 88,
                      target: 100,
                      unit: "%",
                      icon: <Zap className="w-5 h-5" />,
                      color: "text-orange-500"
                    }
                  ]}
                  sdgAlignment={blueprint.sdg_alignment?.map(sdg => ({
                    sdg: sdg.sdg,
                    score: sdg.alignment_score
                  })) || []}
                  timelineData={[
                    { month: "Month 1", impact: 20 },
                    { month: "Month 3", impact: 45 },
                    { month: "Month 6", impact: 70 },
                    { month: "Month 12", impact: 85 }
                  ]}
                />
              </div>
            )}

            {/* Visual Prototype Generator */}
            <div>
              <h3 className="text-xl font-bold mb-4">Visual Prototypes</h3>
              <VisualPrototypeGenerator blueprint={blueprint} />
            </div>

                    {/* Pitch Deck Generator */}
                    <div>
                      <h3 className="text-xl font-bold mb-4">Pitch Deck</h3>
                      <PitchDeckGenerator blueprint={blueprint} />
                    </div>

                    {/* Ethical Impact Summary */}
                    <div>
                      <h3 className="text-xl font-bold mb-4">Ethical Impact Assessment</h3>
                      <EthicalImpactSummary 
                        blueprint={blueprint}
                        solution={selectedSolution}
                        problemStatement={synthesizedProblem}
                      />
                    </div>

                    {/* Call to Action */}
                    <Card className="p-8 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border-border/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold mb-2">Ready to collaborate?</h3>
                          <p className="text-muted-foreground">
                            Join our co-creation room to refine this blueprint with AI agents and community members.
                          </p>
                        </div>
                        <Button
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                          onClick={() => setShowCoCreationRoom(true)}
                        >
                          Start Co-Creation
                        </Button>
                      </div>
                    </Card>
          </div>
        </div>
      )}

      {/* Co-Creation Room */}
      {showCoCreationRoom && blueprint && (
        <CoCreationRoom 
          blueprintId="current-blueprint" 
          blueprintTitle={formData.specificProblem || "Generated Blueprint"}
          onBack={() => setShowCoCreationRoom(false)}
        />
      )}

      {/* Problem Synthesizer */}
      {showProblemSynthesizer && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setShowProblemSynthesizer(false)}
              className="mb-4"
            >
              ← Back to Home
            </Button>
          </div>
          <ProblemSynthesizer 
            onProblemSynthesized={handleProblemSynthesized}
            initialChallenge={formData.challengeArea}
          />
        </div>
      )}

      {/* Solution Composer */}
      {showSolutionComposer && synthesizedProblem && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowSolutionComposer(false)
                setShowProblemSynthesizer(true)
              }}
              className="mb-4"
            >
              ← Back to Problem Analysis
            </Button>
          </div>
          <SolutionComposer 
            problemStatement={synthesizedProblem}
            onSolutionsGenerated={handleSolutionsGenerated}
          />
        </div>
      )}

      {/* Roadmap Builder */}
      {showRoadmapBuilder && selectedSolution && synthesizedProblem && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowRoadmapBuilder(false)
                setShowSolutionComposer(true)
              }}
              className="mb-4"
            >
              ← Back to Solution Composer
            </Button>
          </div>
          <RoadmapBuilder 
            solution={selectedSolution}
            problemStatement={synthesizedProblem}
            onRoadmapGenerated={handleRoadmapGenerated}
          />
        </div>
      )}

      {/* Knowledge Graph Viewer */}
      {showKnowledgeGraph && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setShowKnowledgeGraph(false)}
              className="mb-4"
            >
              ← Back to Home
            </Button>
          </div>
          <KnowledgeGraphViewer />
        </div>
      )}
    </div>
  )
}