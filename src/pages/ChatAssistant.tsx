import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertTriangle, Shield, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Initial welcome message
    const welcomeMessage: Message = {
      id: '1',
      text: `Hello ${user?.name || 'there'}! I'm Safeya, your AI safety assistant. I'm here to help with safety advice, emergency guidance, and support. How can I help you today?`,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const quickReplies = [
    "I feel unsafe walking alone",
    "Safety tips for traveling",
    "What to do in an emergency",
    "Help with harassment",
    "Home security advice",
    "Digital safety tips"
  ];

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Safety keywords and responses
    if (lowerMessage.includes('unsafe') || lowerMessage.includes('scared') || lowerMessage.includes('afraid')) {
      return "I understand you're feeling unsafe. Here are some immediate steps: 1) Move to a well-lit, populated area if possible. 2) Call someone you trust. 3) Trust your instincts. 4) If in immediate danger, call emergency services (100 for police, 1091 for women's helpline). Would you like specific advice for your situation?";
    }
    
    if (lowerMessage.includes('travel') || lowerMessage.includes('trip')) {
      return "For safe travel: 1) Share your itinerary with trusted contacts. 2) Keep emergency numbers handy. 3) Stay in well-reviewed accommodations. 4) Avoid isolated areas, especially at night. 5) Keep copies of important documents. 6) Trust local authorities and your instincts. Need specific travel safety tips?";
    }
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('help')) {
      return "In an emergency: 1) Call 100 (Police) or 1091 (Women's Helpline) immediately. 2) Share your location with emergency contacts. 3) Stay on the line with authorities. 4) Move to safety if possible. 5) Don't hesitate to make noise to attract attention. Remember: Your safety is the priority. What specific emergency situation are you concerned about?";
    }
    
    if (lowerMessage.includes('harassment') || lowerMessage.includes('abuse')) {
      return "I'm sorry you're dealing with this. For harassment: 1) Document everything (screenshots, dates, witnesses). 2) Report to authorities immediately. 3) Inform your employer/school if relevant. 4) Contact women's helpline (1091) for support. 5) Consider legal action. 6) Reach out to trusted friends/family. You're not alone in this. Would you like information about local support services?";
    }
    
    if (lowerMessage.includes('home') || lowerMessage.includes('house')) {
      return "Home safety tips: 1) Always lock doors and windows. 2) Install good lighting around entrances. 3) Use peepholes and security cameras. 4) Don't open doors to strangers. 5) Have emergency numbers readily available. 6) Consider a security system. 7) Keep important documents secure. What specific home safety concerns do you have?";
    }
    
    if (lowerMessage.includes('digital') || lowerMessage.includes('online') || lowerMessage.includes('cyber')) {
      return "Digital safety guidelines: 1) Use strong, unique passwords. 2) Enable two-factor authentication. 3) Be cautious sharing personal information online. 4) Review privacy settings regularly. 5) Don't click suspicious links. 6) Report cyberbullying immediately. 7) Keep software updated. Any specific digital threats you're concerned about?";
    }
    
    if (lowerMessage.includes('work') || lowerMessage.includes('office')) {
      return "Workplace safety: 1) Know your company's harassment policies. 2) Document inappropriate behavior. 3) Report to HR or management. 4) Seek support from trusted colleagues. 5) Know your legal rights. 6) Consider external reporting if internal channels fail. 7) Contact women's helpline (1091) for guidance. What workplace situation are you facing?";
    }
    
    // Default response
    return "I'm here to help with any safety concerns you have. I can provide advice on personal safety, travel security, digital protection, workplace harassment, home safety, and emergency situations. What specific safety topic would you like to discuss?";
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputText),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const sendQuickReply = (reply: string) => {
    setInputText(reply);
    setTimeout(() => sendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
              <Bot className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Safety Assistant</h1>
          <p className="text-lg text-gray-600">Get instant safety advice and support from Safeya, your AI companion</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-pink-500' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  
                  {/* Message */}
                  <div className={`rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-pink-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Quick questions you can ask:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    onClick={() => sendQuickReply(reply)}
                    className="bg-white hover:bg-pink-50 text-gray-700 hover:text-pink-700 px-3 py-2 rounded-full text-xs border border-gray-200 hover:border-pink-300 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about safety..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                  rows={2}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white p-3 rounded-lg transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-xl mt-8">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 mr-2" />
            <h3 className="font-bold text-lg">Emergency Reminder</h3>
          </div>
          <p className="text-center text-red-100">
            If you're in immediate danger, don't rely on this chat. Call emergency services immediately: 
            <strong className="block mt-2 text-xl">100 (Police) | 1091 (Women's Helpline)</strong>
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <Shield className="h-8 w-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">24/7 Available</h3>
            <p className="text-sm text-gray-600">Get safety advice anytime, anywhere</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <Heart className="h-8 w-8 text-pink-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Empathetic Support</h3>
            <p className="text-sm text-gray-600">Understanding and caring responses</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <Bot className="h-8 w-8 text-teal-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Expert Knowledge</h3>
            <p className="text-sm text-gray-600">Trained on safety best practices</p>
          </div>
        </div>
      </div>
    </div>
  );
}