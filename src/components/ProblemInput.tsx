'use client';

import React, { useState } from 'react';
import { Lightbulb, Globe, Target, Zap } from 'lucide-react';

interface ProblemInputProps {
  onGenerate: (challenge: string, context?: string, constraints?: string[]) => void;
  isGenerating: boolean;
}

export function ProblemInput({ onGenerate, isGenerating }: ProblemInputProps) {
  const [challenge, setChallenge] = useState('');
  const [context, setContext] = useState('');
  const [constraints, setConstraints] = useState<string[]>([]);
  const [newConstraint, setNewConstraint] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (challenge.trim()) {
      onGenerate(challenge.trim(), context.trim() || undefined, constraints.length > 0 ? constraints : undefined);
    }
  };

  const addConstraint = () => {
    if (newConstraint.trim() && !constraints.includes(newConstraint.trim())) {
      setConstraints([...constraints, newConstraint.trim()]);
      setNewConstraint('');
    }
  };

  const removeConstraint = (index: number) => {
    setConstraints(constraints.filter((_, i) => i !== index));
  };

  const exampleChallenges = [
    "Lack of access to clean water in rural areas",
    "Educational inequality in developing countries",
    "Food waste reduction in urban environments",
    "Mental health support for remote workers",
    "Sustainable energy solutions for off-grid communities"
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Turn Global Challenges into Innovation Solutions
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Describe any global challenge and our AI will help you create a complete solution blueprint, 
          implementation roadmap, and visual prototype.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="challenge" className="block text-sm font-medium text-gray-700 mb-2">
              Global Challenge *
            </label>
            <textarea
              id="challenge"
              value={challenge}
              onChange={(e) => setChallenge(e.target.value)}
              placeholder="e.g., Lack of access to clean water in rural areas"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              required
            />
          </div>

          <div>
            <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Context (Optional)
            </label>
            <textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g., Focus on Sub-Saharan Africa, budget constraints, existing infrastructure..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Constraints (Optional)
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newConstraint}
                onChange={(e) => setNewConstraint(e.target.value)}
                placeholder="e.g., Must use open-source technology"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addConstraint())}
              />
              <button
                type="button"
                onClick={addConstraint}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add
              </button>
            </div>
            {constraints.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {constraints.map((constraint, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {constraint}
                    <button
                      type="button"
                      onClick={() => removeConstraint(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!challenge.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating Blueprint...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Zap className="w-5 h-5 mr-2" />
                Generate Innovation Blueprint
              </div>
            )}
          </button>
        </form>
      </div>

      {/* Example Challenges */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Challenges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exampleChallenges.map((example, index) => (
            <button
              key={index}
              onClick={() => setChallenge(example)}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-medium">{example}</p>
                  <p className="text-sm text-gray-600 mt-1">Click to use this example</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Problem Analysis</h3>
          <p className="text-gray-600">AI analyzes your challenge and creates a structured problem statement with SDG alignment.</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Solution Design</h3>
          <p className="text-gray-600">Generate creative solutions with tech stacks, implementation strategies, and impact metrics.</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Globe className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Impact</h3>
          <p className="text-gray-600">Map solutions to UN SDG goals and calculate potential social and economic impact.</p>
        </div>
      </div>
    </div>
  );
}
