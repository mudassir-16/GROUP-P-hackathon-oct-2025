"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Download, Share2, Eye, Palette, Code, Building } from "lucide-react"

interface VisualPrototypeGeneratorProps {
  blueprint: any
}

interface GeneratedVisual {
  type: "architecture" | "user-flow" | "wireframe" | "concept-art"
  title: string
  description: string
  imageUrl?: string
  mermaidCode?: string
}

export function VisualPrototypeGenerator({ blueprint }: VisualPrototypeGeneratorProps) {
  const [generatedVisuals, setGeneratedVisuals] = useState<GeneratedVisual[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("all")

  const visualTypes = [
    {
      key: "architecture",
      name: "System Architecture",
      icon: Building,
      description: "Technical system design and infrastructure",
    },
    {
      key: "user-flow",
      name: "User Journey",
      icon: Eye,
      description: "User interaction and experience flow",
    },
    {
      key: "wireframe",
      name: "UI Wireframes",
      icon: Code,
      description: "Interface layout and structure",
    },
    {
      key: "concept-art",
      name: "Concept Visualization",
      icon: Palette,
      description: "Visual concept and branding",
    },
  ]

  const generateVisuals = async () => {
    setIsGenerating(true)
    
    try {
      const response = await fetch("/api/generate-visuals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blueprint, types: selectedType === "all" ? visualTypes.map(v => v.key) : [selectedType] }),
      })

      if (!response.ok) throw new Error("Failed to generate visuals")

      const { visuals } = await response.json()
      setGeneratedVisuals(visuals)
    } catch (error) {
      console.error("Error generating visuals:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const renderMermaidDiagram = (mermaidCode: string) => {
    return (
      <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
        <pre className="text-xs text-muted-foreground whitespace-pre-wrap">{mermaidCode}</pre>
      </div>
    )
  }

  const renderVisual = (visual: GeneratedVisual) => {
    return (
      <Card key={visual.type} className="p-6 bg-card/50 backdrop-blur border-border/50">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">{visual.title}</h3>
            <p className="text-sm text-muted-foreground">{visual.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        {visual.mermaidCode ? (
          renderMermaidDiagram(visual.mermaidCode)
        ) : visual.imageUrl ? (
          <div className="bg-muted/50 rounded-lg p-8 flex items-center justify-center">
            <img 
              src={visual.imageUrl} 
              alt={visual.title}
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        ) : (
          <div className="bg-muted/50 rounded-lg p-8 flex items-center justify-center">
            <div className="text-center">
              <Palette className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Visual placeholder</p>
            </div>
          </div>
        )}
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Visual Prototype Generator</h2>
          <p className="text-muted-foreground">
            Generate visual representations of your solution including architecture diagrams, user flows, and concept art.
          </p>
        </div>
        <Button
          onClick={generateVisuals}
          disabled={isGenerating}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Palette className="w-4 h-4 mr-2" />
              Generate Visuals
            </>
          )}
        </Button>
      </div>

      {/* Visual Type Selection */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <h3 className="text-lg font-semibold mb-4">Select Visual Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {visualTypes.map((type) => (
            <button
              key={type.key}
              onClick={() => setSelectedType(selectedType === type.key ? "all" : type.key)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedType === type.key || selectedType === "all"
                  ? "border-cyan-500 bg-cyan-500/10"
                  : "border-border bg-card/50 hover:border-border"
              }`}
            >
              <type.icon className="w-6 h-6 text-cyan-500 mb-2" />
              <div className="font-semibold text-sm mb-1">{type.name}</div>
              <div className="text-xs text-muted-foreground">{type.description}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* Generated Visuals */}
      {generatedVisuals.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Generated Visuals</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {generatedVisuals.map(renderVisual)}
          </div>
        </div>
      )}

      {/* Sample Visuals for Demo */}
      {generatedVisuals.length === 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Sample Visuals</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">System Architecture</h3>
                  <p className="text-sm text-muted-foreground">Technical infrastructure and data flow</p>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-center text-muted-foreground">
                  <Building className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Architecture diagram will be generated here</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">User Journey Map</h3>
                  <p className="text-sm text-muted-foreground">User interaction flow and touchpoints</p>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-center text-muted-foreground">
                  <Eye className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">User flow diagram will be generated here</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
