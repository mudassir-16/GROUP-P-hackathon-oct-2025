"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Download, Share2, Presentation, FileText, Image, ExternalLink } from "lucide-react"

interface PitchDeckGeneratorProps {
  blueprint: any
}

interface PitchSlide {
  slideNumber: number
  title: string
  content: string
  type: "title" | "problem" | "solution" | "impact" | "roadmap" | "team" | "call-to-action"
}

export function PitchDeckGenerator({ blueprint }: PitchDeckGeneratorProps) {
  const [generatedSlides, setGeneratedSlides] = useState<PitchSlide[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [exportFormat, setExportFormat] = useState<"pdf" | "notion" | "slides">("pdf")

  const generatePitchDeck = async () => {
    setIsGenerating(true)
    
    try {
      const response = await fetch("/api/generate-pitch-deck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blueprint }),
      })

      if (!response.ok) throw new Error("Failed to generate pitch deck")

      const { slides } = await response.json()
      setGeneratedSlides(slides)
    } catch (error) {
      console.error("Error generating pitch deck:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const exportPitchDeck = async (format: string) => {
    try {
      const response = await fetch("/api/export-pitch-deck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          slides: generatedSlides, 
          format,
          blueprint 
        }),
      })

      if (!response.ok) throw new Error("Failed to export pitch deck")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `pitch-deck-${format}.${format === "pdf" ? "pdf" : format === "notion" ? "md" : "pptx"}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error exporting pitch deck:", error)
    }
  }

  const getSlideIcon = (type: string) => {
    switch (type) {
      case "title": return "🎯"
      case "problem": return "⚠️"
      case "solution": return "💡"
      case "impact": return "📈"
      case "roadmap": return "🗺️"
      case "team": return "👥"
      case "call-to-action": return "🚀"
      default: return "📄"
    }
  }

  const getSlideColor = (type: string) => {
    switch (type) {
      case "title": return "from-purple-500 to-pink-600"
      case "problem": return "from-red-500 to-orange-600"
      case "solution": return "from-blue-500 to-cyan-600"
      case "impact": return "from-green-500 to-emerald-600"
      case "roadmap": return "from-yellow-500 to-orange-600"
      case "team": return "from-indigo-500 to-purple-600"
      case "call-to-action": return "from-cyan-500 to-blue-600"
      default: return "from-gray-500 to-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Pitch Deck Generator</h2>
          <p className="text-muted-foreground">
            Generate a professional 5-slide pitch deck from your blueprint with export options.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={generatePitchDeck}
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
                <Presentation className="w-4 h-4 mr-2" />
                Generate Deck
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Export Options */}
      {generatedSlides.length > 0 && (
        <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
          <h3 className="text-lg font-semibold mb-4">Export Options</h3>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => exportPitchDeck("pdf")}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => exportPitchDeck("notion")}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Export to Notion
            </Button>
            <Button
              variant="outline"
              onClick={() => exportPitchDeck("slides")}
              className="flex items-center gap-2"
            >
              <Presentation className="w-4 h-4" />
              Export to Google Slides
            </Button>
          </div>
        </Card>
      )}

      {/* Slide Navigation */}
      {generatedSlides.length > 0 && (
        <Card className="p-4 bg-card/50 backdrop-blur border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {generatedSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    currentSlide === index
                      ? "bg-cyan-500 text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              Slide {currentSlide + 1} of {generatedSlides.length}
            </div>
          </div>
        </Card>
      )}

      {/* Current Slide */}
      {generatedSlides.length > 0 && (
        <Card className="p-8 bg-card/50 backdrop-blur border-border/50 min-h-96">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getSlideColor(generatedSlides[currentSlide]?.type)} flex items-center justify-center text-2xl`}>
                {getSlideIcon(generatedSlides[currentSlide]?.type)}
              </div>
              <div>
                <h3 className="text-xl font-bold">{generatedSlides[currentSlide]?.title}</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {generatedSlides[currentSlide]?.type.replace("-", " ")} Slide
                </p>
              </div>
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
          
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
              {generatedSlides[currentSlide]?.content}
            </div>
          </div>
        </Card>
      )}

      {/* Sample Slides for Demo */}
      {generatedSlides.length === 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Sample Pitch Deck Structure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { type: "title", title: "Problem Statement", icon: "🎯" },
              { type: "solution", title: "Our Solution", icon: "💡" },
              { type: "impact", title: "Impact & Metrics", icon: "📈" },
              { type: "roadmap", title: "Implementation", icon: "🗺️" },
              { type: "team", title: "Team & Resources", icon: "👥" },
              { type: "call-to-action", title: "Next Steps", icon: "🚀" },
            ].map((slide, i) => (
              <Card key={i} className="p-4 bg-card/50 backdrop-blur border-border/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-lg">
                    {slide.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{slide.title}</h4>
                    <p className="text-xs text-muted-foreground">Slide {i + 1}</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Content will be generated based on your blueprint
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
