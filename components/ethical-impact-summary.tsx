"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Users, 
  Globe, 
  Scale,
  Eye,
  Download,
  Share2,
  RefreshCw,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Zap,
  Heart
} from "lucide-react"

interface BiasDetection {
  type: "demographic" | "cultural" | "geographic" | "economic" | "technological" | "gender" | "age"
  severity: "low" | "medium" | "high" | "critical"
  description: string
  affected_groups: string[]
  mitigation_strategies: string[]
  confidence_score: number
}

interface EthicalConcern {
  category: "privacy" | "transparency" | "accountability" | "fairness" | "safety" | "autonomy" | "sustainability"
  severity: "low" | "medium" | "high" | "critical"
  description: string
  impact_assessment: string
  recommended_actions: string[]
  compliance_requirements: string[]
  risk_level: number
}

interface ImpactAnalysis {
  positive_impacts: {
    social: string[]
    environmental: string[]
    economic: string[]
    technological: string[]
  }
  negative_impacts: {
    social: string[]
    environmental: string[]
    economic: string[]
    technological: string[]
  }
  unintended_consequences: string[]
  long_term_effects: string[]
  stakeholder_impacts: {
    [stakeholder: string]: {
      positive: string[]
      negative: string[]
      neutral: string[]
    }
  }
}

interface ComplianceCheck {
  framework: "GDPR" | "CCPA" | "HIPAA" | "ISO27001" | "SOC2" | "UN_AI_Principles" | "IEEE_Ethics"
  status: "compliant" | "partial" | "non_compliant" | "not_applicable"
  requirements: string[]
  gaps: string[]
  recommendations: string[]
  priority: "low" | "medium" | "high" | "critical"
}

interface EthicalSummary {
  overall_score: number
  bias_detection: BiasDetection[]
  ethical_concerns: EthicalConcern[]
  impact_analysis: ImpactAnalysis
  compliance_checks: ComplianceCheck[]
  recommendations: string[]
  risk_assessment: {
    overall_risk: "low" | "medium" | "high" | "critical"
    risk_factors: string[]
    mitigation_plan: string[]
  }
  transparency_report: {
    data_sources: string[]
    methodology: string[]
    limitations: string[]
    assumptions: string[]
  }
  last_updated: string
}

interface EthicalImpactSummaryProps {
  blueprint: any
  solution?: any
  problemStatement?: any
  onEthicalAssessment?: (assessment: EthicalSummary) => void
}

export function EthicalImpactSummary({ 
  blueprint, 
  solution, 
  problemStatement, 
  onEthicalAssessment 
}: EthicalImpactSummaryProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [ethicalSummary, setEthicalSummary] = useState<EthicalSummary | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("overview")
  const [showDetails, setShowDetails] = useState(false)

  const analyzeEthicalImpact = async () => {
    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch("/api/ethical-impact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blueprint,
          solution,
          problemStatement
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze ethical impact")
      }

      const data = await response.json()
      if (data.success) {
        setEthicalSummary(data.ethicalSummary)
        onEthicalAssessment?.(data.ethicalSummary)
      } else {
        setError(data.error || "Failed to analyze ethical impact")
      }
    } catch (error) {
      console.error("Error analyzing ethical impact:", error)
      setError("Failed to analyze ethical impact. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-500 bg-red-500/20"
      case "high": return "text-orange-500 bg-orange-500/20"
      case "medium": return "text-yellow-500 bg-yellow-500/20"
      case "low": return "text-green-500 bg-green-500/20"
      default: return "text-gray-500 bg-gray-500/20"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical": return "text-red-500"
      case "high": return "text-orange-500"
      case "medium": return "text-yellow-500"
      case "low": return "text-green-500"
      default: return "text-gray-500"
    }
  }

  const getComplianceColor = (status: string) => {
    switch (status) {
      case "compliant": return "text-green-500 bg-green-500/20"
      case "partial": return "text-yellow-500 bg-yellow-500/20"
      case "non_compliant": return "text-red-500 bg-red-500/20"
      case "not_applicable": return "text-gray-500 bg-gray-500/20"
      default: return "text-gray-500 bg-gray-500/20"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    if (score >= 40) return "text-orange-500"
    return "text-red-500"
  }

  const categories = [
    { id: "overview", label: "Overview", icon: <Shield className="w-4 h-4" /> },
    { id: "bias", label: "Bias Detection", icon: <Scale className="w-4 h-4" /> },
    { id: "ethics", label: "Ethical Concerns", icon: <Heart className="w-4 h-4" /> },
    { id: "impact", label: "Impact Analysis", icon: <Target className="w-4 h-4" /> },
    { id: "compliance", label: "Compliance", icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: "transparency", label: "Transparency", icon: <Eye className="w-4 h-4" /> }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Ethical Impact Summary</h2>
            <p className="text-muted-foreground">Comprehensive bias detection and ethical impact assessment</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-red-500 text-sm">{error}</span>
          </div>
        )}

        <Button
          onClick={analyzeEthicalImpact}
          disabled={isAnalyzing}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Analyzing Ethical Impact...
            </>
          ) : (
            <>
              <Shield className="w-5 h-5 mr-2" />
              Analyze Ethical Impact & Bias Detection
            </>
          )}
        </Button>
      </Card>

      {/* Ethical Summary Results */}
      {ethicalSummary && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">Ethical Impact Score</h3>
                <p className="text-muted-foreground">Overall ethical assessment and risk level</p>
              </div>
              <div className="text-right">
                <div className={`text-4xl font-bold ${getScoreColor(ethicalSummary.overall_score)}`}>
                  {ethicalSummary.overall_score}%
                </div>
                <div className="text-sm text-muted-foreground">Ethical Score</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-500">{ethicalSummary.bias_detection.length}</div>
                <div className="text-sm text-muted-foreground">Bias Issues</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-orange-500">{ethicalSummary.ethical_concerns.length}</div>
                <div className="text-sm text-muted-foreground">Ethical Concerns</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-500">{ethicalSummary.compliance_checks.length}</div>
                <div className="text-sm text-muted-foreground">Compliance Checks</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className={`text-2xl font-bold ${getRiskColor(ethicalSummary.risk_assessment.overall_risk)}`}>
                  {ethicalSummary.risk_assessment.overall_risk.toUpperCase()}
                </div>
                <div className="text-sm text-muted-foreground">Risk Level</div>
              </div>
            </div>
          </Card>

          {/* Category Navigation */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                {category.icon}
                {category.label}
              </Button>
            ))}
          </div>

          {/* Overview Tab */}
          {selectedCategory === "overview" && (
            <div className="space-y-6">
              {/* Risk Assessment */}
              <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                <h3 className="text-lg font-bold mb-4">Risk Assessment</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Overall Risk Level</span>
                    <div className={`px-3 py-1 rounded text-sm font-medium ${getSeverityColor(ethicalSummary.risk_assessment.overall_risk)}`}>
                      {ethicalSummary.risk_assessment.overall_risk.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Risk Factors</h4>
                    <div className="space-y-1">
                      {ethicalSummary.risk_assessment.risk_factors.map((factor, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Mitigation Plan</h4>
                    <div className="space-y-1">
                      {ethicalSummary.risk_assessment.mitigation_plan.map((action, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Recommendations */}
              <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                <h3 className="text-lg font-bold mb-4">Key Recommendations</h3>
                <div className="space-y-2">
                  {ethicalSummary.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Bias Detection Tab */}
          {selectedCategory === "bias" && (
            <div className="space-y-4">
              {ethicalSummary.bias_detection.map((bias, index) => (
                <Card key={index} className="p-6 bg-card/50 backdrop-blur border-border/50">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-lg capitalize">{bias.type.replace('_', ' ')} Bias</h4>
                        <p className="text-sm text-muted-foreground">{bias.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(bias.severity)}`}>
                          {bias.severity.toUpperCase()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {bias.confidence_score}% confidence
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Affected Groups</h5>
                      <div className="flex flex-wrap gap-2">
                        {bias.affected_groups.map((group, i) => (
                          <span key={i} className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded">
                            {group}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Mitigation Strategies</h5>
                      <div className="space-y-1">
                        {bias.mitigation_strategies.map((strategy, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{strategy}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Ethical Concerns Tab */}
          {selectedCategory === "ethics" && (
            <div className="space-y-4">
              {ethicalSummary.ethical_concerns.map((concern, index) => (
                <Card key={index} className="p-6 bg-card/50 backdrop-blur border-border/50">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-lg capitalize">{concern.category.replace('_', ' ')}</h4>
                        <p className="text-sm text-muted-foreground">{concern.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(concern.severity)}`}>
                          {concern.severity.toUpperCase()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Risk: {concern.risk_level}%
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Impact Assessment</h5>
                      <p className="text-sm text-muted-foreground">{concern.impact_assessment}</p>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Recommended Actions</h5>
                      <div className="space-y-1">
                        {concern.recommended_actions.map((action, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Impact Analysis Tab */}
          {selectedCategory === "impact" && (
            <div className="space-y-6">
              {/* Positive Impacts */}
              <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Positive Impacts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(ethicalSummary.impact_analysis.positive_impacts).map(([category, impacts]) => (
                    <div key={category}>
                      <h4 className="font-medium mb-2 capitalize">{category}</h4>
                      <div className="space-y-1">
                        {impacts.map((impact, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{impact}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Negative Impacts */}
              <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                  Negative Impacts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(ethicalSummary.impact_analysis.negative_impacts).map(([category, impacts]) => (
                    <div key={category}>
                      <h4 className="font-medium mb-2 capitalize">{category}</h4>
                      <div className="space-y-1">
                        {impacts.map((impact, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{impact}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Unintended Consequences */}
              <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Unintended Consequences
                </h3>
                <div className="space-y-1">
                  {ethicalSummary.impact_analysis.unintended_consequences.map((consequence, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">{consequence}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Compliance Tab */}
          {selectedCategory === "compliance" && (
            <div className="space-y-4">
              {ethicalSummary.compliance_checks.map((check, index) => (
                <Card key={index} className="p-6 bg-card/50 backdrop-blur border-border/50">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-lg">{check.framework}</h4>
                        <p className="text-sm text-muted-foreground">Compliance framework assessment</p>
                      </div>
                      <div className="flex gap-2">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${getComplianceColor(check.status)}`}>
                          {check.status.toUpperCase()}
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(check.priority)}`}>
                          {check.priority.toUpperCase()} PRIORITY
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Requirements</h5>
                      <div className="space-y-1">
                        {check.requirements.map((req, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {check.gaps.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-2">Compliance Gaps</h5>
                        <div className="space-y-1">
                          {check.gaps.map((gap, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm">{gap}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <h5 className="font-medium mb-2">Recommendations</h5>
                      <div className="space-y-1">
                        {check.recommendations.map((rec, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Transparency Tab */}
          {selectedCategory === "transparency" && (
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <h3 className="text-lg font-bold mb-4">Transparency Report</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Data Sources</h4>
                  <div className="space-y-1">
                    {ethicalSummary.transparency_report.data_sources.map((source, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{source}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Methodology</h4>
                  <div className="space-y-1">
                    {ethicalSummary.transparency_report.methodology.map((method, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{method}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Limitations</h4>
                  <div className="space-y-1">
                    {ethicalSummary.transparency_report.limitations.map((limitation, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{limitation}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Assumptions</h4>
                  <div className="space-y-1">
                    {ethicalSummary.transparency_report.assumptions.map((assumption, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{assumption}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share Assessment
            </Button>
            <Button variant="outline" onClick={() => setShowDetails(!showDetails)}>
              <Eye className="w-4 h-4 mr-2" />
              {showDetails ? "Hide Details" : "Show Details"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
