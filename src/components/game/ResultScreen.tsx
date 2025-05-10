import React from 'react';
import { FaWrench, FaQuestion } from 'react-icons/fa';
import { Result } from '@/features/trust/types';

interface ResultScreenProps {
  result: Result;
  onNextQuestion: () => void;
  onSettings: () => void;
  onShowRules: () => void;
}

export default function ResultScreen({ result, onNextQuestion, onSettings, onShowRules }: ResultScreenProps) {
  return (
    <div className="h-screen bg-[#686868] flex flex-col items-center justify-center text-white">
      <img src="/trust-or-self-logo.png" alt="Logo" className="w-72 mb-6" />
      <h1 className="text-4xl font-bold mb-4">{result.percentage}%</h1>
      <p className="text-xl mb-6">người cùng suy nghĩ với bạn</p>
      <img
        src={result.choice === 'trust' ? '/trust-button.png' : '/self-button.png'}
        alt={result.choice}
        className="w-32 h-32 mb-6"
      />
      <button
        className="px-8 py-4 border-none rounded-[30px] bg-[#1b1b62] text-white text-[20px] font-bold cursor-pointer transition-colors duration-300 w-[250px] hover:bg-[#feb622]"
        onClick={onNextQuestion}
      >
        Câu kế tiếp
      </button>
      <button className="absolute bottom-5 right-5 text-white text-2xl" onClick={onSettings}><FaWrench /></button>
      <button className="absolute top-5 right-5 w-10 h-10 bg-[#1b1b62] rounded-full flex items-center justify-center text-white text-xl hover:bg-[#feb622] transition-colors duration-300" onClick={onShowRules}>
        <FaQuestion />
      </button>
    </div>
  );
}