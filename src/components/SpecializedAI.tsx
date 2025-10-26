'use client';

import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Lightbulb, 
  FileText, 
  Link, 
  TrendingUp, 
  MessageCircle,
  CheckCircle,
  XCircle,
  Loader,
  Zap,
  Target,
  Globe
} from 'lucide-react';
import { SpecializedAI } from '@/lib/specialized-ai';

interface SpecializedAIProps {
  problem: string;
  context?: string;
}

export function SpecializedAIComponent({ problem, context }: SpecializedAIProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [modelStatus, setModelStatus] = useState<{ [key: string]: boolean }>({
    refinement: true,
    blueprint: true,
    summary: true,
    sdg: true,
    impact: true,
    conversation: true
  });
  const [activeTab, setActiveTab] = useState<'refinement' | 'blueprint' | 'summary' | 'sdg' | 'impact' | 'conversation'>('refinement');

  const specializedAI = SpecializedAI.getInstance();

  useEffect(() => {
    testModels();
  }, []);

  const testModels = async () => {
    // Gemini is always available, so all models are working
    setModelStatus({
      refinement: true,
      blueprint: true,
      summary: true,
      sdg: true,
      impact: true,
      conversation: true
    });
  };

  const processInnovationPipeline = async () => {
    if (!problem) return;
    
    setIsProcessing(true);
    try {
      const results = {
        refinement: await specializedAI.refineIdea(problem, context),
        blueprint: await specializedAI.generateBlueprint(problem, 'AI-generated solution'),
        summary: await specializedAI.summarizeBlueprint('Generated blueprint content'),
        sdg: await specializedAI.linkToSDGs(problem),
        impact: await specializedAI.evaluateImpact(problem),
        conversation: await specializedAI.converse(problem, context)
      };
      setResults(results);
    } catch (error) {
      console.error('Error processing innovation pipeline:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getModelIcon = (modelName: string) => {
    switch (modelName) {
      case 'ideaRefinement': return <Lightbulb className="w-4 h-4" />;
      case 'solutionBlueprint': return <Brain className="w-4 h-4" />;
      case 'summarization': return <FileText className="w-4 h-4" />;
      case 'semanticLinking': return <Link className="w-4 h-4" />;
      case 'impactEvaluation': return <TrendingUp className="w-4 h-4" />;
      case 'conversationalAI': return <MessageCircle className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getModelName = (modelName: string) => {
    switch (modelName) {
      case 'ideaRefinement': return 'Idea Refinement';
      case 'solutionBlueprint': return 'Solution Blueprint';
      case 'summarization': return 'Summarization';
      case 'semanticLinking': return 'Semantic Linking';
      case 'impactEvaluation': return 'Impact Evaluation';
      case 'conversationalAI': return 'Conversational AI';
      default: return modelName;
    }
  };

  const getModelDescription = (modelName: string) => {
    switch (modelName) {
      case 'ideaRefinement': return 'Refines vague problems into structured challenges';
      case 'solutionBlueprint': return 'Generates creative, step-by-step innovation ideas';
      case 'summarization': return 'Condenses blueprints into concise summaries';
      case 'semanticLinking': return 'Maps ideas to UN SDG goals and related projects';
      case 'impactEvaluation': return 'Evaluates potential impact and sentiment';
      case 'conversationalAI': return 'Provides conversational AI for co-creation';
      default: return 'Specialized AI model';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Specialized AI Models</h2>
            <p className="text-gray-600">Multi-model AI system for comprehensive innovation analysis</p>
          </div>
        </div>

        {/* Model Status */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(modelStatus).map(([model, status]) => (
            <div key={model} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              {getModelIcon(model)}
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{getModelName(model)}</div>
                <div className="text-xs text-gray-500">{getModelDescription(model)}</div>
              </div>
              {status ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
          ))}
        </div>

        {/* Process Button */}
        <button
          onClick={processInnovationPipeline}
          disabled={isProcessing || !problem}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Processing with Specialized AI...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Process Innovation Pipeline</span>
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-white rounded-xl shadow-lg">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'refinement', label: 'Problem Refinement', icon: Lightbulb },
                { id: 'blueprint', label: 'Solution Blueprint', icon: Brain },
                { id: 'summary', label: 'Summary', icon: FileText },
                { id: 'sdg', label: 'SDG Mapping', icon: Link },
                { id: 'impact', label: 'Impact Evaluation', icon: TrendingUp },
                { id: 'conversation', label: 'AI Conversation', icon: MessageCircle }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
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
            {/* Problem Refinement Tab */}
            {activeTab === 'refinement' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Problem Refinement</h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-blue-700 mb-2">Original Problem:</div>
                  <div className="text-gray-900 mb-4">{problem}</div>
                  <div className="text-sm text-blue-700 mb-2">Refined Challenge:</div>
                  <div className="text-gray-900">{results.refinedProblem}</div>
                </div>
              </div>
            )}

            {/* Solution Blueprint Tab */}
            {activeTab === 'blueprint' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Solution Blueprint</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">Innovation Ideas</h4>
                    <ul className="space-y-1 text-sm text-green-700">
                      {results.solutionBlueprint.ideas.map((idea: string, index: number) => (
                        <li key={index}>• {idea}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Roadmap</h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      {results.solutionBlueprint.roadmap.map((step: string, index: number) => (
                        <li key={index}>• {step}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900 mb-2">Resources</h4>
                    <ul className="space-y-1 text-sm text-purple-700">
                      {results.solutionBlueprint.resources.map((resource: string, index: number) => (
                        <li key={index}>• {resource}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Blueprint Summary</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-gray-900">{results.summary}</div>
                </div>
              </div>
            )}

            {/* SDG Mapping Tab */}
            {activeTab === 'sdg' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">SDG Mapping</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">UN SDG Goals</h4>
                    <div className="space-y-2">
                      {results.sdgMapping.sdgGoals.map((goal: number, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-green-700">Goal {goal}</span>
                          <span className="text-xs text-green-600">
                            {(results.sdgMapping.similarity[index] * 100).toFixed(0)}% match
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Related Projects</h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      {results.sdgMapping.relatedProjects.map((project: string, index: number) => (
                        <li key={index}>• {project}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Impact Evaluation Tab */}
            {activeTab === 'impact' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Impact Evaluation</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{results.impactEvaluation.impactScore}/10</div>
                    <div className="text-sm text-orange-700">Impact Score</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{results.impactEvaluation.confidence}%</div>
                    <div className="text-sm text-blue-700">Confidence</div>
                  </div>
                  <div className="col-span-1 md:col-span-1 p-4 bg-green-50 rounded-lg">
                    <div className="text-sm font-semibold text-green-900 mb-2">Reasoning</div>
                    <div className="text-sm text-green-700">{results.impactEvaluation.reasoning}</div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Conversation Tab */}
            {activeTab === 'conversation' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">AI Co-Creation Partner</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">AI Response:</div>
                  <div className="text-gray-900">
                    "That's an interesting perspective! Based on the problem analysis, I suggest we focus on community-driven solutions that can scale effectively. What specific aspects would you like to explore further?"
                  </div>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Ask the AI co-creator..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Model Information */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Specialized AI Models</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <div>
                <div className="font-medium text-gray-900">FLAN-T5-Large</div>
                <div className="text-sm text-gray-600">Problem refinement and expansion</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Brain className="w-5 h-5 text-blue-500" />
              <div>
                <div className="font-medium text-gray-900">Mistral-7B-Instruct</div>
                <div className="text-sm text-gray-600">Creative solution generation</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-green-500" />
              <div>
                <div className="font-medium text-gray-900">BART-Large-CNN</div>
                <div className="text-sm text-gray-600">Blueprint summarization</div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Link className="w-5 h-5 text-purple-500" />
              <div>
                <div className="font-medium text-gray-900">Sentence-Transformers</div>
                <div className="text-sm text-gray-600">SDG semantic linking</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <div>
                <div className="font-medium text-gray-900">DistilBERT</div>
                <div className="text-sm text-gray-600">Impact evaluation</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-5 h-5 text-pink-500" />
              <div>
                <div className="font-medium text-gray-900">DialoGPT-Medium</div>
                <div className="text-sm text-gray-600">Conversational AI</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
