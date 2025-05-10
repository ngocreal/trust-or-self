import { useState, useEffect } from 'react';
import { Question, Status } from '@/features/trust/types';

export const useAdminData = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [questionsRes, statusesRes] = await Promise.all([
        fetch('/api/questions'),
        fetch('/api/status'),
      ]);
      const questionsData = await questionsRes.json();
      const statusesData = await statusesRes.json();
      setQuestions(questionsData.message ? [] : questionsData);
      setStatuses(statusesData.message ? [] : statusesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setQuestions([]);
      setStatuses([]);
    } finally {
      setLoading(false);
    }
  };

  const validateQuestionId = (questionId: string): boolean => {
    return questions.some((q) => q._id === questionId);
  };

  const handleAddQuestion = async (newQuestion: Partial<Question>, callback: () => void) => {
    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuestion),
    });
    if (res.ok) {
      callback();
      fetchData();
    } else {
      setErrorMessage('Có lỗi xảy ra khi thêm câu hỏi.');
    }
  };

  const handleEditQuestion = async (editQuestion: Question, callback: () => void) => {
    const res = await fetch(`/api/questions/${editQuestion._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editQuestion),
    });
    if (res.ok) {
      callback();
      setErrorMessage('');
      fetchData();
    } else {
      setErrorMessage('Có lỗi xảy ra khi sửa câu hỏi.');
    }
  };

  const handleDeleteQuestion = async (id: string, callback: () => void) => {
    const status = statuses.find((s) => s.question_id === id);
    if (status) {
      await fetch(`/api/status/${status._id}`, { method: 'DELETE' });
    }

    const res = await fetch(`/api/questions/${id}`, { method: 'DELETE' });
    if (res.ok) {
      callback();
      fetchData();
    }
  };

  const handleEditStatus = async (editStatus: Status, callback: () => void) => {
    const isValidQuestionId = validateQuestionId(editStatus.question_id);
    if (!isValidQuestionId) {
      setErrorMessage('Question ID không tồn tại. Vui lòng nhập đúng Question ID.');
      return;
    }

    try {
      const existingStatus = statuses.find((s) => s.question_id === editStatus.question_id);
      let res;
      if (existingStatus) {
        res = await fetch(`/api/status/${existingStatus._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editStatus),
        });
      } else {
        res = await fetch('/api/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...editStatus, count_a: 50, count_b: 50 }),
        });
      }

      if (res.ok) {
        callback();
        setErrorMessage('');
        fetchData();
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.error || 'Có lỗi xảy ra khi lưu trạng thái.');
      }
    } catch (error) {
      console.error('Error saving status:', error);
      setErrorMessage('Có lỗi xảy ra khi lưu trạng thái.');
    }
  };

  const handleResetStatus = (status: Status): Status => {
    return { ...status, count_a: 50, count_b: 50 };
  };

  return {
    questions,
    statuses,
    loading,
    errorMessage,
    setErrorMessage,
    fetchData,
    validateQuestionId,
    handleAddQuestion,
    handleEditQuestion,
    handleDeleteQuestion,
    handleEditStatus,
    handleResetStatus,
  };
};