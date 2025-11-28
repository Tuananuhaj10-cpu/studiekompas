import React, { useState } from 'react';
import { Questionnaire } from './components/Questionnaire';
import { Results } from './components/Results';
import { UserProfile, StudyRecommendation } from './types';
import { getStudyRecommendations } from './services/geminiService';
import { Button } from './components/Button';
import { HelpModal } from './components/HelpModal';

const App: React.FC = () => {
  const [view, setView] = useState<'welcome' | 'questionnaire' | 'loading' | 'results'>('welcome');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<StudyRecommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const startApp = () => setView('questionnaire');

  const handleProfileComplete = async (profile: UserProfile) => {
    setUserProfile(profile);
    setView('loading');
    setError(null);

    try {
      const recs = await getStudyRecommendations(profile);
      setRecommendations(recs);
      setView('results');
    } catch (err) {
      console.error(err);
      setError("Er ging iets mis bij het ophalen van de studies. Controleer je internetverbinding of probeer het later opnieuw.");
      setView('questionnaire'); // Go back to allow retry
    }
  };

  const handleReset = () => {
    setUserProfile(null);
    setRecommendations([]);
    setView('welcome');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              StudieKompas
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {userProfile && view === 'results' && (
              <div className="hidden sm:block text-sm font-medium text-slate-500">
                Profiel: {userProfile.profile} ({userProfile.level})
              </div>
            )}
            <button 
              onClick={() => setShowHelp(true)}
              className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-600 flex items-center justify-center transition-all"
              title="Hoe werkt het?"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {view === 'welcome' && (
          <div className="text-center max-w-3xl mx-auto space-y-8 animate-fadeIn">
            <div className="space-y-4">
              <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold tracking-wide uppercase">
                Voor Eindexamenleerlingen
              </span>
              <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Weet jij al wat je <br/>
                <span className="text-indigo-600">gaat studeren?</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Geen stress. Vertel ons wat je leuk vindt, waar je goed in bent, en wij gebruiken slimme AI om de perfecte HBO of WO studies voor jou te vinden.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={startApp} className="w-full sm:w-auto text-lg px-8 py-4">
                Start de Keuzehulp
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
              {[
                { title: "Persoonlijk Profiel", desc: "We kijken naar jouw vakkenpakket, interesses en talenten." },
                { title: "AI Analyse", desc: "Onze slimme engine analyseert duizenden studies in Nederland." },
                { title: "Direct Advies", desc: "Krijg concrete aanbevelingen en stel vragen aan de studie-coach." }
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-lg text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'questionnaire' && (
          <>
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
            <Questionnaire onComplete={handleProfileComplete} />
          </>
        )}

        {view === 'loading' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-3xl">✨</div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-slate-800">Je toekomst wordt berekend...</h3>
              <p className="text-slate-500">We analyseren je profiel en zoeken de beste matches.</p>
            </div>
          </div>
        )}

        {view === 'results' && userProfile && (
          <Results 
            recommendations={recommendations} 
            userProfile={userProfile} 
            onReset={handleReset}
          />
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} StudieKompas. Gebouwd met Gemini AI.</p>
      </footer>
    </div>
  );
};

export default App;