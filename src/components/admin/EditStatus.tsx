import { Status } from '@/features/trust/types';

interface EditStatusPopupProps {
  editStatus: Status;
  setEditStatus: (status: Status) => void;
  errorMessage: string;
  onClose: () => void;
  onSave: (editStatus: Status) => void;
  onReset: (status: Status) => Status;
}

export default function EditStatusPopup({
  editStatus,
  setEditStatus,
  errorMessage,
  onClose,
  onSave,
  onReset,
}: EditStatusPopupProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editStatus);
  };

  const handleResetClick = () => {
    const resetStatus = onReset(editStatus);
    setEditStatus(resetStatus);
  };

  return (
    <div className="popupOverlay fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-2 sm:px-4">
      <div className="popup bg-[#F3F4F6] rounded-lg w-full max-w-[90%] sm:max-w-md max-h-[90vh] overflow-y-auto relative">
        <div className="popupHeader bg-[#3F99E9] text-white p-2 sm:p-2.5 rounded-t-lg text-center text-sm sm:text-base md:text-lg font-semibold">
          Sửa trạng thái
        </div>
        <button
          onClick={onClose}
          className="closeButton bg-[#EF6921] text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex justify-center items-center absolute top-[-8px] sm:top-[-10px] right-[-8px] sm:right-[-10px] hover:bg-[#1B1B62] transition-colors text-sm"
        >
          ×
        </button>
        <div className="formContainer p-3 sm:p-5">
          <form onSubmit={handleSubmit}>
            <label className="formLabel block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700">Mã câu hỏi</label>
            <input
              type="text"
              value={editStatus.question_id}
              onChange={(e) => setEditStatus({ ...editStatus, question_id: e.target.value })}
              readOnly
              placeholder="Mã câu hỏi"
              className="formInput w-full p-1 sm:p-2 border border-gray-300 rounded mb-2 sm:mb-4 text-xs sm:text-sm md:text-base"
            />
            <label className="formLabel block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700">Trust</label>
            <input
              type="number"
              value={editStatus.count_a}
              onChange={(e) => setEditStatus({ ...editStatus, count_a: parseInt(e.target.value) })}
              placeholder="Trust"
              className="formInput w-full p-1 sm:p-2 border border-gray-300 rounded mb-2 sm:mb-4 text-xs sm:text-sm md:text-base"
            />
            <label className="formLabel block text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-gray-700">Self</label>
            <input
              type="number"
              value={editStatus.count_b}
              onChange={(e) => setEditStatus({ ...editStatus, count_b: parseInt(e.target.value) })}
              placeholder="Self"
              className="formInput w-full p-1 sm:p-2 border border-gray-300 rounded mb-2 sm:mb-4 text-xs sm:text-sm md:text-base"
            />
            {errorMessage && (
              <p className="text-red-500 text-xs sm:text-sm mb-2 sm:mb-4">{errorMessage}</p>
            )}
            <div className="popupButtons flex flex-col sm:flex-row justify-between gap-2 p-2 border-t border-gray-200 rounded-b-lg">
              <button
                type="button"
                onClick={handleResetClick}
                className="resetButton bg-gray-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-[#1B1B62] transition-colors text-xs sm:text-sm md:text-base mb-2 sm:mb-0"
              >
                Reset 50/50
              </button>
              <div className="flex gap-2">
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}