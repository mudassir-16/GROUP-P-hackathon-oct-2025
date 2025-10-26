'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Idea, Room, Participant, ChatMessage } from '@/types';
import { 
  Users, 
  MessageCircle, 
  Send, 
  Share2, 
  Download,
  Heart,
  Copy,
  ExternalLink
} from 'lucide-react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';

interface CollaborationRoomProps {
  idea: Idea;
  onClose: () => void;
  specificRoomId?: string;
}

export function CollaborationRoom({ idea, onClose, specificRoomId }: CollaborationRoomProps) {
  const { user } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState<string>('');
  const [editableBlueprint, setEditableBlueprint] = useState<Idea>(idea);
  
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize room - use specific room ID if provided, otherwise generate new one
    const newRoomId = specificRoomId || `room_${Date.now()}`;
    setRoomId(newRoomId);
    
    const newRoom: Room = {
      roomId: newRoomId,
      ideaId: idea.id,
      participants: [],
      chat: [],
      blueprint: idea,
      createdAt: new Date()
    };
    setRoom(newRoom);

    // Initialize Socket.io connection
    const socket = io('http://localhost:3001', {
      transports: ['websocket', 'polling'],
      autoConnect: true
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to collaboration room');
      
      // Create current user participant
      const currentUser: Participant = {
        userId: user?.uid || 'anonymous_' + Date.now(),
        name: user?.displayName || user?.email || 'Anonymous User',
        avatar: user?.photoURL,
        joinedAt: new Date()
      };
      
      // Add current user to participants immediately
      setParticipants(prev => {
        if (prev.find(p => p.userId === currentUser.userId)) return prev;
        return [...prev, currentUser];
      });
      
      // Join the room
      socket.emit('join-room', {
        roomId: newRoomId,
        ideaId: idea.id,
        user: currentUser,
        blueprint: editableBlueprint // Send the current blueprint
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from collaboration room');
    });

    socket.on('user-joined', (participant: Participant) => {
      setParticipants(prev => {
        // Avoid duplicates
        if (prev.find(p => p.userId === participant.userId)) return prev;
        return [...prev, participant];
      });
      console.log('User joined:', participant.name);
    });

    socket.on('user-left', (userId: string) => {
      setParticipants(prev => {
        const updated = prev.filter(p => p.userId !== userId);
        console.log('User left:', userId);
        return updated;
      });
    });

    socket.on('message', (message: ChatMessage) => {
      setMessages(prev => {
        // Avoid duplicates
        if (prev.find(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
    });

    socket.on('blueprint-updated', (updatedBlueprint: Idea) => {
      console.log('Blueprint updated:', updatedBlueprint.title);
      setEditableBlueprint(updatedBlueprint);
    });

    socket.on('participants-updated', (updatedParticipants: Participant[]) => {
      setParticipants(updatedParticipants);
      console.log('Participants updated:', updatedParticipants.length);
    });

    return () => {
      socket.disconnect();
    };
  }, [idea.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      roomId: roomId,
      sender: 'user',
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    socketRef.current.emit('message', userMessage);
    
    const messageText = newMessage.trim();
    setNewMessage('');

    // Generate AI response ONLY if message starts with "HEY AI" or "@ai"
    const shouldGetAIResponse = messageText.toLowerCase().startsWith('hey ai') || 
                                  messageText.toLowerCase().startsWith('@ai') ||
                                  messageText.toLowerCase().startsWith('/ai');
    
    if (shouldGetAIResponse) {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            message: messageText.replace(/^(hey ai|@ai|\/ai)\s*/i, ''), // Remove trigger prefix
            persona: 'OpenIdeaX Assistant'
          }),
        });

        if (response.ok) {
          const data = await response.json();
          
          const aiMessage: ChatMessage = {
            id: `ai_msg_${Date.now()}`,
            roomId: roomId,
            sender: 'ai',
            content: data.response,
            timestamp: new Date(),
            type: 'text'
          };

          // Add AI response to chat
          setMessages(prev => [...prev, aiMessage]);
          socketRef.current.emit('message', aiMessage);
        }
      } catch (error) {
        console.error('Error getting AI response:', error);
        
        // Fallback AI response
        const fallbackMessage: ChatMessage = {
          id: `ai_msg_${Date.now()}`,
          roomId: roomId,
          sender: 'ai',
          content: "I'm here to help you develop this idea further. What specific aspect would you like to explore?",
          timestamp: new Date(),
          type: 'text'
        };

        setMessages(prev => [...prev, fallbackMessage]);
        socketRef.current.emit('message', fallbackMessage);
      }
    }
  };

  const updateBlueprint = (updatedBlueprint: Idea) => {
    setEditableBlueprint(updatedBlueprint);
    if (socketRef.current) {
      // Add roomId to the blueprint update
      const blueprintWithRoom = {
        ...updatedBlueprint,
        roomId: roomId
      };
      socketRef.current.emit('update-blueprint', blueprintWithRoom);
    }
  };

  const copyRoomLink = () => {
    // Copy room information for sharing
    const roomInfo = `OpenIdeaX Collaboration Room\nRoom ID: ${roomId}\nShare this ID with others to join the same room.`;
    navigator.clipboard.writeText(roomInfo);
    
    // Show a nice notification
    alert('Room information copied! Share the Room ID with others.\n\nRoom ID: ' + roomId);
  };

  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState('');

  return (
    <div className="max-w-7xl mx-auto h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Collaboration Room</h2>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-xs sm:text-sm text-gray-600">
                {isConnected ? `${participants.length} online` : 'Disconnected'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={copyRoomLink}
              className="flex-1 sm:flex-none px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center text-sm"
            >
              <Copy className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">Copy Link</span>
              <span className="sm:hidden">Copy</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Participants */}
          <div className="bg-gray-50 border-b border-gray-200 p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <span className="font-medium text-gray-900 text-sm sm:text-base">
                {participants.length} participant{participants.length !== 1 ? 's' : ''}
              </span>
              <div className="flex space-x-1 sm:space-x-2 overflow-x-auto">
                {participants.map((participant, index) => (
                  <div
                    key={participant.userId}
                    className="relative group flex-shrink-0"
                    title={`${participant.name} (${participant.userId})`}
                  >
                    {participant.avatar ? (
                      <img
                        src={participant.avatar}
                        alt={participant.name}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-blue-500"
                      />
                    ) : (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium border-2 border-blue-500">
                        {participant.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Editable Blueprint */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{editableBlueprint.title}</h3>
              
              {/* Problem Statement */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Problem Statement</h4>
                <textarea
                  value={editableBlueprint.problem_text}
                  onChange={(e) => updateBlueprint({ ...editableBlueprint, problem_text: e.target.value })}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                  rows={3}
                />
              </div>

              {/* Solutions */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">Solution Concepts</h4>
                {editableBlueprint.solutions.map((solution, index) => (
                  <div key={solution.id} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-3 space-y-2 sm:space-y-0">
                      <input
                        type="text"
                        value={solution.title}
                        onChange={(e) => {
                          const updatedSolutions = [...editableBlueprint.solutions];
                          updatedSolutions[index] = { ...solution, title: e.target.value };
                          updateBlueprint({ ...editableBlueprint, solutions: updatedSolutions });
                        }}
                        className="text-base sm:text-lg font-semibold text-gray-900 bg-transparent border-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 w-full sm:w-auto"
                      />
                      <div className="flex space-x-2 w-full sm:w-auto">
                        <select
                          value={solution.effort_level}
                          onChange={(e) => {
                            const updatedSolutions = [...editableBlueprint.solutions];
                            updatedSolutions[index] = { ...solution, effort_level: e.target.value as any };
                            updateBlueprint({ ...editableBlueprint, solutions: updatedSolutions });
                          }}
                          className="flex-1 sm:flex-none px-2 py-1 border border-gray-300 rounded text-xs sm:text-sm"
                        >
                          <option value="low">Low Effort</option>
                          <option value="medium">Medium Effort</option>
                          <option value="high">High Effort</option>
                        </select>
                        <select
                          value={solution.impact_estimate}
                          onChange={(e) => {
                            const updatedSolutions = [...editableBlueprint.solutions];
                            updatedSolutions[index] = { ...solution, impact_estimate: e.target.value as any };
                            updateBlueprint({ ...editableBlueprint, solutions: updatedSolutions });
                          }}
                          className="flex-1 sm:flex-none px-2 py-1 border border-gray-300 rounded text-xs sm:text-sm"
                        >
                          <option value="low">Low Impact</option>
                          <option value="medium">Medium Impact</option>
                          <option value="high">High Impact</option>
                        </select>
                      </div>
                    </div>
                    <textarea
                      value={solution.description}
                      onChange={(e) => {
                        const updatedSolutions = [...editableBlueprint.solutions];
                        updatedSolutions[index] = { ...solution, description: e.target.value };
                        updateBlueprint({ ...editableBlueprint, solutions: updatedSolutions });
                      }}
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                      rows={3}
                    />
                  </div>
                ))}
              </div>

              {/* Roadmap */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">Implementation Roadmap</h4>
                {editableBlueprint.roadmap.map((phase, index) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <h5 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">{phase.phase}</h5>
                    <div className="space-y-2">
                      {phase.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={task}
                            onChange={(e) => {
                              const updatedRoadmap = [...editableBlueprint.roadmap];
                              updatedRoadmap[index].tasks[taskIndex] = e.target.value;
                              updateBlueprint({ ...editableBlueprint, roadmap: updatedRoadmap });
                            }}
                            className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col h-64 lg:h-auto">
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center text-sm sm:text-base">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Chat
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {messages.map((message) => {
              const isCurrentUser = message.sender === 'user';
              const participant = participants.find(p => p.userId === message.sender);
              
              return (
                <div key={message.id} className={`flex items-start space-x-2 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium flex-shrink-0">
                    {message.sender === 'ai' ? (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        AI
                      </div>
                    ) : participant?.avatar ? (
                      <img
                        src={participant.avatar}
                        alt={participant.name}
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        {participant?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <div className={`flex-1 max-w-xs ${isCurrentUser ? 'text-right' : ''}`}>
                    <div className={`rounded-lg p-2 sm:p-3 ${
                      isCurrentUser 
                        ? 'bg-blue-500 text-white' 
                        : message.sender === 'ai'
                        ? 'bg-purple-100 text-purple-900'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-xs sm:text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 sm:p-4 border-t border-gray-200">
            <form onSubmit={sendMessage} className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message or 'hey ai'..."
                className="flex-1 px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-2 sm:px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
