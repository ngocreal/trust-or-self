'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QuestionsModel from '@/models/Questions';
import StatusModel from '@/models/Status';
import { Question, Status } from '@/features/trust/types';

export default function AdminDashboard() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({ _id: '', content: '', option_a: '', option_b: '' });
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [newStatus, setNewStatus] = useState<Partial<Status>>({ _id: '', question_id: '', count_a: 0, count_b: 0 });
  const [editStatus, setEditStatus] = useState<Status | null>(null);

  useEffect(() => {
    fetchQuestions();
    fetchStatuses();
  }, []);

  const fetchQuestions = async () => {
    const res = await fetch('/api/questions');
    const data = await res.json();
    setQuestions(data);
  };

  const fetchStatuses = async () => {
    const res = await fetch('/api/status');
    const data = await res.json();
    setStatuses(data);
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuestion),
    });
    if (res.ok) {
      setNewQuestion({ _id: '', content: '', option_a: '', option_b: '' });
      fetchQuestions();
    }
  };

  const handleEditQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editQuestion) {
      const res = await fetch(`/api/questions/${editQuestion._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editQuestion),
      });
      if (res.ok) {
        setEditQuestion(null);
        fetchQuestions();
      }
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    const res = await fetch(`/api/questions/${id}`, { method: 'DELETE' });
    if (res.ok) fetchQuestions();
  };

  const handleAddStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStatus),
    });
    if (res.ok) {
      setNewStatus({ _id: '', question_id: '', count_a: 0, count_b: 0 });
      fetchStatuses();
    }
  };

  const handleEditStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editStatus) {
      const res = await fetch(`/api/status/${editStatus._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editStatus),
      });
      if (res.ok) {
        setEditStatus(null);
        fetchStatuses();
      }
    }
  };

  const handleDeleteStatus = async (id: string) => {
    const res = await fetch(`/api/status/${id}`, { method: 'DELETE' });
    if (res.ok) fetchStatuses();
  };

  const handleLogout = () => {
    router.push('/login');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div>
          <button onClick={handleProfile} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Hồ sơ</button>
          <button onClick={handleLogout} className="bg-blue-500 text-white px-4 py-2 rounded">Đăng xuất</button>
        </div>
      </div>

      <button
        onClick={() => { fetchQuestions(); fetchStatuses(); }}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Làm mới
      </button>
      <button
        onClick={() => {/* Add export logic if needed */}}
        className="bg-blue-500 text-white px-4 py-2 rounded ml-2 mb-4"
      >
        Xuất dữ liệu
      </button>

      <h2 className="text-lg font-semibold mb-2">Danh sách câu hỏi</h2>
      <form onSubmit={handleAddQuestion} className="mb-4">
        <input
          type="text"
          value={newQuestion._id || ''}
          onChange={(e) => setNewQuestion({ ...newQuestion, _id: e.target.value })}
          placeholder="Question ID"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          value={newQuestion.content || ''}
          onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
          placeholder="Nội dung câu hỏi"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          value={newQuestion.option_a || ''}
          onChange={(e) => setNewQuestion({ ...newQuestion, option_a: e.target.value })}
          placeholder="Option A"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          value={newQuestion.option_b || ''}
          onChange={(e) => setNewQuestion({ ...newQuestion, option_b: e.target.value })}
          placeholder="Option B"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Thêm câu hỏi</button>
      </form>
      <table className="w-full border-collapse mb-6">
        <thead>
          <tr className="bg-indigo-900 text-white">
            <th className="border p-2">STT</th>
            <th className="border p-2">Question ID</th>
            <th className="border p-2">Trust</th>
            <th className="border p-2">Self</th>
            <th className="border p-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, index) => (
            <tr key={q._id} className="border">
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{q._id}</td>
              <td className="border p-2">
                {editQuestion?._id === q._id ? (
                  <input
                    type="text"
                    value={editQuestion.option_a}
                    onChange={(e) => setEditQuestion({ ...editQuestion, option_a: e.target.value })}
                    className="border p-1"
                  />
                ) : q.option_a}
              </td>
              <td className="border p-2">
                {editQuestion?._id === q._id ? (
                  <input
                    type="text"
                    value={editQuestion.option_b}
                    onChange={(e) => setEditQuestion({ ...editQuestion, option_b: e.target.value })}
                    className="border p-1"
                  />
                ) : q.option_b}
              </td>
              <td className="border p-2">
                {editQuestion?._id === q._id ? (
                  <button
                    onClick={handleEditQuestion}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Lưu
                  </button>
                ) : (
                  <button
                    onClick={() => setEditQuestion({ ...q })}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Sửa
                  </button>
                )}
                <button
                  onClick={() => handleDeleteQuestion(q._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-lg font-semibold mb-2">Danh sách trạng thái</h2>
      <form onSubmit={handleAddStatus} className="mb-4">
        <input
          type="text"
          value={newStatus._id || ''}
          onChange={(e) => setNewStatus({ ...newStatus, _id: e.target.value })}
          placeholder="Status ID"
          className="border p-2 mr-2"
        />
        <input
          type="text"
          value={newStatus.question_id || ''}
          onChange={(e) => setNewStatus({ ...newStatus, question_id: e.target.value })}
          placeholder="Question ID"
          className="border p-2 mr-2"
        />
        <input
          type="number"
          value={newStatus.count_a || 0}
          onChange={(e) => setNewStatus({ ...newStatus, count_a: parseInt(e.target.value) })}
          placeholder="Count A"
          className="border p-2 mr-2"
        />
        <input
          type="number"
          value={newStatus.count_b || 0}
          onChange={(e) => setNewStatus({ ...newStatus, count_b: parseInt(e.target.value) })}
          placeholder="Count B"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Thêm trạng thái</button>
      </form>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-indigo-900 text-white">
            <th className="border p-2">STT</th>
            <th className="border p-2">Status ID</th>
            <th className="border p-2">Question ID</th>
            <th className="border p-2">Trust</th>
            <th className="border p-2">Self</th>
            <th className="border p-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {statuses.map((s, index) => (
            <tr key={s._id} className="border">
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{s._id}</td>
              <td className="border p-2">{s.question_id}</td>
              <td className="border p-2">
                {editStatus?._id === s._id ? (
                  <input
                    type="number"
                    value={editStatus.count_a}
                    onChange={(e) => setEditStatus({ ...editStatus, count_a: parseInt(e.target.value) })}
                    className="border p-1"
                  />
                ) : s.count_a}
              </td>
              <td className="border p-2">
                {editStatus?._id === s._id ? (
                  <input
                    type="number"
                    value={editStatus.count_b}
                    onChange={(e) => setEditStatus({ ...editStatus, count_b: parseInt(e.target.value) })}
                    className="border p-1"
                  />
                ) : s.count_b}
              </td>
              <td className="border p-2">
                {editStatus?._id === s._id ? (
                  <button
                    onClick={handleEditStatus}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Lưu
                  </button>
                ) : (
                  <button
                    onClick={() => setEditStatus({ ...s })}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Sửa
                  </button>
                )}
                <button
                  onClick={() => handleDeleteStatus(s._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}