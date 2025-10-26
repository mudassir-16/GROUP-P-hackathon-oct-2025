'use client';

import React, { useState } from 'react';
import { Idea, SolutionConcept, PartnerSuggestion } from '@/types';
import { 
  Lightbulb, 
  Users, 
  MapPin, 
  ExternalLink, 
  Heart, 
  Share2, 
  Download,
  Clock,
  Target,
  Zap
} from 'lucide-react';
import { VisualSummary } from './VisualSummary';

interface IdeaGeneratorProps {
  onIdeaGenerated?: (idea: Idea) => void;
  userId?: string;
}

export function IdeaGenerator({ onIdeaGenerated, userId }: IdeaGeneratorProps) {
  const [problemText, setProblemText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdea, setGeneratedIdea] = useState<Idea | null>(null);
  const [generateImage, setGenerateImage] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemText.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(userId && { 'x-user-id': userId }),
        },
        body: JSON.stringify({ 
          problem_text: problemText.trim(),
          generateImage: generateImage
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate idea');
      }

      const data = await response.json();
      setGeneratedIdea(data.idea);
      onIdeaGenerated?.(data.idea);
    } catch (error) {
      console.error('Error generating idea:', error);
      alert('Failed to generate idea. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const exampleProblems = [
    "High school dropout in rural Bihar",
    "Urban heat islands in Delhi - low-income neighborhoods",
    "Food waste reduction in Mumbai restaurants",
    "Mental health support for remote workers in Bangalore",
    "Clean water access in tribal areas of Odisha"
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {!generatedIdea ? (
        // Problem Input Form
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Turn Global Challenges into Innovation Solutions
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Describe any global challenge and our AI will help you create a complete solution blueprint 
              with 3 solution concepts, stakeholders, roadmap, and partner suggestions.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8">
            <form onSubmit={handleGenerate} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-2">
                  Global Challenge *
                </label>
                <textarea
                  id="problem"
                  value={problemText}
                  onChange={(e) => setProblemText(e.target.value)}
                  placeholder="e.g., High school dropout in rural Bihar"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                  rows={3}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="generateImage"
                  checked={generateImage}
                  onChange={(e) => setGenerateImage(e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                />
                <label htmlFor="generateImage" className="text-sm text-gray-700">
                  Generate AI concept image (takes longer)
                </label>
              </div>

              <button
                type="submit"
                disabled={!problemText.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                    <span className="hidden sm:inline">
                      {generateImage ? 'Generating Blueprint & Image...' : 'Generating Solution Blueprint...'}
                    </span>
                    <span className="sm:hidden">
                      {generateImage ? 'Generating...' : 'Generating...'}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="hidden sm:inline">Generate Innovation Blueprint</span>
                    <span className="sm:hidden">Generate Blueprint</span>
                  </div>
                )}
              </button>
            </form>
          </div>

          {/* Example Problems */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Example Challenges</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {exampleProblems.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setProblemText(example)}
                  className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left"
                >
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900 font-medium text-sm sm:text-base">{example}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">Click to use this example</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Generated Idea Display
        <IdeaDisplay idea={generatedIdea} onBack={() => setGeneratedIdea(null)} />
      )}
    </div>
  );
}

interface IdeaDisplayProps {
  idea: Idea;
  onBack: () => void;
}

function IdeaDisplay({ idea, onBack }: IdeaDisplayProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'solutions' | 'roadmap' | 'partners'>('overview');

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{idea.title}</h2>
            <p className="text-base sm:text-lg text-gray-600 mb-3 sm:mb-4">{idea.summary}</p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
              <span className="flex items-center">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {idea.createdAt.toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {idea.upvotes} upvotes
              </span>
              <span className="flex items-center">
                <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {idea.remixes} remixes
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
              {idea.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 text-xs sm:text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <button
              onClick={onBack}
              className="px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center text-sm sm:text-base"
            >
              ← Back
            </button>
            <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center text-sm sm:text-base">
              <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Share
            </button>
            <button className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center text-sm sm:text-base">
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Export
            </button>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
            Problem Statement
          </h3>
          <p className="text-sm sm:text-base text-gray-700">{idea.problem_text}</p>
        </div>
      </div>

      {/* Visual Summary */}
      <VisualSummary idea={idea} />

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Lightbulb },
              { id: 'solutions', label: 'Solutions', icon: Target },
              { id: 'roadmap', label: 'Roadmap', icon: MapPin },
              { id: 'partners', label: 'Partners', icon: Users }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center whitespace-nowrap ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Solution Summary</h3>
                <p className="text-sm sm:text-base text-gray-700">{idea.summary}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-1 sm:mb-2 text-sm sm:text-base">Solutions</h4>
                  <p className="text-blue-700 text-xs sm:text-sm">{idea.solutions.length} solution concepts</p>
                </div>
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-1 sm:mb-2 text-sm sm:text-base">Roadmap</h4>
                  <p className="text-green-700 text-xs sm:text-sm">{idea.roadmap.length} implementation phases</p>
                </div>
                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-1 sm:mb-2 text-sm sm:text-base">Partners</h4>
                  <p className="text-purple-700 text-xs sm:text-sm">{idea.partners.length} suggested partners</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'solutions' && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Solution Concepts</h3>
              {idea.solutions.map((solution, index) => (
                <div key={solution.id} className="border border-gray-200 rounded-lg p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-900">{solution.title}</h4>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        solution.effort_level === 'low' ? 'bg-green-100 text-green-800' :
                        solution.effort_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {solution.effort_level} effort
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        solution.impact_estimate === 'low' ? 'bg-red-100 text-red-800' :
                        solution.impact_estimate === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {solution.impact_estimate} impact
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">{solution.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Stakeholders</h5>
                      <div className="space-y-1">
                        {solution.stakeholders.map((stakeholder, idx) => (
                          <div key={idx} className="flex items-center text-xs sm:text-sm text-gray-700">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-gray-500" />
                            {stakeholder}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Tech Stack</h5>
                      <div className="flex flex-wrap gap-1">
                        {solution.tech_stack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Implementation Roadmap</h3>
              {idea.roadmap.map((phase, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 sm:p-6">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">{phase.phase}</h4>
                  <ul className="space-y-2">
                    {phase.tasks.map((task, idx) => (
                      <li key={idx} className="flex items-center text-sm sm:text-base text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'partners' && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Suggested Partners</h3>
              {idea.partners.map((partner, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base sm:text-lg font-semibold text-gray-900">{partner.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">{partner.type}</p>
                      <p className="text-sm sm:text-base text-gray-700">{partner.reason}</p>
                    </div>
                    {partner.contact_link && (
                      <a
                        href={partner.contact_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-0 sm:ml-4 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
                      >
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Contact
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
