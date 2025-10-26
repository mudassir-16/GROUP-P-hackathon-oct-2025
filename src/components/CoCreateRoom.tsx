'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Blueprint, ChatMessage, AIPersona } from '@/types';
import { 
  MessageCircle, 
  Users, 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  Vote, 
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface CoCreateRoomProps {
  blueprint: Blueprint;
}

export function CoCreateRoom({ blueprint }: CoCreateRoomProps) {
  const [room, setRoom] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPersonas, setShowPersonas] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const aiPersonas: AIPersona[] = [
    {
      id: 'sustainability_expert',
      name: '🌱 Sustainability Expert',
      role: 'Environmental Impact Analyst',
      expertise: ['Environmental Science', 'Sustainability', 'Climate Change', 'ESG'],
      perspective: 'Ensures solutions are environmentally sound and contribute to long-term sustainability goals.'
    },
    {
      id: 'tech_architect',
      name: '💻 Tech Architect',
      role: 'Technical Solutions Architect',
      expertise: ['Software Architecture', 'Open Source', 'Scalability', 'Security'],
      perspective: 'Focuses on technical feasibility, scalability, and implementation challenges.'
    },
    {
      id: 'design_thinker',
      name: '💡 Design Thinker',
      role: 'Human-Centered Design Specialist',
      expertise: ['UX/UI Design', 'Human-Centered Design', 'Accessibility', 'User Research'],
      perspective: 'Ensures solutions are user-friendly, accessible, and meet real human needs.'
    },
    {
      id: 'impact_analyst',
      name: '📈 Impact Analyst',
      role: 'Social Impact Measurement Expert',
      expertise: ['Impact Measurement', 'Data Analytics', 'Social ROI', 'SDG Tracking'],
      perspective: 'Measures and predicts the real-world impact and social return on investment.'
    },
    {
      id: 'community_builder',
      name: '🤝 Community Builder',
      role: 'Open Innovation Facilitator',
      expertise: ['Community Management', 'Open Source', 'Collaboration', 'Partnerships'],
      perspective: 'Identifies collaboration opportunities and community engagement strategies.'
    }
  ];

  useEffect(() => {
    createRoom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const createRoom = async () => {
    try {
      const response = await fetch('/api/co-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_room',
          problemId: blueprint.problem.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRoom(data.room);
      }
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !room) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      roomId: room.id,
      sender: 'user',
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/co-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send_message',
          roomId: room.id,
          message: newMessage,
          personaId: selectedPersona || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, ...data.messages.slice(1)]); // Skip user message as we already added it
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const synthesizeIdeas = async () => {
    if (!room) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/co-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'synthesize_ideas',
          roomId: room.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const synthesisMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          roomId: room.id,
          sender: 'ai',
          content: data.synthesis,
          timestamp: new Date(),
          type: 'synthesis',
        };
        setMessages(prev => [...prev, synthesisMessage]);
      }
    } catch (error) {
      console.error('Error synthesizing ideas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Collaborative Ideation Room</h2>
              <p className="text-gray-600">Work with AI personas to refine and enhance your solution</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={synthesizeIdeas}
                disabled={isLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Synthesize Ideas
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Start a conversation with AI personas to refine your solution</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-3xl px-4 py-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.type === 'synthesis'
                        ? 'bg-purple-100 text-purple-900 border border-purple-200'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {message.sender === 'user' 
                          ? 'You' 
                          : message.type === 'synthesis'
                          ? 'AI Synthesis'
                          : 'AI Assistant'
                        }
                      </span>
                      {message.personaId && (
                        <span className="text-xs opacity-75">
                          ({aiPersonas.find(p => p.id === message.personaId)?.name})
                        </span>
                      )}
                    </div>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <div className="text-xs opacity-75 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4" />
                      <span className="text-sm">AI is thinking...</span>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask questions, share ideas, or request feedback..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={2}
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* AI Personas Sidebar */}
          <div className="w-80 border-l border-gray-200 bg-gray-50">
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={() => setShowPersonas(!showPersonas)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="font-semibold text-gray-900">AI Personas</h3>
                {showPersonas ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>

            {showPersonas && (
              <div className="p-4 space-y-3">
                {aiPersonas.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => setSelectedPersona(selectedPersona === persona.id ? '' : persona.id)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedPersona === persona.id
                        ? 'bg-blue-100 border-2 border-blue-300'
                        : 'bg-white border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium text-gray-900 mb-1">{persona.name}</div>
                    <div className="text-sm text-gray-600 mb-2">{persona.role}</div>
                    <div className="text-xs text-gray-500">
                      <div className="font-medium mb-1">Expertise:</div>
                      <div>{persona.expertise.join(', ')}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Solution Context */}
            <div className="p-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Solution Context</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Problem:</span>
                  <p className="text-gray-600">{blueprint.problem.title}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Solution:</span>
                  <p className="text-gray-600">{blueprint.solution.title}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">SDG Goals:</span>
                  <p className="text-gray-600">{blueprint.problem.sdgGoals.join(', ')}</p>
                </div>
              </div>
            </div>

            {/* Active Ideas */}
            <div className="p-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Active Ideas</h4>
              <div className="space-y-2">
                {messages
                  .filter(m => m.type === 'idea' || m.content.toLowerCase().includes('idea'))
                  .slice(-3)
                  .map((message, index) => (
                    <div key={index} className="bg-white p-2 rounded border text-sm">
                      <div className="flex items-center space-x-1 mb-1">
                        <Lightbulb className="w-3 h-3 text-yellow-500" />
                        <span className="font-medium">Idea #{index + 1}</span>
                      </div>
                      <p className="text-gray-600 text-xs">{message.content.substring(0, 100)}...</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
