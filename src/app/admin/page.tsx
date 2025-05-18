'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Question, Status } from '@/features/trust/types';
import { useAdminData } from '@/hooks/useAdminData';
import Dashboard from '@/components/admin/Dashboard';
import AddQuestion from '@/components/admin/AddQuestion';
import EditQuestion from '@/components/admin/EditQuestion';
import DeleteQuestion from '@/components/admin/DeleteQuestion';
import EditStatus from '@/components/admin/EditStatus';
import ProfilePopup from '@/components/admin/ProfilePopup';

export default function AdminDashboard() {
  const router = useRouter();
  const {
    questions,
    statuses,
    loading,
    errorMessage,
    setErrorMessage,
    handleAddQuestion,
    handleEditQuestion,
    handleDeleteQuestion,
    handleEditStatus,
    handleResetStatus,
  } = useAdminData();

  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [editStatus, setEditStatus] = useState<Status | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({ _id: '', content: '' });
  const [showAddQuestionPopup, setShowAddQuestionPopup] = useState(false);
  const [showEditQuestionPopup, setShowEditQuestionPopup] = useState(false);
  const [showDeleteQuestionPopup, setShowDeleteQuestionPopup] = useState<string | null>(null);
  const [showEditStatusPopup, setShowEditStatusPopup] = useState(false);
  const [activeTab, setActiveTab] = useState<'questions' | 'status'>('questions');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
    }
  }, [router]);

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
    localStorage.removeItem('token');
    router.push('/');
  };

  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [profileMode, setProfileMode] = useState<'view' | 'edit-username' | 'edit-password'>('view');
  const [profileUsername, setProfileUsername] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [profileError, setProfileError] = useState('');

  const handleProfile = () => {
    setProfileUsername(localStorage.getItem('username') || '');
    setShowProfilePopup(true);
    setProfileMode('view');
    setProfileError('');
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 font-sans bg-[#F3F4F6] min-h-screen flex flex-col !important">
      <Dashboard
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

      {showAddQuestionPopup && (
        <AddQuestion
          newQuestion={newQuestion}
          setNewQuestion={setNewQuestion}
          errorMessage={errorMessage}
          onClose={() => setShowAddQuestionPopup(false)}
          onSave={(newQuestion: Partial<Question>) =>
            handleAddQuestion(newQuestion, () => {
              setNewQuestion({ _id: '', content: '' });
              setShowAddQuestionPopup(false);
            })
          }
        />
      )}

      {showEditQuestionPopup && editQuestion && (
        <EditQuestion
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

      {showDeleteQuestionPopup && (
        <DeleteQuestion
          onClose={() => setShowDeleteQuestionPopup(null)}
          onConfirm={() =>
            handleDeleteQuestion(showDeleteQuestionPopup, () => setShowDeleteQuestionPopup(null))
          }
        />
      )}

      {showEditStatusPopup && editStatus && (
        <EditStatus
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

      <ProfilePopup
        show={showProfilePopup}
        onClose={() => setShowProfilePopup(false)}
        profileMode={profileMode}
        setProfileMode={setProfileMode}
        profileUsername={profileUsername}
        setProfileUsername={setProfileUsername}
        newUsername={newUsername}
        setNewUsername={setNewUsername}
        profilePassword={profilePassword}
        setProfilePassword={setProfilePassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        profileError={profileError}
        setProfileError={setProfileError}
      />
    </div>
  );
}