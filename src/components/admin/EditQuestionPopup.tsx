'use client';
import React from 'react';
import { Question } from '@/features/trust/types';

interface EditQuestionPopupProps {
  editQuestion: Question;
  setEditQuestion: (question: Question | null) => void;
  errorMessage: string;
  onClose: () => void;
  onSave: (question: Question) => void;
}

export default function EditQuestionPopup({
  editQuestion,
  setEditQuestion,
  errorMessage,
  onClose,
  onSave,
}: EditQuestionPopupProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editQuestion);
  };

  return (
    <div className="popupOverlay fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-2 sm:px-4">
      <div className="popup bg-[#F3F4F6] rounded-lg w-full max-w-[90%] sm:max-w-md max-h-[90vh] overflow-y-auto relative">
        <div className="popupHeader bg-[#3F99E9] text-white p-2 sm:p-2.5 rounded-t-lg text-center text-sm sm:text-base md:text-lg font-semibold">
          Sửa câu hỏi
        </div>
        <button
          onClick={onClose}
          className="closeButton bg-[#EF6921] text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex justify-center items-center absolute top-[-8px] sm:top-[-10px] right-[-8px] sm:right-[-10px] hover:bg-[#1B1B62] transition-colors text-sm"
        >
          ×
        </button>
        <div className="formContainer p-3 sm:p-5">
          <form onSubmit={handleSubmit}>
            <label className="formLabel block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700">
              Nội dung câu hỏi
            </label>
            <textarea
              value={editQuestion.content}
              onChange={(e) =>
                setEditQuestion({ ...editQuestion, content: e.target.value })
              }
              placeholder="Nhập nội dung câu hỏi"
              className="formInput w-full p-1 sm:p-2 border border-gray-300 rounded mb-2 sm:mb-4 text-xs sm:text-sm md:text-base"
            />
            {errorMessage && (
              <p className="text-red-500 text-xs sm:text-sm mb-2 sm:mb-4">
                {errorMessage}
              </p>
            )}
            <div className="popupButtons flex justify-center gap-2 p-2 border-t border-gray-200 rounded-b-lg">
              <button
                type="submit"
                className="saveButton bg-[#3F99E9] text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-[#1B1B62] transition-colors text-xs sm:text-sm md:text-base"
              >
                Lưu
              </button>
              <button
                type="button"
                onClick={onClose}
                className="cancelButton bg-[#F5C035] text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-[#1B1B62] transition-colors text-xs sm:text-sm md:text-base"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
