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
    <div className="relative w-full h-screen bg-black flex flex-col items-center justify-center text-white">
      <img src="/trust-or-self-logo.png" alt="Logo" className="w-72 absolute top-5" />
      <button className="absolute top-5 right-5 w-10 h-10 bg-[#1b1b62] rounded-full flex items-center justify-center text-white text-xl hover:bg-[#feb622] transition-colors duration-300" onClick={onShowRules}>
        <FaQuestion />
      </button>
      <div className="bg-white text-black p-6 rounded-lg mt-44 shadow-lg max-w-xl w-11/12 text-center">
        <p className="text-lg font-semibold mb-6">{currentQuestion?.content}</p>
        {showChoices && (
          <div className="flex gap-6 justify-center">
            <button onClick={() => onChoice('trust')}>
              <img src="/trust-button.png" alt="Trust" className="w-32 h-32" />
            </button>
            <button onClick={() => onChoice('self')}>
              <img src="/self-button.png" alt="Self" className="w-32 h-32" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}