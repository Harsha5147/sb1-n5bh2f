import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Send, BarChart2, Shield, Users, AlertTriangle } from 'lucide-react';
import BillyLogo from './BillyLogo';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: "Hi there! I'm Billy, your friendly buddy against cyberbullying. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showDefenseTips, setShowDefenseTips] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const genAI = new GoogleGenerativeAI('AIzaSyBNKP4RV9Cq-MlwYPgn_Xo201YJzIs7Bzo');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `You are Billy, a supportive chatbot designed to help victims of cyberbullying. Provide empathetic responses and offer guidance. The user's message is: "${input}"`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: text },
      ]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStats = () => setShowStats(!showStats);
  const toggleDefenseTips = () => setShowDefenseTips(!showDefenseTips);
  const toggleCommunity = () => setShowCommunity(!showCommunity);

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <BillyLogo />
          <span className="ml-2">Billy - Buddy against Cyber Bullying</span>
        </h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleStats}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center transition-colors duration-300"
          >
            <BarChart2 className="mr-2" /> Stats
          </button>
          <button
            onClick={toggleDefenseTips}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center transition-colors duration-300"
          >
            <Shield className="mr-2" /> Defense Tips
          </button>
          <button
            onClick={toggleCommunity}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded flex items-center transition-colors duration-300"
          >
            <Users className="mr-2" /> Community
          </button>
          <Link
            to="/report"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center transition-colors duration-300"
          >
            <AlertTriangle className="mr-2" /> Report Incident
          </Link>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {showStats && (
          <div className="mb-4 p-4 bg-gray-800 rounded-lg shadow-lg animate-fade-in">
            <h2 className="text-xl font-bold mb-2 text-blue-300">Cyberbullying Statistics</h2>
            <p className="text-gray-300">Here you can display real-time statistics on cyberbullying incidents.</p>
          </div>
        )}
        {showDefenseTips && (
          <div className="mb-4 p-4 bg-gray-800 rounded-lg shadow-lg animate-fade-in">
            <h2 className="text-xl font-bold mb-2 text-green-300">Defense Tips</h2>
            <ul className="list-disc pl-5 text-gray-300">
              <li>Don't respond to bullying messages</li>
              <li>Block the bully on social media platforms</li>
              <li>Save evidence of cyberbullying</li>
              <li>Report the incident to the platform</li>
              <li>Talk to a trusted adult or counselor</li>
            </ul>
          </div>
        )}
        {showCommunity && (
          <div className="mb-4 p-4 bg-gray-800 rounded-lg shadow-lg animate-fade-in">
            <h2 className="text-xl font-bold mb-2 text-purple-300">Community Support</h2>
            <p className="text-gray-300">Connect with others who have faced similar situations. Share experiences and advice anonymously.</p>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-white'
              } shadow-md animate-pop-in`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-gray-900">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message here..."
            className="flex-1 p-2 bg-gray-800 text-white border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-300"
            disabled={isLoading}
          >
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;