"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Sparkles, 
  Users, 
  BarChart3, 
  Network, 
  FileText, 
  Palette,
  Presentation,
  Database,
  Globe,
  Zap
} from "lucide-react"
import { BlueprintPreview } from "./blueprint-preview"
import { AiPersonasChat } from "./ai-personas-chat"
import { CoCreationRoom } from "./co-creation-room"
import { ImpactScorecard } from "./impact-scorecard"
import { KnowledgeGraphViewer } from "./knowledge-graph-viewer"
import { VisualPrototypeGenerator } from "./visual-prototype-generator"
import { PitchDeckGenerator } from "./pitch-deck-generator"
import { BlueprintRegistry } from "./blueprint-registry"

interface MainDashboardProps {
  blueprint: any
  onBack: () => void
}

export function MainDashboard({ blueprint, onBack }: MainDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const sampleBlueprints = [
    {
      id: "1",
      title: "AI-Powered Water Quality Monitoring",
      description: "IoT sensors and ML algorithms for real-time water quality assessment in rural communities",
      author: "Tech4Good Team",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
      tags: ["IoT", "AI", "Water", "Rural"],
      sdgAlignment: [6, 9, 11],
      impactScore: 92,
      forks: 15,
      stars: 45,
      views: 234,
      license: "MIT",
      githubUrl: "https://github.com/example/water-monitoring"
    },
    {
      id: "2", 
      title: "Digital Literacy Platform for Seniors",
      description: "Accessible learning platform designed specifically for elderly users to bridge the digital divide",
      author: "SeniorTech Initiative",
      createdAt: "2024-01-10",
      updatedAt: "2024-01-18",
      tags: ["Education", "Accessibility", "Seniors", "Digital"],
      sdgAlignment: [4, 10, 17],
      impactScore: 88,
      forks: 8,
      stars: 32,
      views: 156,
      license: "Apache-2.0"
    }
  ]

  const sampleNodes = [
    { id: "1", label: "Water Quality", type: "blueprint", color: "#3b82f6", size: 20 },
    { id: "2", label: "IoT Sensors", type: "solution", color: "#06b6d4", size: 15 },
    { id: "3", label: "Clean Water", type: "concept", color: "#8b5cf6", size: 18 },
    { id: "4", label: "SDG 6", type: "sdg", color: "#10b981", size: 12 },
    { id: "5", label: "Open Data", type: "resource", color: "#f59e0b", size: 14 }
  ]

  const sampleEdges = [
    { source: "1", target: "2", label: "uses", strength: 0.8 },
    { source: "2", target: "3", label: "enables", strength: 0.9 },
    { source: "3", target: "4", label: "aligns", strength: 0.7 },
    { source: "1", target: "5", label: "shares", strength: 0.6 }
  ]

  const sampleMetrics = [
    { name: "People Impacted", value: 15000, target: 20000, unit: "people", icon: Users, color: "from-blue-500 to-cyan-600" },
    { name: "Carbon Reduced", value: 250, target: 500, unit: "tons", icon: Globe, color: "from-green-500 to-emerald-600" },
    { name: "Cost Savings", value: 45000, target: 60000, unit: "$", icon: BarChart3, color: "from-yellow-500 to-orange-600" },
    { name: "Efficiency Gain", value: 78, target: 100, unit: "%", icon: Zap, color: "from-purple-500 to-pink-600" }
  ]

  const sampleSDGAlignment = [
    { sdg: "SDG 6", score: 95 },
    { sdg: "SDG 9", score: 88 },
    { sdg: "SDG 11", score: 82 }
  ]

  const sampleTimelineData = [
    { month: "Jan", impact: 20 },
    { month: "Feb", impact: 35 },
    { month: "Mar", impact: 50 },
    { month: "Apr", impact: 65 },
    { month: "May", impact: 80 },
    { month: "Jun", impact: 92 }
  ]

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
            <Button variant="ghost" onClick={onBack}>
              ← Back to Home
            </Button>
            <Button variant="ghost">Docs</Button>
            <Button variant="ghost">Community</Button>
            <Button>Sign In</Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="ai-collab" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">AI Team</span>
            </TabsTrigger>
            <TabsTrigger value="co-create" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              <span className="hidden sm:inline">Co-Create</span>
            </TabsTrigger>
            <TabsTrigger value="impact" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Impact</span>
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Knowledge</span>
            </TabsTrigger>
            <TabsTrigger value="visuals" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Visuals</span>
            </TabsTrigger>
            <TabsTrigger value="pitch" className="flex items-center gap-2">
              <Presentation className="w-4 h-4" />
              <span className="hidden sm:inline">Pitch</span>
            </TabsTrigger>
            <TabsTrigger value="registry" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Registry</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <BlueprintPreview blueprint={blueprint} onBack={onBack} />
          </TabsContent>

          {/* AI Collaboration Tab */}
          <TabsContent value="ai-collab">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">AI Collaboration Team</h2>
                <p className="text-muted-foreground">
                  Collaborate with specialized AI agents to refine your blueprint.
                </p>
              </div>
              <AiPersonasChat blueprint={blueprint} />
            </div>
          </TabsContent>

          {/* Co-Creation Room Tab */}
          <TabsContent value="co-create">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Co-Creation Room</h2>
                <p className="text-muted-foreground">
                  Real-time collaboration with team members and AI agents.
                </p>
              </div>
              <CoCreationRoom 
                blueprintId={blueprint.id || "demo-1"} 
                blueprintTitle={blueprint.title || "Demo Blueprint"} 
              />
            </div>
          </TabsContent>

          {/* Impact Analysis Tab */}
          <TabsContent value="impact">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Impact Analysis</h2>
                <p className="text-muted-foreground">
                  Comprehensive impact scoring and SDG alignment metrics.
                </p>
              </div>
              <ImpactScorecard
                blueprintTitle={blueprint.title || "Demo Blueprint"}
                overallScore={blueprint.impactScore || 88}
                metrics={sampleMetrics}
                sdgAlignment={sampleSDGAlignment}
                timelineData={sampleTimelineData}
              />
            </div>
          </TabsContent>

          {/* Knowledge Graph Tab */}
          <TabsContent value="knowledge">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Knowledge Graph</h2>
                <p className="text-muted-foreground">
                  Explore connections between problems, solutions, and global challenges.
                </p>
              </div>
              <KnowledgeGraphViewer nodes={sampleNodes} edges={sampleEdges} />
            </div>
          </TabsContent>

          {/* Visual Prototypes Tab */}
          <TabsContent value="visuals">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Visual Prototypes</h2>
                <p className="text-muted-foreground">
                  Generate visual representations of your solution.
                </p>
              </div>
              <VisualPrototypeGenerator blueprint={blueprint} />
            </div>
          </TabsContent>

          {/* Pitch Deck Tab */}
          <TabsContent value="pitch">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Pitch Deck Generator</h2>
                <p className="text-muted-foreground">
                  Create professional pitch decks from your blueprint.
                </p>
              </div>
              <PitchDeckGenerator blueprint={blueprint} />
            </div>
          </TabsContent>

          {/* Blueprint Registry Tab */}
          <TabsContent value="registry">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Blueprint Registry</h2>
                <p className="text-muted-foreground">
                  Discover and remix open innovation blueprints from the community.
                </p>
              </div>
              <BlueprintRegistry blueprints={sampleBlueprints} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
