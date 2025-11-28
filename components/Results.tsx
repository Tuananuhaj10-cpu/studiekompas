import React, { useState } from 'react';
import { StudyRecommendation, UserProfile, ChatMessage } from '../types';
import { chatWithAdvisor } from '../services/geminiService';
import { Button } from './Button';

interface ResultsProps {
  recommendations: StudyRecommendation[];
  userProfile: UserProfile;
  onReset: () => void;
}

export const Results: React.FC<ResultsProps> = ({ recommendations, userProfile, onReset }) => {
  const [selectedStudy, setSelectedStudy] = useState<StudyRecommendation | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);

  // Initialize history with context
  const getGeminiHistory = () => {
    const context = `
      De gebruiker heeft de volgende studies aangeraden gekregen:
      ${recommendations.map(r => r.name).join(', ')}.
      De gebruiker heet ${userProfile.name}.
    `;
    return [
      { role: "user", parts: [{ text: context }] },
      { role: "model", parts: [{ text: "Begrepen. Ik zal helpen met vragen over deze studies." }] },
      ...chatHistory.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }))
    ];
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatting(true);

    const response = await chatWithAdvisor(getGeminiHistory(), userMsg);
    
    setChatHistory(prev => [...prev, { role: 'model', text: response || "" }]);
    setIsChatting(false);
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      {/* Left Column: Recommendations */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            Aanbevolen voor {userProfile.name}
          </h2>
          <Button variant="outline" onClick={onReset} className="text-sm py-2 px-4">
            Opnieuw
          </Button>
        </div>

        <div className="grid gap-6">
          {recommendations.map((study, idx) => (
            <div 
              key={study.id} 
              className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all cursor-pointer hover:shadow-md ${
                selectedStudy?.id === study.id ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-slate-100 hover:border-indigo-200'
              }`}
              onClick={() => setSelectedStudy(study)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-md">
                      {study.level}
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                      study.matchScore > 85 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {study.matchScore}% Match
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">{study.name}</h3>
                </div>
                <div className="bg-slate-50 p-2 rounded-full text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">{study.description}</p>
              
              <div className="text-sm">
                <p className="font-medium text-slate-700 mb-1">Waarom dit past:</p>
                <p className="text-slate-600 italic">"{study.matchReason}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Details & Chat */}
      <div className="lg:col-span-1">
        <div className="sticky top-8 space-y-6">
          
          {/* Detailed View Card */}
          {selectedStudy ? (
            <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <h3 className="text-2xl font-bold mb-1">{selectedStudy.name}</h3>
                <p className="opacity-90">{selectedStudy.level} Opleiding</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Vakken</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudy.keySubjects.map(s => (
                      <span key={s} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Carrière</h4>
                  <ul className="list-disc list-inside text-slate-600 text-sm space-y-1">
                    {selectedStudy.careerOpportunities.map(job => (
                      <li key={job}>{job}</li>
                    ))}
                  </ul>
                </div>
                <Button 
                  variant="secondary" 
                  className="w-full text-sm"
                  onClick={() => {
                    setChatInput(`Vertel me meer over de opleiding ${selectedStudy.name}. Is het moeilijk?`);
                    // focus input?
                  }}
                >
                  Stel een vraag hierover
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-2xl p-8 text-center">
              <p className="text-indigo-800 font-medium">Klik op een opleiding links om de details te zien.</p>
            </div>
          )}

          {/* AI Chat Widget */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col h-[400px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
              <h3 className="font-bold text-slate-700 flex items-center gap-2">
                <span className="text-xl">🤖</span> Studie Coach
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatHistory.length === 0 && (
                <p className="text-center text-slate-400 text-sm mt-8">
                  Heb je vragen over een studie? Vraag maar raak!
                </p>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-slate-100 text-slate-800 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatting && (
                 <div className="flex justify-start">
                   <div className="bg-slate-100 rounded-2xl px-4 py-2 rounded-bl-none">
                     <div className="flex space-x-1">
                       <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                       <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                       <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                     </div>
                   </div>
                 </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Typ je vraag..."
                className="flex-1 bg-slate-50 border-transparent focus:bg-white border focus:border-indigo-300 rounded-xl px-4 py-2 text-sm outline-none transition-all"
              />
              <button 
                type="submit"
                disabled={!chatInput.trim() || isChatting}
                className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};