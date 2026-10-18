import React, { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Info, 
  HelpCircle, 
  CornerDownLeft,
  RotateCcw
} from 'lucide-react';

export const AssistantView = () => {
  const { currency, isAuthenticated } = useAuth();

  const suggestedQuestions = [
    "Where did most of my money go?",
    "How much did I spend this month?",
    "How can I reduce my expenses?",
    "Am I staying within my budget?",
    "What might I spend next month?"
  ];

  const initialMessage = {
    sender: 'assistant',
    text: "Hello! I can help answer questions about your spending, budgets, and savings based on your recorded activity.",
    type: 'greeting'
  };

  const [messages, setMessages] = useState([initialMessage]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async (queryToSend) => {
    const text = (queryToSend || inputQuery).trim();
    if (!text || loading) return;

    setInputQuery('');
    setError(null);

    // Append user message
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setLoading(true);

    try {
      const res = await api.post('/analytics/ai-query', { query: text });
      const answer = res.data?.answer || "I reviewed your records, but could not produce a detailed answer for that topic.";
      
      // Check if answer discusses estimates/forecast
      const isEstimate = text.toLowerCase().includes('forecast') || 
                         text.toLowerCase().includes('next month') || 
                         text.toLowerCase().includes('predict') || 
                         text.toLowerCase().includes('might I spend');

      setMessages((prev) => [
        ...prev, 
        { 
          sender: 'assistant', 
          text: answer,
          isEstimate: isEstimate
        }
      ]);
    } catch (err) {
      setError("Unable to connect with the assistant right now. Please verify your internet connection or backend status.");
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: "I ran into a temporary issue retrieving your data. Please try asking again in a moment.",
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([initialMessage]);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E8F3FF] border border-[#BBD9F5] text-[#477EAD] flex items-center justify-center">
              <MessageSquare className="w-4 h-4 stroke-[2]" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#24364B]">Ask Pennywise</h1>
          </div>
          <p className="text-xs text-[#687789] mt-1">
            A practical companion to explain your spending, category budgets, and savings in plain language.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="text-xs text-[#687789] hover:text-[#24364B] flex items-center gap-1.5 self-start sm:self-auto px-2.5 py-1.5 rounded-lg border border-[#E6E8EC] bg-white hover:bg-[#FAF9F5] transition-colors"
          title="Start conversation over"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear chat</span>
        </button>
      </div>

      {/* Suggested Questions Chips */}
      <div className="penny-card p-4 bg-white">
        <span className="text-[11px] font-semibold text-[#687789] uppercase tracking-wider block mb-2">
          Suggested questions to ask:
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="text-xs px-3 py-1.5 rounded-lg bg-[#FAF9F5] hover:bg-[#E8F3FF] text-[#24364B] hover:text-[#477EAD] border border-[#E6E8EC] hover:border-[#BBD9F5] transition-colors text-left disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="penny-card p-4 sm:p-6 bg-white min-h-[360px] max-h-[500px] overflow-y-auto space-y-4">
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={idx}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div className="text-[10px] text-[#687789] px-1 font-medium">
                {isUser ? 'You' : 'Pennywise Assistant'}
              </div>

              <div
                className={`p-3.5 rounded-2xl max-w-xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-[#477EAD] text-white rounded-tr-xs shadow-xs'
                    : msg.isError
                    ? 'bg-[#FDE8E8] text-[#9B2C2C] border border-[#F8B4B4] rounded-tl-xs'
                    : 'bg-[#FAF9F5] text-[#24364B] border border-[#E6E8EC] rounded-tl-xs'
                }`}
              >
                {msg.text}

                {/* Estimate Distinction Badge */}
                {msg.isEstimate && (
                  <div className="mt-2.5 pt-2 border-t border-[#E6E8EC] text-[11px] text-[#687789] flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#477EAD] shrink-0" />
                    <span>Note: This is a spending estimate based on historical averages, not a guaranteed figure.</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#687789] p-3 rounded-xl bg-[#FAF9F5] border border-[#E6E8EC] w-fit animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-[#477EAD] animate-spin" />
            <span>Consulting your financial records...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask a question about your spending, budget, or savings..."
            disabled={loading}
            className="w-full bg-white border border-[#E6E8EC] rounded-xl px-4 py-3 text-xs sm:text-sm text-[#24364B] placeholder-[#687789] focus:outline-none focus:border-[#477EAD] transition-colors shadow-xs"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !inputQuery.trim()}
          className="px-5 py-3 rounded-xl bg-[#477EAD] hover:bg-[#396992] text-white font-medium text-xs sm:text-sm transition-all shadow-xs disabled:opacity-50 flex items-center gap-1.5 shrink-0"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Transparency Note */}
      <p className="text-[11px] text-[#687789] text-center">
        Pennywise uses your actual recorded income, expenses, and category rules to answer questions accurately without guessing.
      </p>
    </div>
  );
};
