import React from 'react';
import { FaCog, FaQuestion } from 'react-icons/fa';

interface LoadingScreenProps {
  text: string;
  onSettings: () => void;
  onShowRules: () => void; 
}

export default function LoadingScreen({ text, onSettings, onShowRules }: LoadingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      <p className="text-xl mb-6">{text}</p>
      <button className="absolute bottom-5 right-5 text-white text-2xl" onClick={onSettings}><FaCog /></button>
      <button className="absolute top-5 right-5 w-10 h-10 bg-[#1b1b62] rounded-full flex items-center justify-center text-white text-xl hover:bg-[#feb622] transition-colors duration-300" onClick={onShowRules}>
        <FaQuestion />
      </button>
    </div>
  );
}