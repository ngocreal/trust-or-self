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
      <img src="/trust-or-self-logo.png" alt="Logo" className="w-48 mb-10" /> 
      
      <button className="absolute top-5 right-5 w-10 h-10 bg-[#1b1b62] rounded-full flex items-center justify-center text-white text-xl hover:bg-[#feb622] transition-colors duration-300" onClick={onShowRules}>
        <FaQuestion />
      </button>
      <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-xl w-11/12 text-center mb-10"> {/* Thêm margin-bottom để tạo khoảng cách với nút */}
        <p className="text-lg font-semibold">{currentQuestion?.content}</p>
      </div>

      {showChoices && (
        <div className="flex gap-16 justify-center w-full max-w-xl"> 
          <div className="flex flex-col items-center">
            <button onClick={() => onChoice('trust')}>
              <img src="/trust-button.png" alt="Trust" className="w-32 h-32" />
            </button>
            <span className="text-white text-lg font-bold mt-2">Trust</span> 
          </div>
          <div className="flex flex-col items-center">
            <button onClick={() => onChoice('self')}>
              <img src="/self-button.png" alt="Self" className="w-40 h-40" />
            </button>
            <span className="text-white text-lg font-bold mt-2">Self</span> 
          </div>
        </div>
      )}
    </div>
  );
}