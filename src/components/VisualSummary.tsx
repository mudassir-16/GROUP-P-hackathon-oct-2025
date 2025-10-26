'use client';

import React, { useState, useEffect } from 'react';
import { Idea } from '@/types';
import { 
  Image as ImageIcon, 
  Download, 
  RefreshCw, 
  Eye,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface VisualSummaryProps {
  idea: Idea;
  onImageGenerated?: (imageUrl: string) => void;
}

export function VisualSummary({ idea, onImageGenerated }: VisualSummaryProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFullImage, setShowFullImage] = useState(false);

  const generateImage = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ideaTitle: idea.title,
          ideaSummary: idea.summary,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 503) {
          throw new Error('Model is loading, please try again in a few minutes');
        } else if (response.status === 404) {
          throw new Error('Image generation service unavailable. Please check your API configuration.');
        } else {
          throw new Error(errorData.error || 'Failed to generate image');
        }
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);
      onImageGenerated?.(data.imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate concept image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${idea.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_concept.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Visual Summary</h3>
        </div>
        <div className="flex items-center space-x-2">
          {imageUrl && (
            <>
              <button
                onClick={() => setShowFullImage(true)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="View full image"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={downloadImage}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Download image"
              >
                <Download className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={generateImage}
            disabled={isGenerating}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4 mr-2" />
                {imageUrl ? 'Regenerate' : 'Generate'}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {isGenerating && !imageUrl && (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600">Generating concept illustration...</p>
              <p className="text-xs text-gray-500 mt-1">This may take 10-30 seconds</p>
            </div>
          </div>
        )}

        {imageUrl && (
          <div className="relative group">
            <img
              src={imageUrl}
              alt={`Concept illustration for ${idea.title}`}
              className="w-full h-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button
                onClick={() => setShowFullImage(true)}
                className="px-4 py-2 bg-white bg-opacity-90 text-gray-900 rounded-lg hover:bg-opacity-100 transition-all duration-200 flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">View Full Size</span>
              </button>
            </div>
          </div>
        )}

        {!imageUrl && !isGenerating && !error && (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-2">No concept image generated yet</p>
              <p className="text-xs text-gray-500">Click "Generate" to create an AI-powered visual summary</p>
            </div>
          </div>
        )}
      </div>

      {/* Full Image Modal */}
      {showFullImage && imageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white bg-opacity-90 text-gray-900 rounded-full hover:bg-opacity-100 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={imageUrl}
              alt={`Full size concept illustration for ${idea.title}`}
              className="max-w-full max-h-full rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
