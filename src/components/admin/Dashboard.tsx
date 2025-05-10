import { Question, Status } from '@/features/trust/types';
import { FaEdit } from 'react-icons/fa';

interface DashboardLayoutProps {
  activeTab: 'questions' | 'status';
  setActiveTab: (tab: 'questions' | 'status') => void;
  questions: Question[];
  statuses: Status[];
  loading: boolean;
  handleEditStatusClick: (status: Status | null, question: Question) => void;
  setEditQuestion: (question: Question | null) => void;
  setShowEditQuestionPopup: (show: boolean) => void;
  setShowDeleteQuestionPopup: (id: string | null) => void;
  setShowAddQuestionPopup: (show: boolean) => void;
  handleLogout: () => void;
  handleProfile: () => void;
}

export default function DashboardLayout({
  activeTab,
  setActiveTab,
  questions,
  statuses,
  loading,
  handleEditStatusClick,
  setEditQuestion,
  setShowEditQuestionPopup,
  setShowDeleteQuestionPopup,
  setShowAddQuestionPopup,
  handleLogout,
  handleProfile,
}: DashboardLayoutProps) {
  return (
    <div className="w-full">
      <div className="header flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="headerButtons flex gap-2 flex-wrap">
          <button
            onClick={handleProfile}
            className="profileButton bg-[#3F99E9] text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-[#1B1B62] transition-colors text-sm sm:text-base"
          >
            Hồ sơ
          </button>
          <button
            onClick={handleLogout}
            className="logoutButton bg-[#3F99E9] text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-[#1B1B62] transition-colors text-sm sm:text-base"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="tabs flex gap-2 mb-4 overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => setActiveTab('questions')}
          className={`tab px-3 py-1 sm:px-4 sm:py-2 rounded text-sm sm:text-base ${
            activeTab === 'questions'
              ? 'bg-[#1B1B62] text-white'
              : 'bg-[#3F99E9] text-white hover:bg-[#1B1B62] transition-colors'
          }`}
        >
          Câu hỏi
        </button>
        <button
          onClick={() => setActiveTab('status')}
          className={`tab px-3 py-1 sm:px-4 sm:py-2 rounded text-sm sm:text-base ${
            activeTab === 'status'
              ? 'bg-[#1B1B62] text-white'
              : 'bg-[#3F99E9] text-white hover:bg-[#1B1B62] transition-colors'
          }`}
        >
          Trạng thái
        </button>
      </div>

      {activeTab === 'questions' && (
        <div className="tableContainer bg-[#F3F4F6] rounded-lg p-2 sm:p-4 mb-4">
          <div className="tableHeader flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Danh sách câu hỏi</h2>
            <button
              onClick={() => setShowAddQuestionPopup(true)}
              className="addButton bg-[#3F99E9] text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-[#1B1B62] flex items-center gap-2 transition-colors text-sm sm:text-base"
            >
              Thêm câu hỏi
            </button>
          </div>
          <div className="tableWrapper overflow-x-auto">
            <table className="table w-full border-collapse bg-[#F3F4F6]">
              <thead>
                <tr className="bg-[#1B1B62] text-white">
                  <th className="border border-gray-200 p-1 sm:p-2 text-xs sm:text-sm md:text-base">STT</th>
                  <th className="border border-gray-200 p-1 sm:p-2 text-xs sm:text-sm md:text-base">Mã câu hỏi</th>
                  <th className="border border-gray-200 p-1 sm:p-2 text-xs sm:text-sm md:text-base">Câu hỏi</th>
                  <th className="border border-gray-200 p-1 sm:p-2 text-xs sm:text-sm md:text-base">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="border border-gray-200 p-1 sm:p-2 text-center text-gray-600 text-xs sm:text-sm md:text-base">
                      Đang tải...
                    </td>
                  </tr>
                ) : questions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="border border-gray-200 p-1 sm:p-2 text-center text-gray-600 text-xs sm:text-sm md:text-base">
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  questions.map((q, index) => (
                    <tr key={q._id} className="border border-gray-200 hover:bg-gray-100 transition-colors">
                      <td className="border border-gray-200 p-1 sm:p-2 text-xs sm:text-sm md:text-base">{index + 1}</td>
                      <td className="border border-gray-200 p-1 sm:p-2 text-xs sm:text-sm md:text-base">{q._id}</td>
                      <td className="border border-gray-200 p-1 sm:p-2 text-xs sm:text-sm md:text-base">{q.content}</td>
                      <td className="actionCell border border-gray-200 p-1 sm:p-2 flex gap-1 sm:gap-2 flex-wrap">
                        <button
                          onClick={() => {
                            setEditQuestion(q);
                            setShowEditQuestionPopup(true);
                          }}
                          className="editButton bg-[#F5C035] text-white px-2 py-1 rounded hover:bg-[#1B1B62] transition-colors text-xs sm:text-sm"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => setShowDeleteQuestionPopup(q._id)}
                          className="deleteButton bg-[#EF6921] text-white px-2 py-1 rounded hover:bg-[#1B1B62] transition-colors text-xs sm:text-sm"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'status' && (
        <div className="tableContainer bg-[#F3F4F6] rounded-lg p-2 sm:p-4 mb-4">
          <div className="tableHeader flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">Danh sách trạng thái</h2>
          </div>
          <div className="tableWrapper overflow-x-auto">
            <table className="table w-full border-collapse bg-[#F3F4F6]">
              <thead>
                <tr className="bg-[#1B1B62] text-white">
                  <th className="border border-gray-200 p-1 sm:p-2 text-xs sm:text-sm md:text-base">STT</th>
                  <th className="border border-gray-200 p-1 sm:p-2 text-xs sm:text-sm md:text-base">Mã trạng thái</th>
                  <th className="border border-gray-200 p-1 sm:p-2 text-xs sm:text-sm md:text-base">Mã câu hỏi</th>
                  <th className="border border-gray-200 p-1 sm:p-2 text-xs sm:text-sm md:text-base">Trust</th>
                  <th className="border border-gray-200 p-1 sm:p-2 text-xs sm:text-sm md:text-base">Self</th>
                  <th className="border border-gray-200 p-1 sm:p-2 text-xs sm:text-sm md:text-base">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="border border-gray-200 p-1 sm:p-2 text-center text-gray-600 text-xs sm:text-sm md:text-base">
                      Đang tải...
                    </td>
                  </tr>
                ) : questions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="border border-gray-200 p-1 sm:p-2 text-center text-gray-600 text-xs sm:text-sm md:text-base">
                      Không có câu hỏi
                    </td>
                  </tr>
                ) : (
                  questions.map((q, index) => {
                    const status = statuses.find((s) => s.question_id === q._id);
                    return (
                      <tr key={q._id} className="border border-gray-200 hover:bg-gray-100 transition-colors">
                        <td className="border border-gray-200 p-1 sm:p-2 text-xs sm:text-sm md:text-base">{index + 1}</td>
                        <td className="border border-gray-200 p-1 sm:p-2 text-xs sm:text-sm md:text-base">{status ? status._id : '-'}</td>
                        <td className="border border-gray-200 p-1 sm:p-2 text-xs sm:text-sm md:text-base">{q._id}</td>
                        <td className="border border-gray-200 p-1 sm:p-2 text-xs sm:text-sm md:text-base">{status ? status.count_a : 50}</td>
                        <td className="border border-gray-200 p-1 sm:p-2 text-xs sm:text-sm md:text-base">{status ? status.count_b : 50}</td>
                        <td className="actionCell border border-gray-200 p-1 sm:p-2">
                          <button
                            onClick={() => handleEditStatusClick(status || null, q)}
                            className="editButton bg-[#F5C035] text-white px-2 py-1 rounded hover:bg-[#1B1B62] flex items-center gap-1 transition-colors text-xs sm:text-sm"
                          >
                            <FaEdit /> Sửa
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}