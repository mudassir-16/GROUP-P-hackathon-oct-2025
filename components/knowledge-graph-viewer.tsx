"use client"

import React, { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Network, 
  Search, 
  Filter, 
  Globe, 
  Target, 
  TrendingUp, 
  Users, 
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Loader2,
  RefreshCw,
  Download,
  Share2,
  Eye,
  Plus,
  Minus,
  RotateCcw
} from "lucide-react"

interface ProblemNode {
  id: string
  title: string
  description: string
  category: string
  severity: "low" | "medium" | "high" | "critical"
  affected_population: number
  geographic_scope: string[]
  sdg_goals: number[]
  related_problems: string[]
  existing_solutions: string[]
  data_sources: string[]
  last_updated: string
}

interface SolutionNode {
  id: string
  title: string
  description: string
  type: "technology" | "policy" | "social" | "economic"
  effectiveness_score: number
  implementation_status: "concept" | "pilot" | "scaled" | "mature"
  target_problems: string[]
  sdg_goals: number[]
  stakeholders: string[]
  geographic_reach: string[]
  funding_sources: string[]
  success_metrics: string[]
  challenges: string[]
  scalability_potential: number
  cost_effectiveness: number
  last_updated: string
}

interface SDGNode {
  id: number
  title: string
  description: string
  targets: string[]
  indicators: string[]
  related_problems: string[]
  related_solutions: string[]
  progress_status: "on_track" | "challenging" | "off_track"
  priority_areas: string[]
  funding_requirements: number
  timeline: string
}

interface Connection {
  from: string
  to: string
  type: "addresses" | "supports" | "conflicts" | "enables" | "requires"
  strength: number
  description: string
}

interface KnowledgeGraph {
  problems: ProblemNode[]
  solutions: SolutionNode[]
  sdgs: SDGNode[]
  connections: Connection[]
  last_updated: string
  total_nodes: number
  total_connections: number
}

interface KnowledgeGraphViewerProps {
  onNodeSelected?: (node: ProblemNode | SolutionNode | SDGNode) => void
  selectedProblem?: string
  selectedSolution?: string
  selectedSDG?: number
}

export function KnowledgeGraphViewer({ 
  onNodeSelected, 
  selectedProblem, 
  selectedSolution, 
  selectedSDG 
}: KnowledgeGraphViewerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [knowledgeGraph, setKnowledgeGraph] = useState<KnowledgeGraph | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedSDGFilter, setSelectedSDGFilter] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<"network" | "list" | "grid">("network")
  const [zoomLevel, setZoomLevel] = useState(1)
  const [selectedNode, setSelectedNode] = useState<ProblemNode | SolutionNode | SDGNode | null>(null)
  const [showConnections, setShowConnections] = useState(true)

  const categories = [
    "all", "climate", "health", "education", "poverty", "inequality", 
    "technology", "environment", "governance", "infrastructure"
  ]

  const sdgGoals = [
    { id: 1, title: "No Poverty" },
    { id: 2, title: "Zero Hunger" },
    { id: 3, title: "Good Health" },
    { id: 4, title: "Quality Education" },
    { id: 5, title: "Gender Equality" },
    { id: 6, title: "Clean Water" },
    { id: 7, title: "Affordable Energy" },
    { id: 8, title: "Decent Work" },
    { id: 9, title: "Industry & Innovation" },
    { id: 10, title: "Reduced Inequalities" },
    { id: 11, title: "Sustainable Cities" },
    { id: 12, title: "Responsible Consumption" },
    { id: 13, title: "Climate Action" },
    { id: 14, title: "Life Below Water" },
    { id: 15, title: "Life on Land" },
    { id: 16, title: "Peace & Justice" },
    { id: 17, title: "Partnerships" }
  ]

  const loadKnowledgeGraph = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/knowledge-graph", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchQuery,
          category: selectedCategory,
          sdgFilter: selectedSDGFilter
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to load knowledge graph")
      }

      const data = await response.json()
      if (data.success) {
        setKnowledgeGraph(data.knowledgeGraph)
      } else {
        setError(data.error || "Failed to load knowledge graph")
      }
    } catch (error) {
      console.error("Error loading knowledge graph:", error)
      setError("Failed to load knowledge graph. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadKnowledgeGraph()
  }, [searchQuery, selectedCategory, selectedSDGFilter])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-500 bg-red-500/20"
      case "high": return "text-orange-500 bg-orange-500/20"
      case "medium": return "text-yellow-500 bg-yellow-500/20"
      case "low": return "text-green-500 bg-green-500/20"
      default: return "text-gray-500 bg-gray-500/20"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "technology": return "text-blue-500 bg-blue-500/20"
      case "policy": return "text-purple-500 bg-purple-500/20"
      case "social": return "text-green-500 bg-green-500/20"
      case "economic": return "text-yellow-500 bg-yellow-500/20"
      default: return "text-gray-500 bg-gray-500/20"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on_track": return "text-green-500 bg-green-500/20"
      case "challenging": return "text-yellow-500 bg-yellow-500/20"
      case "off_track": return "text-red-500 bg-red-500/20"
      default: return "text-gray-500 bg-gray-500/20"
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const filteredProblems = knowledgeGraph?.problems.filter(problem => {
    const matchesSearch = searchQuery === "" || 
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || problem.category === selectedCategory
    const matchesSDG = selectedSDGFilter === null || problem.sdg_goals.includes(selectedSDGFilter)
    return matchesSearch && matchesCategory && matchesSDG
  }) || []

  const filteredSolutions = knowledgeGraph?.solutions.filter(solution => {
    const matchesSearch = searchQuery === "" || 
      solution.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solution.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSDG = selectedSDGFilter === null || solution.sdg_goals.includes(selectedSDGFilter)
    return matchesSearch && matchesSDG
  }) || []

  const filteredSDGs = knowledgeGraph?.sdgs.filter(sdg => {
    const matchesSearch = searchQuery === "" || 
      sdg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sdg.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  }) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
            <Network className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Global Problem Knowledge Graph</h2>
            <p className="text-muted-foreground">Explore interconnected global challenges, solutions, and SDG goals</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search problems, solutions, SDGs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              className="w-full p-2 border border-border rounded-lg bg-background"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">SDG Goal</label>
            <select
              className="w-full p-2 border border-border rounded-lg bg-background"
              value={selectedSDGFilter || ""}
              onChange={(e) => setSelectedSDGFilter(e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">All SDGs</option>
              {sdgGoals.map(sdg => (
                <option key={sdg.id} value={sdg.id}>
                  SDG {sdg.id}: {sdg.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">View Mode</label>
            <div className="flex gap-1">
              <Button
                variant={viewMode === "network" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("network")}
              >
                <Network className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Target className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={loadKnowledgeGraph}
            disabled={isLoading}
            variant="outline"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg mt-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-red-500 text-sm">{error}</span>
          </div>
        )}
      </Card>

      {/* Knowledge Graph Stats */}
      {knowledgeGraph && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{knowledgeGraph.problems.length}</div>
              <div className="text-sm text-muted-foreground">Problems</div>
            </div>
          </Card>
          <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{knowledgeGraph.solutions.length}</div>
              <div className="text-sm text-muted-foreground">Solutions</div>
            </div>
          </Card>
          <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{knowledgeGraph.sdgs.length}</div>
              <div className="text-sm text-muted-foreground">SDG Goals</div>
            </div>
          </Card>
          <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{knowledgeGraph.connections.length}</div>
              <div className="text-sm text-muted-foreground">Connections</div>
            </div>
          </Card>
        </div>
      )}

      {/* Problems Section */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          Global Problems ({filteredProblems.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProblems.map((problem) => (
            <Card 
              key={problem.id} 
              className="p-4 bg-card/50 backdrop-blur border-border/50 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                setSelectedNode(problem)
                onNodeSelected?.(problem)
              }}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-lg">{problem.title}</h4>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(problem.severity)}`}>
                    {problem.severity.toUpperCase()}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{problem.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>{formatNumber(problem.affected_population)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4 text-green-500" />
                    <span>{problem.geographic_scope.length} regions</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {problem.sdg_goals.slice(0, 3).map((sdg) => (
                    <span key={sdg} className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded">
                      SDG {sdg}
                    </span>
                  ))}
                  {problem.sdg_goals.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{problem.sdg_goals.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Solutions Section */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-green-500" />
          Existing Solutions ({filteredSolutions.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSolutions.map((solution) => (
            <Card 
              key={solution.id} 
              className="p-4 bg-card/50 backdrop-blur border-border/50 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                setSelectedNode(solution)
                onNodeSelected?.(solution)
              }}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-lg">{solution.title}</h4>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(solution.type)}`}>
                    {solution.type.toUpperCase()}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{solution.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground">Effectiveness</div>
                    <div className="font-semibold">{solution.effectiveness_score}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Status</div>
                    <div className="font-semibold capitalize">{solution.implementation_status}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {solution.sdg_goals.slice(0, 3).map((sdg) => (
                    <span key={sdg} className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">
                      SDG {sdg}
                    </span>
                  ))}
                  {solution.sdg_goals.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{solution.sdg_goals.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* SDG Goals Section */}
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-500" />
          SDG Goals ({filteredSDGs.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSDGs.map((sdg) => (
            <Card 
              key={sdg.id} 
              className="p-4 bg-card/50 backdrop-blur border-border/50 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                setSelectedNode(sdg)
                onNodeSelected?.(sdg)
              }}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-lg">SDG {sdg.id}: {sdg.title}</h4>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(sdg.progress_status)}`}>
                    {sdg.progress_status.toUpperCase()}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{sdg.description}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground">Targets</div>
                    <div className="font-semibold">{sdg.targets.length}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Indicators</div>
                    <div className="font-semibold">{sdg.indicators.length}</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Timeline: {sdg.timeline}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Node Detail Modal */}
      {selectedNode && (
        <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Node Details</h3>
            <Button variant="outline" onClick={() => setSelectedNode(null)}>
              Close
            </Button>
          </div>

          <div className="space-y-6">
            {/* Node Overview */}
            <div>
              <h4 className="font-semibold text-lg mb-2">{selectedNode.title}</h4>
              <p className="text-muted-foreground">{selectedNode.description}</p>
            </div>

            {/* Node-specific details would be rendered here based on type */}
            {"severity" in selectedNode && (
              <div>
                <h5 className="font-semibold mb-2">Problem Details</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Severity</div>
                    <div className="font-semibold capitalize">{selectedNode.severity}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Affected Population</div>
                    <div className="font-semibold">{formatNumber(selectedNode.affected_population)}</div>
                  </div>
                </div>
              </div>
            )}

            {"effectiveness_score" in selectedNode && (
              <div>
                <h5 className="font-semibold mb-2">Solution Details</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Effectiveness</div>
                    <div className="font-semibold">{selectedNode.effectiveness_score}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div className="font-semibold capitalize">{selectedNode.implementation_status}</div>
                  </div>
                </div>
              </div>
            )}

            {"progress_status" in selectedNode && (
              <div>
                <h5 className="font-semibold mb-2">SDG Details</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Progress</div>
                    <div className="font-semibold capitalize">{selectedNode.progress_status}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Timeline</div>
                    <div className="font-semibold">{selectedNode.timeline}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}