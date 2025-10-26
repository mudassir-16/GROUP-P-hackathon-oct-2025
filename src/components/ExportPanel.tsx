'use client';

import React, { useState } from 'react';
import { Idea } from '@/types';
import { 
  Download, 
  Github, 
  Mail, 
  FileText, 
  ExternalLink,
  Copy,
  Check,
  Share2
} from 'lucide-react';

interface ExportPanelProps {
  idea: Idea;
}

export function ExportPanel({ idea }: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [exportResults, setExportResults] = useState<{[key: string]: any}>({});
  const [copied, setCopied] = useState<string | null>(null);

  const handleExport = async (format: string) => {
    setIsExporting(format);
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea, format }),
      });

      if (!response.ok) {
        throw new Error(`Failed to export as ${format}`);
      }

      if (format === 'pdf') {
        // Handle PDF download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${idea.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await response.json();
        setExportResults(prev => ({ ...prev, [format]: data }));
      }
    } catch (error) {
      console.error(`Export error for ${format}:`, error);
      alert(`Failed to export as ${format}. Please try again.`);
    } finally {
      setIsExporting(null);
    }
  };

  const handlePartnerEmail = async (partner: any) => {
    setIsExporting('email');
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea, format: 'email', partner }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate email template');
      }

      const data = await response.json();
      setExportResults(prev => ({ ...prev, email: data }));
    } catch (error) {
      console.error('Email generation error:', error);
      alert('Failed to generate email template. Please try again.');
    } finally {
      setIsExporting(null);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Export & Share</h2>
        <p className="text-base sm:text-lg text-gray-600">
          Export your idea blueprint and start collaborating with partners
        </p>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* PDF Export */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">PDF Report</h3>
              <p className="text-xs sm:text-sm text-gray-600">Download comprehensive blueprint</p>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
            Generate a detailed PDF report with your complete idea blueprint, 
            including solutions, roadmap, and partner suggestions.
          </p>
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting === 'pdf'}
            className="w-full bg-red-600 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
          >
            {isExporting === 'pdf' ? (
              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            )}
            {isExporting === 'pdf' ? 'Generating...' : 'Download PDF'}
          </button>
        </div>

        {/* GitHub Export */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
              <Github className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">GitHub Repository</h3>
              <p className="text-xs sm:text-sm text-gray-600">Create open-source project</p>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
            Create a GitHub repository with your idea blueprint, roadmap issues, 
            and README to kickstart open-source development.
          </p>
          <button
            onClick={() => handleExport('github')}
            disabled={isExporting === 'github'}
            className="w-full bg-gray-800 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
          >
            {isExporting === 'github' ? (
              <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Github className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            )}
            {isExporting === 'github' ? 'Creating...' : 'Create Repository'}
          </button>
        </div>

        {/* Email Templates */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Outreach Emails</h3>
              <p className="text-xs sm:text-sm text-gray-600">Generate partner outreach</p>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
            Generate personalized email templates for reaching out to suggested 
            partners and stakeholders.
          </p>
          <div className="space-y-2">
            {idea.partners.map((partner, index) => (
              <button
                key={index}
                onClick={() => handlePartnerEmail(partner)}
                disabled={isExporting === 'email'}
                className="w-full bg-blue-600 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xs sm:text-sm"
              >
                {isExporting === 'email' ? (
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                )}
                Email {partner.name}
              </button>
            ))}
          </div>
        </div>
          </div>

      {/* Export Results */}
      {Object.keys(exportResults).length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Export Results</h3>
          
          {exportResults.github && (
            <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-green-50 rounded-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-green-900 text-sm sm:text-base">GitHub Repository Created</h4>
                  <p className="text-xs sm:text-sm text-green-700">
                    Your repository has been created successfully with roadmap issues and README.
                  </p>
                </div>
                <a
                  href={exportResults.github.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
                >
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  View Repository
                </a>
              </div>
            </div>
          )}

          {exportResults.email && (
            <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-3 space-y-2 sm:space-y-0">
                <h4 className="font-medium text-blue-900 text-sm sm:text-base">Outreach Email Generated</h4>
                <button
                  onClick={() => copyToClipboard(exportResults.email.emailTemplate, 'email')}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center text-xs sm:text-sm w-full sm:w-auto"
                >
                  {copied === 'email' ? (
                    <>
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="bg-white rounded-lg p-3 sm:p-4 border border-blue-200">
                <pre className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
                  {exportResults.email.emailTemplate}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <button className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900 text-sm sm:text-base">Share Idea</h4>
                <p className="text-xs sm:text-sm text-gray-600">Get a shareable link for this idea</p>
              </div>
            </div>
          </button>
          
          <button className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200 text-left">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <div>
                <h4 className="font-medium text-gray-900 text-sm sm:text-base">Create Room</h4>
                <p className="text-xs sm:text-sm text-gray-600">Start a collaboration room</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
