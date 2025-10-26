'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Leaf, 
  Target, 
  Clock,
  BarChart3,
  Zap,
  Globe,
  Heart
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { ImpactPredictionEngine, ImpactSimulation, ImpactMetrics } from '@/lib/impact-prediction';
import { Problem, Solution } from '@/types';

interface ImpactPredictionProps {
  problem: Problem;
  solution: Solution;
}

export function ImpactPrediction({ problem, solution }: ImpactPredictionProps) {
  const [simulation, setSimulation] = useState<ImpactSimulation | null>(null);
  const [detailedMetrics, setDetailedMetrics] = useState<ImpactMetrics | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<{ month: number; users: number; impact: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string>('Realistic');

  const predictionEngine = ImpactPredictionEngine.getInstance();

  useEffect(() => {
    loadImpactData();
  }, [problem, solution]);

  const loadImpactData = async () => {
    setIsLoading(true);
    try {
      const [simulationData, metricsData, timeSeriesData] = await Promise.all([
        predictionEngine.predictImpact(problem, solution),
        predictionEngine.calculateDetailedMetrics(problem, solution),
        predictionEngine.simulateImpactOverTime(solution, 24)
      ]);

      setSimulation(simulationData);
      setDetailedMetrics(metricsData);
      setTimeSeriesData(timeSeriesData.map((item, index) => ({
        month: index + 1,
        users: item.users,
        impact: item.impact
      })));
    } catch (error) {
      console.error('Error loading impact data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedScenarioData = simulation?.scenarios.find(s => s.name === selectedScenario);

  const impactRadarData = detailedMetrics ? [
    { metric: 'Direct Users', score: Math.min(10, detailedMetrics.directUsers / 100) },
    { metric: 'Economic Value', score: Math.min(10, detailedMetrics.economicValue / 100000) },
    { metric: 'Environmental', score: detailedMetrics.environmentalCO2 / 10 },
    { metric: 'Social Impact', score: detailedMetrics.socialImpact },
    { metric: 'Scalability', score: detailedMetrics.scalability },
    { metric: 'Sustainability', score: detailedMetrics.sustainability }
  ] : [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          <span className="text-gray-600">Predicting impact...</span>
        </div>
      </div>
    );
  }

  if (!simulation || !detailedMetrics) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center text-gray-500">
          <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Unable to load impact prediction data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Impact Prediction</h2>
            <p className="text-gray-600">AI-powered analysis of potential real-world impact</p>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900">Prediction Confidence</h3>
              <p className="text-blue-700 text-sm">Based on similar solutions and historical data</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{simulation.confidence}%</div>
              <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${simulation.confidence}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {simulation.predictedUsers.toLocaleString()}
            </div>
            <div className="text-sm text-green-700">Predicted Users</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              ${(simulation.economicImpact / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-blue-700">Economic Impact</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {simulation.environmentalBenefit}%
            </div>
            <div className="text-sm text-green-700">Environmental Benefit</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {simulation.socialROI}x
            </div>
            <div className="text-sm text-purple-700">Social ROI</div>
          </div>
        </div>
      </div>

      {/* Scenario Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Scenarios</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {simulation.scenarios.map((scenario) => (
            <button
              key={scenario.name}
              onClick={() => setSelectedScenario(scenario.name)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedScenario === scenario.name
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 mb-2">{scenario.name}</div>
                <div className="text-sm text-gray-600 mb-3">{scenario.description}</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Users:</span>
                    <span className="font-medium">{scenario.users.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Economic:</span>
                    <span className="font-medium">${(scenario.economicImpact / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Timeline:</span>
                    <span className="font-medium">{scenario.timeline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Probability:</span>
                    <span className="font-medium">{scenario.probability}%</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {selectedScenarioData && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">{selectedScenarioData.name} Scenario</h4>
            <p className="text-gray-700 mb-3">{selectedScenarioData.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Users:</span>
                <div className="font-semibold">{selectedScenarioData.users.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Economic Impact:</span>
                <div className="font-semibold">${(selectedScenarioData.economicImpact / 1000).toFixed(0)}K</div>
              </div>
              <div>
                <span className="text-gray-600">Environmental:</span>
                <div className="font-semibold">{selectedScenarioData.environmentalBenefit}%</div>
              </div>
              <div>
                <span className="text-gray-600">Social ROI:</span>
                <div className="font-semibold">{selectedScenarioData.socialROI}x</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Impact Timeline */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Growth Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="impact" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center space-x-4 mt-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Users</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Impact Score</span>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Impact Metrics</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Impact Radar</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={impactRadarData}>
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
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{detailedMetrics.directUsers}</div>
                <div className="text-sm text-blue-700">Direct Users</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{detailedMetrics.indirectUsers}</div>
                <div className="text-sm text-green-700">Indirect Users</div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">${(detailedMetrics.economicValue / 1000).toFixed(0)}K</div>
              <div className="text-sm text-purple-700">Economic Value Created</div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{detailedMetrics.environmentalCO2} tons</div>
              <div className="text-sm text-green-700">CO2 Reduction</div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-600">{detailedMetrics.socialImpact}/10</div>
                <div className="text-xs text-gray-600">Social</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-600">{detailedMetrics.scalability}/10</div>
                <div className="text-xs text-gray-600">Scalable</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-600">{detailedMetrics.sustainability}/10</div>
                <div className="text-xs text-gray-600">Sustainable</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline to Impact */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Clock className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Timeline to Impact</h3>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">{simulation.timelineToImpact}</div>
            <p className="text-gray-600">Estimated time to measurable impact</p>
          </div>
        </div>
      </div>
    </div>
  );
}
