"use client"

import React, { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Filter, 
  Download, 
  Share2, 
  Star, 
  GitBranch, 
  Eye, 
  Calendar,
  Tag,
  ExternalLink,
  Plus,
  Github
} from "lucide-react"

interface BlueprintRegistryItem {
  id: string
  title: string
  description: string
  author: string
  createdAt: string
  updatedAt: string
  tags: string[]
  sdgAlignment: number[]
  impactScore: number
  forks: number
  stars: number
  views: number
  license: string
  githubUrl?: string
  previewImage?: string
}

interface BlueprintRegistryProps {
  blueprints: BlueprintRegistryItem[]
}

export function BlueprintRegistry({ blueprints }: BlueprintRegistryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedSDGs, setSelectedSDGs] = useState<number[]>([])
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "impact">("newest")
  const [filteredBlueprints, setFilteredBlueprints] = useState<BlueprintRegistryItem[]>(blueprints)

  const allTags = Array.from(new Set(blueprints.flatMap(bp => bp.tags)))
  const allSDGs = Array.from(new Set(blueprints.flatMap(bp => bp.sdgAlignment)))

  useEffect(() => {
    let filtered = blueprints

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(bp => 
        bp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bp.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(bp => 
        selectedTags.some(tag => bp.tags.includes(tag))
      )
    }

    // SDG filter
    if (selectedSDGs.length > 0) {
      filtered = filtered.filter(bp => 
        selectedSDGs.some(sdg => bp.sdgAlignment.includes(sdg))
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "popular":
          return (b.stars + b.forks + b.views) - (a.stars + a.forks + a.views)
        case "impact":
          return b.impactScore - a.impactScore
        default:
          return 0
      }
    })

    setFilteredBlueprints(filtered)
  }, [searchTerm, selectedTags, selectedSDGs, sortBy, blueprints])

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev: string[]) => 
      prev.includes(tag) 
        ? prev.filter((t: string) => t !== tag)
        : [...prev, tag]
    )
  }

  const handleSDGToggle = (sdg: number) => {
    setSelectedSDGs((prev: number[]) => 
      prev.includes(sdg) 
        ? prev.filter((s: number) => s !== sdg)
        : [...prev, sdg]
    )
  }

  const getSDGColor = (sdg: number) => {
    const colors = {
      1: "bg-red-500/20 text-red-400",
      2: "bg-yellow-500/20 text-yellow-400", 
      3: "bg-green-500/20 text-green-400",
      4: "bg-red-600/20 text-red-400",
      5: "bg-red-500/20 text-red-400",
      6: "bg-blue-500/20 text-blue-400",
      7: "bg-yellow-600/20 text-yellow-400",
      8: "bg-red-700/20 text-red-400",
      9: "bg-orange-500/20 text-orange-400",
      10: "bg-red-500/20 text-red-400",
      11: "bg-yellow-500/20 text-yellow-400",
      12: "bg-orange-600/20 text-orange-400",
      13: "bg-green-600/20 text-green-400",
      14: "bg-blue-600/20 text-blue-400",
      15: "bg-green-700/20 text-green-400",
      16: "bg-blue-700/20 text-blue-400",
      17: "bg-purple-500/20 text-purple-400",
    }
    return colors[sdg as keyof typeof colors] || "bg-blue-500/20 text-blue-400"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Open Blueprint Registry</h2>
          <p className="text-muted-foreground">
            Discover, remix, and contribute to open innovation blueprints from the community.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Publish Blueprint
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search blueprints..."
              value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tags */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Tags</label>
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 8).map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${
                      selectedTags.includes(tag)
                        ? "bg-cyan-500 text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* SDGs */}
            <div>
              <label className="text-sm font-semibold mb-2 block">SDG Goals</label>
              <div className="flex flex-wrap gap-2">
                {allSDGs.slice(0, 6).map(sdg => (
                  <button
                    key={sdg}
                    onClick={() => handleSDGToggle(sdg)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${
                      selectedSDGs.includes(sdg)
                        ? "bg-cyan-500 text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    SDG {sdg}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Sort By</label>
              <select
                value={sortBy}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as "newest" | "popular" | "impact")}
                className="w-full p-2 bg-muted/50 border border-border rounded-lg text-sm"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="impact">Highest Impact</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Blueprints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlueprints.map((blueprint: BlueprintRegistryItem) => (
          <Card key={blueprint.id} className="p-6 bg-card/50 backdrop-blur border-border/50 hover:border-border transition-colors">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2">{blueprint.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{blueprint.description}</p>
                </div>
                {blueprint.githubUrl && (
                  <Button variant="ghost" size="sm" className="ml-2">
                    <Github className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Author and Date */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>by {blueprint.author}</span>
                <span>{new Date(blueprint.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {blueprint.tags.slice(0, 3).map((tag: string) => (
                  <span key={tag} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                    {tag}
                  </span>
                ))}
                {blueprint.tags.length > 3 && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                    +{blueprint.tags.length - 3}
                  </span>
                )}
              </div>

              {/* SDG Alignment */}
              <div className="flex flex-wrap gap-1">
                {blueprint.sdgAlignment.slice(0, 4).map((sdg: number) => (
                  <span key={sdg} className={`px-2 py-1 text-xs rounded ${getSDGColor(sdg)}`}>
                    SDG {sdg}
                  </span>
                ))}
                {blueprint.sdgAlignment.length > 4 && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                    +{blueprint.sdgAlignment.length - 4}
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{blueprint.stars}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitBranch className="w-4 h-4 text-blue-500" />
                    <span>{blueprint.forks}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span>{blueprint.views}</span>
                  </div>
                </div>
                <div className="text-cyan-400 font-semibold">
                  {blueprint.impactScore}% Impact
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <GitBranch className="w-4 h-4 mr-2" />
                  Fork
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredBlueprints.length === 0 && (
        <Card className="p-12 bg-card/50 backdrop-blur border-border/50 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">No blueprints found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or browse all blueprints.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("")
                setSelectedTags([])
                setSelectedSDGs([])
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
