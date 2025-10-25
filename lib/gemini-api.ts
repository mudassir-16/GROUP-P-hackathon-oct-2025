import { API_CONFIG } from './config'

export interface GeminiResponse {
  success: boolean
  text?: string
  error?: string
}

export async function callGeminiAPI(prompt: string, maxTokens: number = 2048): Promise<GeminiResponse> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_CONFIG.GEMINI.API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: API_CONFIG.GEMINI.TEMPERATURE,
          topK: API_CONFIG.GEMINI.TOP_K,
          topP: API_CONFIG.GEMINI.TOP_P,
          maxOutputTokens: maxTokens,
        }
      })
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const text = data.candidates[0].content.parts[0].text

    return {
      success: true,
      text: text
    }
  } catch (error) {
    console.error('Gemini API call failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

export async function generateProblemStatement(challenge: string, context?: string, targetRegion?: string): Promise<GeminiResponse> {
  const prompt = `You are an expert problem analyst and innovation consultant. Analyze the following challenge and create a comprehensive problem statement.

Challenge: ${challenge}
${context ? `Context: ${context}` : ''}
${targetRegion ? `Target Region: ${targetRegion}` : ''}

Generate a detailed JSON problem statement with the following structure:
{
  "title": "Clear, concise problem title",
  "description": "Detailed problem description with context and scope",
  "scope": "Geographic or demographic scope",
  "severity": "low|medium|high|critical",
  "affected_population": "Number or description of affected people",
  "root_causes": ["cause1", "cause2", "cause3"],
  "current_solutions": ["existing solution 1", "existing solution 2"],
  "gaps": ["gap1", "gap2"],
  "stakeholders": ["stakeholder1", "stakeholder2"],
  "constraints": ["constraint1", "constraint2"],
  "success_metrics": ["metric1", "metric2"],
  "urgency": "low|medium|high|critical",
  "complexity": "simple|moderate|complex",
  "data_availability": "low|medium|high",
  "regulatory_environment": "description of relevant regulations",
  "economic_impact": "description of economic implications",
  "social_impact": "description of social implications",
  "environmental_impact": "description of environmental implications"
}

Guidelines:
- Be specific and actionable
- Include quantitative data where possible
- Consider multiple perspectives and stakeholders
- Identify clear gaps in current solutions
- Provide measurable success metrics
- Consider implementation constraints
- Assess urgency and complexity realistically

Return ONLY valid JSON, no markdown or extra text.`

  return await callGeminiAPI(prompt, 1024)
}

export async function generateBlueprint(problemStatement: string, context: string, targetAudience: string, constraints: string): Promise<GeminiResponse> {
  const prompt = `You are an expert innovation consultant and solution architect. Create a comprehensive implementation blueprint for the following problem.

Problem Statement: ${problemStatement}
Context: ${context}
Target Audience: ${targetAudience}
Constraints: ${constraints}

Generate a detailed JSON blueprint with the following structure:
{
  "title": "Blueprint title",
  "description": "Comprehensive blueprint description",
  "problemAnalysis": "Detailed analysis of the problem",
  "solutions": [
    {
      "title": "Solution title",
      "description": "Solution description",
      "impact": 85,
      "timeline": "6-12 months",
      "resources": ["resource1", "resource2", "resource3"]
    }
  ],
  "roadmap": [
    {
      "phase": "Phase 1: Foundation",
      "description": "Phase description",
      "duration": "3 months",
      "tasks": "Key tasks and deliverables"
    }
  ],
  "sdg_alignment": [
    {
      "sdg": "SDG 1: No Poverty",
      "description": "How this solution aligns with SDG 1",
      "alignment_score": 85
    }
  ],
  "estimated_budget": "Budget estimate",
  "team_composition": ["role1", "role2", "role3"],
  "success_metrics": ["metric1", "metric2", "metric3"],
  "risks": ["risk1", "risk2"],
  "mitigation_strategies": ["strategy1", "strategy2"],
  "stakeholders": ["stakeholder1", "stakeholder2"],
  "implementation_approach": "Detailed implementation strategy",
  "scalability": "Scalability considerations",
  "sustainability": "Sustainability aspects",
  "innovation_level": "incremental|moderate|breakthrough",
  "feasibility_score": 80,
  "impact_potential": 90
}

Guidelines:
- Create actionable, implementable solutions
- Include realistic timelines and resource requirements
- Align with relevant SDG goals
- Consider scalability and sustainability
- Provide clear success metrics
- Identify and address risks
- Ensure solutions are feasible and impactful
- Consider the target audience and constraints

Return ONLY valid JSON, no markdown or extra text.`

  return await callGeminiAPI(prompt, 2048)
}

export async function generateVisuals(blueprint: any, types: string[]): Promise<GeminiResponse> {
  const prompt = `You are an expert visual designer and system architect. Generate visual representations for the following innovation blueprint.

Blueprint: ${JSON.stringify(blueprint, null, 2)}
Visual Types Requested: ${types.join(', ')}

Generate visual content based on the requested types. For each type, provide appropriate content:

For "architecture": Generate a Mermaid diagram showing system architecture
For "user-flow": Generate a Mermaid flowchart showing user journey
For "wireframe": Provide detailed wireframe descriptions
For "concept-art": Provide concept art descriptions

Return a JSON array with visual objects:
[
  {
    "type": "architecture|user-flow|wireframe|concept-art",
    "title": "Visual title",
    "description": "Visual description",
    "mermaidCode": "mermaid diagram code (for architecture/user-flow)",
    "wireframeDescription": "wireframe description (for wireframe)",
    "imageUrl": "placeholder URL (for concept-art)"
  }
]

Guidelines:
- Create clear, professional visual representations
- Use appropriate Mermaid syntax for diagrams
- Provide detailed descriptions for wireframes
- Ensure visuals align with the blueprint content
- Make diagrams readable and well-structured

Return ONLY valid JSON, no markdown or extra text.`

  return await callGeminiAPI(prompt, 1024)
}

export async function generatePitchDeck(blueprint: any): Promise<GeminiResponse> {
  const prompt = `Generate a professional 5-slide pitch deck for this innovation blueprint:

${JSON.stringify(blueprint, null, 2)}

Create slides with the following structure:
1. Title Slide - Problem statement and solution overview
2. Problem Slide - Deep dive into the challenge and its impact
3. Solution Slide - Your proposed solution and key features
4. Impact Slide - Expected outcomes, metrics, and SDG alignment
5. Roadmap Slide - Implementation timeline and next steps

For each slide, provide:
- slideNumber: number
- title: string
- content: string (detailed content for the slide)
- type: "title" | "problem" | "solution" | "impact" | "roadmap"

Return ONLY a valid JSON array of slides, no markdown or extra text.`

  return await callGeminiAPI(prompt, 2048)
}

export async function generateSolutions(
  problemStatement: any, 
  solutionCount: number, 
  innovationFocus: string, 
  techPreference: string, 
  budgetRange: string
): Promise<GeminiResponse> {
  const prompt = `You are an expert innovation consultant and solution architect. Generate ${solutionCount} creative solution concepts for the following problem statement:

Problem Statement: ${JSON.stringify(problemStatement, null, 2)}

Generation Parameters:
- Innovation Focus: ${innovationFocus}
- Tech Preference: ${techPreference}
- Budget Range: ${budgetRange}

For each solution, provide a detailed JSON response with the following structure:
{
  "id": "unique-solution-id",
  "title": "Creative solution title",
  "description": "Detailed solution description",
  "innovation_level": "incremental|moderate|breakthrough",
  "feasibility_score": 85,
  "impact_potential": 90,
  "uniqueness_score": 75,
  "tech_stack": [
    {
      "category": "Frontend",
      "technologies": ["React", "TypeScript", "TailwindCSS"],
      "rationale": "Modern, scalable frontend stack"
    },
    {
      "category": "Backend",
      "technologies": ["Node.js", "Express", "PostgreSQL"],
      "rationale": "Robust backend infrastructure"
    }
  ],
  "implementation_approach": "Step-by-step implementation strategy",
  "key_features": ["Feature 1", "Feature 2", "Feature 3"],
  "target_users": ["Primary user group", "Secondary user group"],
  "competitive_advantages": ["Unique advantage 1", "Unique advantage 2"],
  "risks": ["Risk 1", "Risk 2"],
  "success_metrics": ["Metric 1", "Metric 2", "Metric 3"],
  "estimated_timeline": "6-12 months",
  "resource_requirements": ["Resource 1", "Resource 2", "Resource 3"],
  "monetization_strategy": "Revenue generation approach",
  "scalability_potential": 85
}

Guidelines:
- Generate ${solutionCount} distinct solution concepts
- Vary innovation levels based on the focus parameter
- Select appropriate tech stacks based on preference and budget
- Ensure solutions are feasible and impactful
- Include modern, relevant technologies
- Consider scalability and sustainability
- Address the core problem effectively
- Provide realistic timelines and resource requirements

Return ONLY a valid JSON array of solutions, no markdown or extra text.`

  return await callGeminiAPI(prompt, 2048)
}

export async function generateRoadmap(
  solution: any,
  problemStatement: any,
  timeline_preference: string,
  budget_range: string,
  team_size: string,
  complexity_level: string,
  stakeholder_engagement: string
): Promise<GeminiResponse> {
  const prompt = `You are an expert project manager and implementation consultant. Generate a comprehensive implementation roadmap for the following solution:

Solution: ${JSON.stringify(solution, null, 2)}
Problem Statement: ${JSON.stringify(problemStatement, null, 2)}

Roadmap Parameters:
- Timeline Preference: ${timeline_preference}
- Budget Range: ${budget_range}
- Team Size: ${team_size}
- Complexity Level: ${complexity_level}
- Stakeholder Engagement: ${stakeholder_engagement}

Generate a detailed JSON roadmap with the following structure:
{
  "id": "roadmap-id",
  "title": "Implementation Roadmap Title",
  "description": "Comprehensive roadmap description",
  "total_duration_months": 12,
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "phases": [
    {
      "id": "phase-id",
      "name": "Phase Name",
      "description": "Phase description",
      "start_date": "2024-01-01",
      "end_date": "2024-03-31",
      "duration_weeks": 12,
      "status": "planning|active|completed|on_hold",
      "milestones": [
        {
          "id": "milestone-id",
          "title": "Milestone Title",
          "description": "Milestone description",
          "due_date": "2024-02-15",
          "status": "not_started|in_progress|completed|blocked",
          "priority": "low|medium|high|critical",
          "dependencies": ["milestone-id-1"],
          "deliverables": ["Deliverable 1", "Deliverable 2"],
          "success_criteria": ["Criteria 1", "Criteria 2"]
        }
      ],
      "budget_allocation": 50000,
      "resource_requirements": ["Resource 1", "Resource 2"],
      "risks": ["Risk 1", "Risk 2"],
      "success_criteria": ["Criteria 1", "Criteria 2"]
    }
  ],
  "stakeholders": [
    {
      "id": "stakeholder-id",
      "name": "Stakeholder Name",
      "role": "Role/Title",
      "organization": "Organization",
      "contact_info": "contact@example.com",
      "influence_level": "low|medium|high|critical",
      "engagement_level": "passive|supportive|active|champion",
      "responsibilities": ["Responsibility 1", "Responsibility 2"],
      "communication_preferences": ["Email", "Weekly meetings"]
    }
  ],
  "kpis": [
    {
      "id": "kpi-id",
      "name": "KPI Name",
      "description": "KPI description",
      "metric_type": "quantitative|qualitative",
      "target_value": "100",
      "current_value": "0",
      "unit": "users|%|$",
      "frequency": "daily|weekly|monthly|quarterly|annually",
      "owner": "Owner Name",
      "measurement_method": "How to measure",
      "baseline_value": "0",
      "target_date": "2024-06-30"
    }
  ],
  "budget_breakdown": {
    "total_budget": 200000,
    "phases": {
      "phase-1": 50000,
      "phase-2": 75000,
      "phase-3": 75000
    },
    "categories": {
      "development": 100000,
      "infrastructure": 50000,
      "marketing": 30000,
      "operations": 20000
    }
  },
  "risk_assessment": {
    "high_risks": ["High risk 1", "High risk 2"],
    "medium_risks": ["Medium risk 1", "Medium risk 2"],
    "low_risks": ["Low risk 1", "Low risk 2"],
    "mitigation_strategies": ["Strategy 1", "Strategy 2"]
  },
  "success_metrics": ["Metric 1", "Metric 2", "Metric 3"]
}

Guidelines:
- Create 3-5 implementation phases based on complexity
- Include realistic timelines based on team size and complexity
- Generate appropriate budget allocations based on budget range
- Identify key stakeholders based on engagement level
- Create measurable KPIs for each phase
- Include comprehensive risk assessment
- Ensure milestones have clear dependencies
- Consider resource constraints and team capabilities
- Align with solution requirements and problem context

Return ONLY valid JSON, no markdown or extra text.`

  return await callGeminiAPI(prompt, 2048)
}

export async function generateKnowledgeGraph(
  searchQuery: string,
  category: string,
  sdgFilter: number | null
): Promise<GeminiResponse> {
  const prompt = `You are an expert in global development and knowledge management. Generate a comprehensive knowledge graph that connects global problems, existing solutions, and SDG goals.

Search Parameters:
- Query: ${searchQuery || "Global challenges and solutions"}
- Category: ${category}
- SDG Filter: ${sdgFilter ? `SDG ${sdgFilter}` : "All SDGs"}

Generate a detailed JSON knowledge graph with the following structure:
{
  "problems": [
    {
      "id": "problem-id",
      "title": "Problem Title",
      "description": "Detailed problem description",
      "category": "climate|health|education|poverty|inequality|technology|environment|governance|infrastructure",
      "severity": "low|medium|high|critical",
      "affected_population": 1000000,
      "geographic_scope": ["region1", "region2"],
      "sdg_goals": [1, 2, 3],
      "related_problems": ["problem-id-1", "problem-id-2"],
      "existing_solutions": ["solution-id-1", "solution-id-2"],
      "data_sources": ["source1", "source2"],
      "last_updated": "2024-01-01"
    }
  ],
  "solutions": [
    {
      "id": "solution-id",
      "title": "Solution Title",
      "description": "Detailed solution description",
      "type": "technology|policy|social|economic",
      "effectiveness_score": 85,
      "implementation_status": "concept|pilot|scaled|mature",
      "target_problems": ["problem-id-1", "problem-id-2"],
      "sdg_goals": [1, 2, 3],
      "stakeholders": ["stakeholder1", "stakeholder2"],
      "geographic_reach": ["region1", "region2"],
      "funding_sources": ["source1", "source2"],
      "success_metrics": ["metric1", "metric2"],
      "challenges": ["challenge1", "challenge2"],
      "scalability_potential": 80,
      "cost_effectiveness": 75,
      "last_updated": "2024-01-01"
    }
  ],
  "sdgs": [
    {
      "id": 1,
      "title": "No Poverty",
      "description": "End poverty in all its forms everywhere",
      "targets": ["target1", "target2"],
      "indicators": ["indicator1", "indicator2"],
      "related_problems": ["problem-id-1", "problem-id-2"],
      "related_solutions": ["solution-id-1", "solution-id-2"],
      "progress_status": "on_track|challenging|off_track",
      "priority_areas": ["area1", "area2"],
      "funding_requirements": 1000000,
      "timeline": "2030"
    }
  ],
  "connections": [
    {
      "from": "problem-id",
      "to": "solution-id",
      "type": "addresses|supports|conflicts|enables|requires",
      "strength": 0.8,
      "description": "Connection description"
    }
  ],
  "last_updated": "2024-01-01",
  "total_nodes": 50,
  "total_connections": 100
}

Guidelines:
- Generate 10-15 global problems across different categories
- Include 15-20 existing solutions with diverse types and effectiveness scores
- Connect problems to relevant SDG goals (1-17)
- Create meaningful connections between problems and solutions
- Include realistic data about affected populations and geographic scope
- Ensure solutions address the problems they target
- Include both successful and emerging solutions
- Consider global, regional, and local perspectives
- Include diverse stakeholders and funding sources
- Provide realistic timelines and progress status
- Focus on ${category === "all" ? "diverse global challenges" : `${category} challenges`}
- ${sdgFilter ? `Prioritize solutions and problems related to SDG ${sdgFilter}` : "Include all SDG goals"}

Return ONLY valid JSON, no markdown or extra text.`

  return await callGeminiAPI(prompt, 2048)
}

export async function generateEthicalImpactSummary(
  blueprint: any,
  solution?: any,
  problemStatement?: any
): Promise<GeminiResponse> {
  const prompt = `You are an expert in AI ethics, bias detection, and responsible innovation. Generate a comprehensive ethical impact summary for the following innovation blueprint.

Blueprint: ${JSON.stringify(blueprint, null, 2)}
${solution ? `Solution: ${JSON.stringify(solution, null, 2)}` : ''}
${problemStatement ? `Problem Statement: ${JSON.stringify(problemStatement, null, 2)}` : ''}

Generate a detailed JSON ethical impact summary with the following structure:
{
  "overall_score": 75,
  "bias_detection": [
    {
      "type": "demographic|cultural|geographic|economic|technological|gender|age",
      "severity": "low|medium|high|critical",
      "description": "Detailed description of the bias",
      "affected_groups": ["group1", "group2"],
      "mitigation_strategies": ["strategy1", "strategy2"],
      "confidence_score": 85
    }
  ],
  "ethical_concerns": [
    {
      "category": "privacy|transparency|accountability|fairness|safety|autonomy|sustainability",
      "severity": "low|medium|high|critical",
      "description": "Description of the ethical concern",
      "impact_assessment": "Detailed impact assessment",
      "recommended_actions": ["action1", "action2"],
      "compliance_requirements": ["requirement1", "requirement2"],
      "risk_level": 70
    }
  ],
  "impact_analysis": {
    "positive_impacts": {
      "social": ["impact1", "impact2"],
      "environmental": ["impact1", "impact2"],
      "economic": ["impact1", "impact2"],
      "technological": ["impact1", "impact2"]
    },
    "negative_impacts": {
      "social": ["impact1", "impact2"],
      "environmental": ["impact1", "impact2"],
      "economic": ["impact1", "impact2"],
      "technological": ["impact1", "impact2"]
    },
    "unintended_consequences": ["consequence1", "consequence2"],
    "long_term_effects": ["effect1", "effect2"],
    "stakeholder_impacts": {
      "users": {
        "positive": ["positive1"],
        "negative": ["negative1"],
        "neutral": ["neutral1"]
      }
    }
  },
  "compliance_checks": [
    {
      "framework": "GDPR|CCPA|HIPAA|ISO27001|SOC2|UN_AI_Principles|IEEE_Ethics",
      "status": "compliant|partial|non_compliant|not_applicable",
      "requirements": ["req1", "req2"],
      "gaps": ["gap1", "gap2"],
      "recommendations": ["rec1", "rec2"],
      "priority": "low|medium|high|critical"
    }
  ],
  "recommendations": ["recommendation1", "recommendation2"],
  "risk_assessment": {
    "overall_risk": "low|medium|high|critical",
    "risk_factors": ["factor1", "factor2"],
    "mitigation_plan": ["plan1", "plan2"]
  },
  "transparency_report": {
    "data_sources": ["source1", "source2"],
    "methodology": ["method1", "method2"],
    "limitations": ["limitation1", "limitation2"],
    "assumptions": ["assumption1", "assumption2"]
  },
  "last_updated": "2024-01-01"
}

Guidelines:
- Conduct comprehensive bias detection across all relevant dimensions
- Identify ethical concerns across privacy, fairness, transparency, and safety
- Analyze both positive and negative impacts across social, environmental, economic, and technological dimensions
- Check compliance with major frameworks (GDPR, CCPA, UN AI Principles, etc.)
- Provide actionable recommendations for ethical implementation
- Assess overall risk level and create mitigation plans
- Ensure transparency in methodology and data sources
- Consider unintended consequences and long-term effects
- Evaluate stakeholder impacts comprehensively
- Provide specific, actionable recommendations

Return ONLY valid JSON, no markdown or extra text.`

  return await callGeminiAPI(prompt, 2048)
}