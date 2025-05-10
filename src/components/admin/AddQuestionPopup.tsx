import { Question } from '@/features/trust/types';

interface AddQuestionPopupProps {
  newQuestion: Partial<Question>;
  setNewQuestion: (question: Partial<Question>) => void;
  errorMessage: string;
  onClose: () => void;
  onSave: (newQuestion: Partial<Question>) => void;
}

export default function AddQuestionPopup({
  newQuestion,
  setNewQuestion,
  errorMessage,
  onClose,
  onSave,
}: AddQuestionPopupProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(newQuestion);
  };

  return (
    <div className="popupOverlay fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-2 sm:px-4">
      <div className="popup bg-[#F3F4F6] rounded-lg w-full max-w-[90%] sm:max-w-md max-h-[90vh] overflow-y-auto relative">
        <div className="popupHeader bg-[#3F99E9] text-white p-2 sm:p-2.5 rounded-t-lg text-center text-sm sm:text-base md:text-lg font-semibold">
          Thêm câu hỏi
        </div>
        <button
          onClick={onClose}
          className="closeButton bg-[#EF6921] text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex justify-center items-center absolute top-[-8px] sm:top-[4px] right-[-8px] sm:right-[2px] hover:bg-[#1B1B62] transition-colors text-sm"
        >
          ×
        </button>
        <div className="formContainer p-3 sm:p-5">
          <form onSubmit={handleSubmit}>
            <label className="formLabel block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700">Question ID</label>
            <input
              type="text"
              value={newQuestion._id || ''}
              onChange={(e) => setNewQuestion({ ...newQuestion, _id: e.target.value })}
              placeholder="Question ID"
              className="formInput w-full p-1 sm:p-2 border border-gray-300 rounded mb-2 sm:mb-4 text-xs sm:text-sm md:text-base"
            />
            <label className="formLabel block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700">Câu hỏi</label>
            <input
              type="text"
              value={newQuestion.content || ''}
              onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
              placeholder="Content"
              className="formInput w-full p-1 sm:p-2 border border-gray-300 rounded mb-2 sm:mb-4 text-xs sm:text-sm md:text-base"
            />
            {errorMessage && (
              <p className="text-red-500 text-xs sm:text-sm mb-2 sm:mb-4">{errorMessage}</p>
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
