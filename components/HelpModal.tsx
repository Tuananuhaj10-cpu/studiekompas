import React from 'react';
import { Button } from './Button';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 md:p-8 animate-fadeIn">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Sluiten"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Hoe werkt StudieKompas?</h2>
        </div>

        <div className="space-y-6 mb-8">
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm mt-0.5">1</div>
            <div>
              <h3 className="font-semibold text-slate-800">Vul je profiel in</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Vertel ons wie je bent, wat je niveau (HAVO/VWO/MBO) is en waar je interesses liggen.</p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm mt-0.5">2</div>
            <div>
              <h3 className="font-semibold text-slate-800">Ontvang studie-advies</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Onze slimme AI analyseert je antwoorden en zoekt de beste matches voor jou.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm mt-0.5">3</div>
            <div>
              <h3 className="font-semibold text-slate-800">Chat met de coach</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Klik op een studie voor details en stel al je vragen aan de ingebouwde AI-studiecoach.</p>
            </div>
          </div>
        </div>

        <Button onClick={onClose} className="w-full">
          Ik snap het!
        </Button>
      </div>
    </div>
  );
};