"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface BlueprintPreviewProps {
  blueprint: any
  onBack: () => void
}

export function SimpleBlueprintPreview({ blueprint, onBack }: BlueprintPreviewProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back
        </button>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            Share
          </Button>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Problem Analysis */}
        <Card className="p-8 bg-card/50 backdrop-blur border-border/50">
          <h2 className="text-2xl font-bold mb-4">Problem Analysis</h2>
          <p className="text-muted-foreground leading-relaxed">
            {blueprint.problemAnalysis || "Problem analysis will be generated here..."}
          </p>
        </Card>

        {/* Solutions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Proposed Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blueprint.solutions?.map((solution: any, i: number) => (
              <Card
                key={i}
                className="p-6 bg-card/50 backdrop-blur border-border/50 hover:border-border transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-lg">{solution.title}</h3>
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
                      {solution.resources?.map((r: string, j: number) => (
                        <span key={j} className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )) || (
              <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                <h3 className="font-semibold text-lg mb-2">Solution 1</h3>
                <p className="text-muted-foreground">Solution details will be generated here...</p>
              </Card>
            )}
          </div>
        </div>

        {/* Implementation Roadmap */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Implementation Roadmap</h2>
          <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
            <div className="space-y-4">
              {blueprint.roadmap?.map((phase: any, i: number) => (
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
                      {phase.duration} • {phase.tasks} tasks
                    </p>
                  </div>
                </div>
              )) || (
                <div className="text-center text-muted-foreground py-8">
                  <p>Roadmap will be generated here...</p>
                </div>
              )}
            </div>
          </Card>
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
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
              Start Co-Creation
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
