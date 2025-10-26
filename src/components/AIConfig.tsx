'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Brain, Zap, Shield, Info } from 'lucide-react';

interface AIConfigProps {
  onConfigChange?: (config: AIConfig) => void;
}

interface AIConfig {
  useHuggingFace: boolean;
  geminiApiKey: string;
  huggingFaceApiKey: string;
}

export function AIConfig({ onConfigChange }: AIConfigProps) {
  const [config, setConfig] = useState<AIConfig>({
    useHuggingFace: false,
    geminiApiKey: '',
    huggingFaceApiKey: '',
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load config from localStorage
    const savedConfig = localStorage.getItem('ai-config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setConfig(parsed);
    }
  }, []);

  const handleConfigChange = (newConfig: Partial<AIConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    localStorage.setItem('ai-config', JSON.stringify(updatedConfig));
    onConfigChange?.(updatedConfig);
  };

  const aiServices = [
    {
      id: 'gemini',
      name: 'Google Gemini Pro',
      description: 'Advanced AI with excellent reasoning and creativity',
      icon: Brain,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      features: ['High-quality responses', 'Fast processing', 'Creative solutions'],
      cost: 'Pay-per-use',
    },
    {
      id: 'huggingface',
      name: 'Hugging Face Models',
      description: 'Open-source models with community support',
      icon: Shield,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      features: ['Open source', 'Free tier available', 'Community models'],
      cost: 'Free tier + paid options',
    },
  ];

  return (
    <>
      {/* Config Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-all duration-200 border border-gray-200"
        title="AI Configuration"
      >
        <Settings className="w-5 h-5 text-gray-600" />
      </button>

      {/* Config Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">AI Service Configuration</h2>
                    <p className="text-sm text-gray-600">Choose your preferred AI service</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* AI Service Selection */}
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Select AI Service</h3>
                <div className="grid grid-cols-1 gap-4">
                  {aiServices.map((service) => {
                    const Icon = service.icon;
                    const isSelected = (service.id === 'huggingface' && config.useHuggingFace) ||
                                     (service.id === 'gemini' && !config.useHuggingFace);
                    
                    return (
                      <button
                        key={service.id}
                        onClick={() => handleConfigChange({ 
                          useHuggingFace: service.id === 'huggingface' 
                        })}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${service.bgColor}`}>
                            <Icon className={`w-5 h-5 ${service.color}`} />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-gray-900">{service.name}</h4>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {service.cost}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {service.features.map((feature, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* API Key Configuration */}
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">API Keys</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Gemini API Key
                  </label>
                  <input
                    type="password"
                    value={config.geminiApiKey}
                    onChange={(e) => handleConfigChange({ geminiApiKey: e.target.value })}
                    placeholder="Enter your Gemini API key"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Get your key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hugging Face API Key
                  </label>
                  <input
                    type="password"
                    value={config.huggingFaceApiKey}
                    onChange={(e) => handleConfigChange({ huggingFaceApiKey: e.target.value })}
                    placeholder="Enter your Hugging Face API key"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Get your key from <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Hugging Face</a>
                  </p>
                </div>
              </div>

              {/* Info Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Hybrid AI System</p>
                    <p>
                      OpenIdeaX uses a hybrid approach with automatic fallback. If your primary AI service fails, 
                      the system will automatically try the alternative service to ensure reliability.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
