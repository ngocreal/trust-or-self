import React from 'react';

interface RulesProps {
  onClose: () => void;
}

export default function RulesPopup({ onClose }: RulesProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-10 rounded-lg text-center w-[500px] h-[300px] flex flex-col items-center justify-center">
        <p className="text-2xl font-semibold mb-6">Lưu ý: Không có câu trả lời đúng hay sai tuyệt đối. Mỗi lựa chọn phản ánh giá trị cá nhân.</p>
        <button
          className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 px-8 py-4 border-none rounded-[30px] bg-[#1b1b62] text-white text-[20px] font-bold cursor-pointer transition-colors duration-300 w-[250px] hover:bg-[#feb622] mb-25"
          onClick={onClose}
        >
          Tôi đã hiểu
        </button>
      </div>
    </div>
  );
}