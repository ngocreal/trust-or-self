import React from 'react';
import { FaQuestion } from 'react-icons/fa';
import { Question } from '@/features/trust/types';

interface QuestionScreenProps {
  currentQuestion: Question | null;
  showChoices: boolean;
  onChoice: (choice: 'trust' | 'self') => void;
  onShowRules: () => void;
}

export default function QuestionScreen({ currentQuestion, showChoices, onChoice, onShowRules }: QuestionScreenProps) {
  return (
    <div className="relative w-full h-screen bg-[#686868] flex flex-col items-center justify-center text-white p-4">
      <div className="relative w-full flex justify-center">
        <div className="absolute z-20 left-1/2 -translate-x-1/2 -top-11">
          <img src="/trust-or-self-logo.png" alt="Logo" className="w-48" />
        </div>
      </div>

      <button className="absolute top-5 right-5 w-10 h-10 bg-[#1b1b62] rounded-full flex items-center justify-center text-white text-xl hover:bg-[#feb622] transition-colors duration-300" onClick={onShowRules}>
        <FaQuestion />
      </button>

      <div className="bg-white text-black p-8 pt-20 rounded-lg shadow-lg max-w-6xl w-11/12 text-center mb-10 mt-0 relative z-10">
        <p className="text-2xl font-bold">{currentQuestion?.content}</p>
      </div>

      {showChoices && (
        <div className="flex gap-40 justify-center w-full max-w-3xl mt-10">
          <div className="flex flex-col items-center w-48">
<button onClick={() => { console.log('Trust click'); onChoice('trust'); }}>              <img src="/trust-button.png" alt="Trust" className="w-44 h-44" />
            </button>
            <span className="text-white text-4xl font-bold mt-4 text-center w-full">Trust</span>
          </div>
          <div className="flex flex-col items-center w-48">
            <button onClick={() => onChoice('self')}>
              <img src="/self-button.png" alt="Self" className="w-44 h-44" />
            </button>
            <span className="text-white text-4xl font-bold mt-4 text-center w-full">Self</span>
          </div>
        </div>
      )}
    </div>
  );
}