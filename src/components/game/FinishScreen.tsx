import React from 'react';
import { FaCog, FaQuestion } from 'react-icons/fa';
import Image from 'next/image';

interface FinishScreenProps {
  onReplay: () => void;
  onSettings: () => void;
  onShowRules: () => void;
}

export default function FinishScreen({ onReplay, onSettings, onShowRules }: FinishScreenProps) {
  return (
    <div className="h-screen bg-[#686868] flex flex-col items-center justify-center text-white relative">
      <Image src="/trust-or-self-logo.png" alt="Logo" width={240} height={120} className="w-60 mb-16" />
      <h1 className="text-7xl font-bold mb-10">Chúc mừng</h1>
      <p className="text-4xl font-bold mb-10">bạn đã hoàn thành trò chơi</p>
      <button
        className="px-12 py-4 bg-[#f5e6cc] text-[#1b1b62] text-[20px] font-bold rounded-full cursor-pointer hover:bg-[#feb622] transition-colors duration-300 w-[300px]"
        onClick={onReplay}
      >
        Chơi lại
      </button>
      <button className="absolute bottom-5 right-5 text-white text-2xl cursor-pointer" onClick={onSettings}><FaCog /></button>
      <button className="absolute top-5 right-5 w-10 h-10 bg-[#1b1b62] rounded-full flex items-center justify-center text-white text-xl hover:bg-[#feb622] transition-colors duration-300 cursor-pointer" onClick={onShowRules}>
        <FaQuestion />
      </button>
    </div>
  );
}