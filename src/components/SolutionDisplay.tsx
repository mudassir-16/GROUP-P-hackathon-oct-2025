'use client';

import React, { useState } from 'react';
import { Blueprint } from '@/types';
import { 
  Target, 
  Lightbulb, 
  MapPin, 
  BarChart3, 
  Users, 
  Clock, 
  Shield, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download,
  Share2
} from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface SolutionDisplayProps {
  blueprint: Blueprint;
}

export function SolutionDisplay({ blueprint }: SolutionDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['problem', 'solution']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const impactData = [
    { metric: 'Relevance', score: blueprint.impactScore.relevance, fullMark: 10 },
    { metric: 'Feasibility', score: blueprint.impactScore.feasibility, fullMark: 10 },
    { metric: 'Impact', score: blueprint.impactScore.impact, fullMark: 10 },
    { metric: 'Sustainability', score: blueprint.impactScore.sustainability, fullMark: 10 },
    { metric: 'Innovation', score: blueprint.impactScore.innovation, fullMark: 10 },
    { metric: 'Collaboration', score: blueprint.impactScore.collaboration, fullMark: 10 },
  ];

  const SectionHeader = ({ 
    id, 
    title, 
    icon: Icon, 
    children 
  }: { 
    id: string; 
    title: string; 
    icon: any; 
    children: React.ReactNode; 
  }) => (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => toggleSection(id)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {expandedSections.has(id) ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {expandedSections.has(id) && (
        <div className="px-6 pb-6">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{blueprint.title}</h2>
            <p className="text-lg text-gray-600 mb-4">{blueprint.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                License: {blueprint.license}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Version: {blueprint.version}
              </span>
              <span className="flex items-center">
                <Target className="w-4 h-4 mr-1" />
                SDG Goals: {blueprint.problem.sdgGoals.join(', ')}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center">
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
          </div>
        </div>

        {/* Impact Score Visualization */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Assessment</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={impactData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} />
                  <Radar
                    name="Impact Score"
                    dataKey="score"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {impactData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{item.metric}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(item.score / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-8">{item.score}/10</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Problem Statement */}
      <SectionHeader id="problem" title="Problem Statement" icon={Target}>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">{blueprint.problem.title}</h4>
            <p className="text-gray-700">{blueprint.problem.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-1">Category</h5>
              <p className="text-blue-700">{blueprint.problem.category}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-medium text-green-900 mb-1">SDG Goals</h5>
              <p className="text-green-700">{blueprint.problem.sdgGoals.join(', ')}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h5 className="font-medium text-purple-900 mb-1">Complexity</h5>
              <p className="text-purple-700 capitalize">{blueprint.problem.complexity}</p>
            </div>
          </div>
        </div>
      </SectionHeader>

      {/* Solution Overview */}
      <SectionHeader id="solution" title="Solution Overview" icon={Lightbulb}>
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">{blueprint.solution.title}</h4>
            <p className="text-gray-700 mb-4">{blueprint.solution.description}</p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Approach</h5>
              <p className="text-blue-700">{blueprint.solution.approach}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Technology Stack</h5>
              <div className="space-y-2">
                {blueprint.solution.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm mr-2 mb-2"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Key Stakeholders</h5>
              <div className="space-y-1">
                {blueprint.solution.stakeholders.map((stakeholder, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-700">
                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                    {stakeholder}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-gray-900 mb-3">Implementation Strategy</h5>
            <p className="text-gray-700 mb-4">{blueprint.solution.implementation}</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h6 className="font-medium text-gray-900 mb-2">Timeline</h6>
              <p className="text-gray-700">{blueprint.solution.timeline}</p>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-gray-900 mb-3">Success Metrics (KPIs)</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {blueprint.solution.kpis.map((kpi, index) => (
                <div key={index} className="flex items-center text-sm text-gray-700">
                  <BarChart3 className="w-4 h-4 mr-2 text-green-500" />
                  {kpi}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionHeader>

      {/* Implementation Roadmap */}
      <SectionHeader id="roadmap" title="Implementation Roadmap" icon={MapPin}>
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-semibold text-blue-900 mb-2">Total Duration</h5>
            <p className="text-blue-700">{blueprint.roadmap.totalDuration}</p>
          </div>

          <div className="space-y-4">
            {blueprint.roadmap.phases.map((phase, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-gray-900">Phase {index + 1}: {phase.name}</h5>
                  <span className="text-sm text-gray-500">{phase.duration}</span>
                </div>
                <p className="text-gray-700 mb-3">{phase.description}</p>
                <div>
                  <h6 className="font-medium text-gray-900 mb-2">Deliverables</h6>
                  <ul className="space-y-1">
                    {phase.deliverables.map((deliverable, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {blueprint.roadmap.milestones.length > 0 && (
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Key Milestones</h5>
              <div className="space-y-3">
                {blueprint.roadmap.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h6 className="font-medium text-gray-900">{milestone.name}</h6>
                        <span className="text-sm text-gray-500">{milestone.targetDate}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SectionHeader>

      {/* Visual Prototype */}
      {blueprint.visualPrototype && (
        <SectionHeader id="prototype" title="Visual Prototype" icon={ExternalLink}>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h5 className="font-semibold text-gray-900 mb-3">Concept Description</h5>
            <p className="text-gray-700 whitespace-pre-wrap">{blueprint.visualPrototype}</p>
          </div>
        </SectionHeader>
      )}

      {/* Provenance */}
      <SectionHeader id="provenance" title="AI Provenance" icon={Shield}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Data Sources</h5>
              <p className="text-blue-700">{blueprint.provenance.dataSources.join(', ')}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-medium text-green-900 mb-2">AI Models</h5>
              <p className="text-green-700">{blueprint.provenance.aiModels.join(', ')}</p>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Reasoning Process</h5>
            <p className="text-gray-700">{blueprint.provenance.reasoning}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h5 className="font-medium text-yellow-900 mb-2">Confidence Level</h5>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${blueprint.provenance.confidence * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold text-yellow-700">
                {Math.round(blueprint.provenance.confidence * 100)}%
              </span>
            </div>
          </div>
          {blueprint.provenance.biasNotes.length > 0 && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h5 className="font-medium text-red-900 mb-2">Bias Notes</h5>
              <ul className="space-y-1">
                {blueprint.provenance.biasNotes.map((note, index) => (
                  <li key={index} className="text-red-700 text-sm">• {note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </SectionHeader>
    </div>
  );
}
