interface DeleteQuestionPopupProps {
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteQuestionPopup({ onClose, onConfirm }: DeleteQuestionPopupProps) {
  return (
    <div className="popupOverlay fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-2 sm:px-4">
      <div className="popup bg-[#F3F4F6] rounded-lg w-full max-w-[90%] sm:max-w-md max-h-[90vh] overflow-y-auto relative">
        <div className="popupHeader bg-[#3F99E9] text-white p-2 sm:p-2.5 rounded-t-lg text-center text-sm sm:text-base md:text-lg font-semibold">
          Xóa câu hỏi
        </div>
        <button
          onClick={onClose}
          className="closeButton bg-[#EF6921] text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex justify-center items-center absolute top-2 right-2 hover:bg-[#1B1B62] transition-colors text-sm"
        >
          ×
        </button>
        <div className="formContainer p-3 sm:p-5">
          <p className="text-center text-sm sm:text-base md:text-lg mb-3 sm:mb-5 text-gray-700">
            Bạn có chắc chắn muốn xóa câu hỏi này?
          </p>
          <div className="popupButtons flex justify-center gap-2 p-2 border-t border-gray-200 rounded-b-lg">
            <button
              onClick={onConfirm}
              className="saveButton bg-[#3F99E9] text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-[#1B1B62] transition-colors text-xs sm:text-sm md:text-base"
            >
              Xác nhận
            </button>
            <button
              onClick={onClose}
              className="cancelButton bg-[#F5C035] text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-[#1B1B62] transition-colors text-xs sm:text-sm md:text-base"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
