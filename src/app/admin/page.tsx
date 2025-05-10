'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Question, Status } from '@/features/trust/types';
import { useAdminData } from '@/hooks/useAdminData';
import DashboardLayout from '@/components/admin/Dashboard';
import AddQuestionPopup from '@/components/admin/AddQuestionPopup';
import EditQuestionPopup from '@/components/admin/EditQuestionPopup';
import DeleteQuestionPopup from '@/components/admin/DeleteQuestionPopup';
import EditStatusPopup from '@/components/admin/EditStatusPopup';

export default function AdminDashboard() {
  const router = useRouter();
  const {
    questions,
    statuses,
    loading,
    errorMessage,
    setErrorMessage,
    fetchData,
    handleAddQuestion,
    handleEditQuestion,
    handleDeleteQuestion,
    handleEditStatus,
    handleResetStatus,
  } = useAdminData();

  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [editStatus, setEditStatus] = useState<Status | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({ _id: '', content: ''});
  const [showAddQuestionPopup, setShowAddQuestionPopup] = useState(false);
  const [showEditQuestionPopup, setShowEditQuestionPopup] = useState(false);
  const [showDeleteQuestionPopup, setShowDeleteQuestionPopup] = useState<string | null>(null);
  const [showEditStatusPopup, setShowEditStatusPopup] = useState(false);
  const [activeTab, setActiveTab] = useState<'questions' | 'status'>('questions');

  const handleEditStatusClick = (status: Status | null, question: Question) => {
    if (status) {
      setEditStatus(status);
    } else {
      setEditStatus({
        _id: '',
        question_id: question._id,
        count_a: 50,
        count_b: 50,
      });
    }
    setShowEditStatusPopup(true);
    setErrorMessage('');
  };

  const handleLogout = () => {
    router.push('/login');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 font-sans bg-[#F3F4F6] min-h-screen flex flex-col !important">
      <DashboardLayout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        questions={questions}
        statuses={statuses}
        loading={loading}
        handleEditStatusClick={handleEditStatusClick}
        setEditQuestion={setEditQuestion}
        setShowEditQuestionPopup={setShowEditQuestionPopup}
        setShowDeleteQuestionPopup={setShowDeleteQuestionPopup}
        setShowAddQuestionPopup={setShowAddQuestionPopup}
        handleLogout={handleLogout}
        handleProfile={handleProfile}
      />

      {/* Add Question Popup */}
      {showAddQuestionPopup && (
        <AddQuestionPopup
          newQuestion={newQuestion}
          setNewQuestion={setNewQuestion}
          errorMessage={errorMessage}
          onClose={() => setShowAddQuestionPopup(false)}
          onSave={(newQuestion: Partial<Question>) =>
            handleAddQuestion(newQuestion, () => {
              setNewQuestion({ _id: '', content: ''});
              setShowAddQuestionPopup(false);
            })
          }
        />
      )}

      {/* Edit Question Popup */}
      {showEditQuestionPopup && editQuestion && (
        <EditQuestionPopup
          editQuestion={editQuestion}
          setEditQuestion={setEditQuestion}
          errorMessage={errorMessage}
          onClose={() => {
            setShowEditQuestionPopup(false);
            setEditQuestion(null);
          }}
          onSave={(editQuestion: Question) =>
            handleEditQuestion(editQuestion, () => {
              setEditQuestion(null);
              setShowEditQuestionPopup(false);
            })
          }
        />
      )}

      {/* Delete Question Popup */}
      {showDeleteQuestionPopup && (
        <DeleteQuestionPopup
          onClose={() => setShowDeleteQuestionPopup(null)}
          onConfirm={() =>
            handleDeleteQuestion(showDeleteQuestionPopup, () => setShowDeleteQuestionPopup(null))
          }
        />
      )}

      {/* Edit Status Popup */}
      {showEditStatusPopup && editStatus && (
        <EditStatusPopup
          editStatus={editStatus}
          setEditStatus={setEditStatus}
          errorMessage={errorMessage}
          onClose={() => {
            setShowEditStatusPopup(false);
            setEditStatus(null);
            setErrorMessage('');
          }}
          onSave={(editStatus: Status) =>
            handleEditStatus(editStatus, () => {
              setEditStatus(null);
              setShowEditStatusPopup(false);
            })
          }
          onReset={handleResetStatus}
        />
      )}
    </div>
  );
}