'use client';

import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  Users, 
  TrendingUp, 
  Clock, 
  Star,
  MessageCircle,
  ThumbsUp,
  Code,
  Palette,
  FileText,
  TestTube,
  Lightbulb
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SolutionEvolutionTracker, SolutionEvolution as SolutionEvolutionType, EvolutionStep, CommunityContribution } from '@/lib/solution-evolution';
import { Solution } from '@/types';

interface SolutionEvolutionProps {
  solution: Solution;
}

export function SolutionEvolution({ solution }: SolutionEvolutionProps) {
  const [evolution, setEvolution] = useState<SolutionEvolutionType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'contributors' | 'insights'>('timeline');

  const evolutionTracker = SolutionEvolutionTracker.getInstance();

  useEffect(() => {
    loadEvolutionData();
  }, [solution]);

  const loadEvolutionData = async () => {
    setIsLoading(true);
    try {
      let evolutionData = evolutionTracker.getEvolution(solution.id);
      
      if (!evolutionData) {
        evolutionData = evolutionTracker.initializeEvolution(solution);
      }

      // Generate some mock evolution data for demonstration
      if (evolutionData.evolutionPath.length === 0) {
        const mockSteps: EvolutionStep[] = [
          {
            id: '1',
            type: 'improvement',
            description: 'Added user authentication system',
            impact: 'high',
            effort: 'medium',
            priority: 1,
            suggestedBy: 'Community',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          },
          {
            id: '2',
            type: 'feature_add',
            description: 'Implemented real-time notifications',
            impact: 'medium',
            effort: 'low',
            priority: 2,
            suggestedBy: 'User Feedback',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
          },
          {
            id: '3',
            type: 'optimization',
            description: 'Optimized database queries',
            impact: 'medium',
            effort: 'low',
            priority: 3,
            suggestedBy: 'Technical Review',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
          },
          {
            id: '4',
            type: 'improvement',
            description: 'Added multi-language support',
            impact: 'high',
            effort: 'high',
            priority: 1,
            suggestedBy: 'Global Community',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          }
        ];

        mockSteps.forEach(step => evolutionTracker.addEvolutionStep(solution.id, step));

        const mockContributions: CommunityContribution[] = [
          {
            id: '1',
            contributorId: 'user1',
            contributorName: 'Sarah Chen',
            contributionType: 'code',
            description: 'Implemented authentication system',
            impact: 8,
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          },
          {
            id: '2',
            contributorId: 'user2',
            contributorName: 'Ahmed Hassan',
            contributionType: 'design',
            description: 'Created user interface mockups',
            impact: 7,
            timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
          },
          {
            id: '3',
            contributorId: 'user3',
            contributorName: 'Maria Rodriguez',
            contributionType: 'documentation',
            description: 'Wrote comprehensive API documentation',
            impact: 6,
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
          },
          {
            id: '4',
            contributorId: 'user4',
            contributorName: 'David Kim',
            contributionType: 'testing',
            description: 'Conducted security testing',
            impact: 9,
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          }
        ];

        mockContributions.forEach(contribution => 
          evolutionTracker.addCommunityContribution(solution.id, contribution)
        );
      }

      evolutionData = evolutionTracker.getEvolution(solution.id);
      setEvolution(evolutionData || null);
    } catch (error) {
      console.error('Error loading evolution data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getContributionIcon = (type: string) => {
    switch (type) {
      case 'code': return <Code className="w-4 h-4" />;
      case 'design': return <Palette className="w-4 h-4" />;
      case 'documentation': return <FileText className="w-4 h-4" />;
      case 'testing': return <TestTube className="w-4 h-4" />;
      case 'feedback': return <MessageCircle className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getEvolutionIcon = (type: string) => {
    switch (type) {
      case 'improvement': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'bug_fix': return <ThumbsUp className="w-4 h-4 text-red-600" />;
      case 'feature_add': return <Star className="w-4 h-4 text-blue-600" />;
      case 'optimization': return <Clock className="w-4 h-4 text-purple-600" />;
      default: return <GitBranch className="w-4 h-4 text-gray-600" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          <span className="text-gray-600">Loading evolution data...</span>
        </div>
      </div>
    );
  }

  if (!evolution) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center text-gray-500">
          <GitBranch className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Unable to load evolution data</p>
        </div>
      </div>
    );
  }

  const insights = evolutionTracker.getEvolutionInsights(solution.id);
  const evolutionScore = evolutionTracker.calculateEvolutionScore(solution.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Solution Evolution</h2>
              <p className="text-gray-600">Track how your solution improves over time</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">{evolutionScore.toFixed(1)}/10</div>
            <div className="text-sm text-gray-600">Evolution Score</div>
          </div>
        </div>

        {/* Evolution Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-600">{evolution.evolutionMetrics.totalVersions}</div>
            <div className="text-sm text-blue-700">Versions</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xl font-bold text-green-600">{evolution.evolutionMetrics.averageImprovement.toFixed(1)}</div>
            <div className="text-sm text-green-700">Avg Improvement</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-xl font-bold text-purple-600">{evolution.evolutionMetrics.communityEngagement}</div>
            <div className="text-sm text-purple-700">Contributors</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-xl font-bold text-orange-600">{evolution.evolutionMetrics.evolutionSpeed.toFixed(1)}</div>
            <div className="text-sm text-orange-700">Speed</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-gray-600">{evolution.evolutionMetrics.stabilityScore.toFixed(1)}</div>
            <div className="text-sm text-gray-700">Stability</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'timeline', label: 'Evolution Timeline', icon: GitBranch },
              { id: 'contributors', label: 'Contributors', icon: Users },
              { id: 'insights', label: 'Insights', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolution Timeline</h3>
              {evolution.evolutionPath.map((step, index) => (
                <div key={step.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {getEvolutionIcon(step.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{step.description}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getImpactColor(step.impact)}`}>
                          {step.impact} impact
                        </span>
                        <span className="text-xs text-gray-500">
                          {step.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Suggested by {step.suggestedBy} • Priority {step.priority}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contributors Tab */}
          {activeTab === 'contributors' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Contributors</h3>
              {evolution.communityContributions.map((contribution) => (
                <div key={contribution.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {contribution.contributorName.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{contribution.contributorName}</h4>
                      <div className="flex items-center space-x-2">
                        {getContributionIcon(contribution.contributionType)}
                        <span className="text-xs text-gray-500">
                          {contribution.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{contribution.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs text-gray-500">Impact:</span>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < contribution.impact / 2 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolution Insights</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Most Active Contributors</h4>
                  <div className="space-y-2">
                    {insights.mostActiveContributors.map((contributor, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-blue-700">{contributor}</span>
                        <span className="text-xs text-blue-600">#{index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Popular Improvements</h4>
                  <div className="space-y-2">
                    {insights.popularImprovements.map((improvement, index) => (
                      <div key={index} className="text-sm text-green-700">
                        {improvement}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">Evolution Trend</h4>
                <div className="flex items-center space-x-2">
                  <TrendingUp className={`w-5 h-5 ${
                    insights.evolutionTrend === 'accelerating' ? 'text-green-600' :
                    insights.evolutionTrend === 'stable' ? 'text-blue-600' : 'text-red-600'
                  }`} />
                  <span className="text-sm text-purple-700 capitalize">
                    {insights.evolutionTrend} development
                  </span>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 mb-2">Next Milestone</h4>
                <div className="text-sm text-orange-700">
                  Version {insights.nextMilestone} - Expected improvements in user experience and performance
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Improvement Suggestions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Improvements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evolution.improvementSuggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{suggestion}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
