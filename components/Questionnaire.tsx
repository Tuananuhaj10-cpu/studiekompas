import React, { useState } from 'react';
import { UserProfile, EducationLevel, ProfileType } from '../types';
import { Button } from './Button';

interface QuestionnaireProps {
  onComplete: (profile: UserProfile) => void;
}

export const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    level: EducationLevel.HAVO,
    profile: ProfileType.NG,
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = () => {
    if (formData.name && formData.favoriteSubjects) {
      onComplete(formData as UserProfile);
    }
  };

  const updateField = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-indigo-600 h-full transition-all duration-500 ease-out"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      <div className="min-h-[300px]">
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800">Laten we beginnen! Hoe heet je?</h2>
            <input
              type="text"
              placeholder="Jouw naam"
              className="w-full p-4 text-xl border-2 border-slate-200 rounded-xl focus:border-indigo-600 focus:ring-0 outline-none transition-colors"
              value={formData.name || ''}
              onChange={(e) => updateField('name', e.target.value)}
              autoFocus
            />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-700">Welk niveau doe je?</h3>
              <div className="flex gap-4">
                {Object.values(EducationLevel).map((level) => (
                  <button
                    key={level}
                    onClick={() => updateField('level', level)}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium border-2 transition-all ${
                      formData.level === level 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                        : 'border-slate-200 text-slate-600 hover:border-indigo-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800">Wat is je profiel?</h2>
            <p className="text-slate-500">Dit helpt ons bepalen welke studies je mag doen.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(ProfileType).map((p) => (
                <button
                  key={p}
                  onClick={() => updateField('profile', p)}
                  className={`p-4 rounded-xl text-left border-2 transition-all ${
                    formData.profile === p 
                      ? 'border-indigo-600 bg-indigo-50 shadow-md' 
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className={`font-semibold ${formData.profile === p ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {p}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800">Waar word je blij van?</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Favoriete schoolvakken</label>
              <input
                type="text"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Bijv. Geschiedenis, Wiskunde B, Gym..."
                value={formData.favoriteSubjects || ''}
                onChange={(e) => updateField('favoriteSubjects', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Hobby's & Interesses</label>
              <textarea
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-24"
                placeholder="Bijv. Gamen, sporten, lezen, programmeren..."
                value={formData.hobbies || ''}
                onChange={(e) => updateField('hobbies', e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-slate-800">Hoe leer en werk je graag?</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Praktisch of Theoretisch?</label>
              <div className="flex gap-2">
                {['Vooral Praktisch', 'Mix', 'Vooral Theoretisch'].map((style) => (
                  <button
                    key={style}
                    onClick={() => updateField('workStyle', style)}
                    className={`flex-1 py-2 text-sm md:text-base rounded-lg border transition-colors ${
                      formData.workStyle === style 
                        ? 'bg-indigo-600 text-white border-indigo-600' 
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Heb je al een droombaan?</label>
              <input
                type="text"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Bijv. Iets met mensen, advocaat, geen idee..."
                value={formData.dreamJob || ''}
                onChange={(e) => updateField('dreamJob', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
        <Button 
          variant="outline" 
          onClick={handleBack} 
          disabled={step === 1}
          className={step === 1 ? 'invisible' : ''}
        >
          Terug
        </Button>
        
        {step < 4 ? (
          <Button onClick={handleNext} disabled={!formData.name && step === 1}>
            Volgende
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-indigo-600 to-purple-600 border-none">
            Vind mijn studies ✨
          </Button>
        )}
      </div>
    </div>
  );
};