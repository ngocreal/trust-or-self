import React from 'react';
import { FaWrench } from 'react-icons/fa';
import RulesPopup from './RulesPopup'; // Import RulesPopup

interface StartScreenProps {
  onStartGame: () => void;
  onShowRulesPopup: () => void;
  onSettings: () => void;
  showRulesPopup: boolean;
  onCloseRulesPopup: () => void;
}

export default function StartScreen({ onStartGame, onShowRulesPopup, onSettings, showRulesPopup, onCloseRulesPopup }: StartScreenProps) {
  return (
    <div className="relative w-full h-screen bg-cover bg-center flex flex-col items-center justify-center" style={{ backgroundImage: "url('/splash-background.jpg')" }}>
      <button
        className="absolute bottom-[15%] left-1/2 transform -translate-x-1/2 px-8 py-4 border-3 border-[#1b1b62] rounded-[30px] bg-white text-[#1b1b62] text-[20px] font-bold cursor-pointer transition-colors duration-300 w-[300px] hover:bg-[#feb622] mb-4"
        onClick={onStartGame}
      >
        Bắt đầu
      </button>
      <button
        className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 px-8 py-4 border-none rounded-[30px] bg-[#1b1b62] text-white text-[20px] font-bold cursor-pointer transition-colors duration-300 w-[300px] hover:bg-[#feb622] mb-2"
        onClick={onShowRulesPopup}
      >
        Cách chơi
      </button>
      {showRulesPopup && <RulesPopup onClose={onCloseRulesPopup} />}
      <button className="absolute bottom-5 right-5 text-white text-2xl" onClick={onSettings}><FaWrench /></button>
    </div>
  );
}