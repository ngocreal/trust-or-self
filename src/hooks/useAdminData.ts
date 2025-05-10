import { useState, useEffect } from 'react';
import { Question, Status } from '@/features/trust/types';

// tạo ID ngẫu nhiên 
const generateRandomId = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 5; i++) { // 5 ký tự
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

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
    setErrorMessage(''); 
    try {
      const [questionsRes, statusesRes] = await Promise.all([
        fetch('/api/trust/questions'),
        fetch('/api/trust/status'),
      ]);

      if (!questionsRes.ok) {
        let errorText = `Lỗi khi lấy câu hỏi: ${questionsRes.status} ${questionsRes.statusText}`;
        try {
          const errorData = await questionsRes.json();
          errorText = errorData.error || errorText;
        } catch (e) { }
        throw new Error(errorText);
      }
      if (!statusesRes.ok) {
        let errorText = `Lỗi khi lấy trạng thái: ${statusesRes.status} ${statusesRes.statusText}`;
        try {
          const errorData = await statusesRes.json();
          errorText = errorData.error || errorText;
        } catch (e) { }
        throw new Error(errorText);
      }

      const questionsData = await questionsRes.json();
      const statusesData = await statusesRes.json();

      setQuestions(questionsData.message && typeof questionsData.message === 'string' && questionsData.message.includes('No questions found') ? [] : questionsData);
      setStatuses(statusesData.message && typeof statusesData.message === 'string' && statusesData.message.includes('No statuses found') ? [] : statusesData);

    } catch (error: any) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      setErrorMessage(error.message || 'Có lỗi xảy ra khi tải dữ liệu.');
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
    setErrorMessage(''); 
    try {
      // Tạo ID ngẫu nhiên và gán vào 
      const randomId = generateRandomId();
      const questionWithId = { ...newQuestion, _id: randomId };

      const res = await fetch('/api/trust/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionWithId), // Gửi câu hỏi đã có ID
      });
      if (res.ok) {
        callback();
        fetchData();
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.error || 'Có lỗi xảy ra khi thêm câu hỏi.');
      }
    } catch (error) {
      console.error('Lỗi khi thêm câu hỏi:', error);
      setErrorMessage('Không thể kết nối đến máy chủ khi thêm câu hỏi.');
    }
  };

  const handleEditQuestion = async (editQuestion: Question, callback: () => void) => {
    setErrorMessage('');
    try {
      const res = await fetch(`/api/trust/questions/${editQuestion._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editQuestion),
      });
      if (res.ok) {
        callback();
        setErrorMessage('');
        fetchData();
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.error || 'Có lỗi xảy ra khi sửa câu hỏi.');
      }
    } catch (error) {
      console.error('Lỗi khi sửa câu hỏi:', error);
      setErrorMessage('Không thể kết nối đến máy chủ khi sửa câu hỏi.');
    }
  };

  const handleDeleteQuestion = async (id: string, callback: () => void) => {
    setErrorMessage('');
    try {
      const status = statuses.find((s) => s.question_id === id);
      if (status) {
        const deleteStatusRes = await fetch(`/api/trust/status/${status._id}`, { method: 'DELETE' });
        if (!deleteStatusRes.ok) {
          const errorText = await deleteStatusRes.text();
          console.warn(`Không thể xóa trạng thái cho câu hỏi ${id}:`, errorText);
        }
      }

      const res = await fetch(`/api/trust/questions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        callback();
        fetchData();
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.error || 'Có lỗi xảy ra khi xóa câu hỏi.');
      }
    } catch (error) {
      console.error('Lỗi khi xóa câu hỏi:', error);
      setErrorMessage('Không thể kết nối đến máy chủ khi xóa câu hỏi.');
    }
  };

  const handleEditStatus = async (editStatus: Status, callback: () => void) => {
    setErrorMessage(''); 
    const isValidQuestionId = validateQuestionId(editStatus.question_id);
    if (!isValidQuestionId) {
      setErrorMessage('Question ID không tồn tại. Vui lòng nhập đúng Question ID.');
      return;
    }

    try {
      const existingStatus = statuses.find((s) => s.question_id === editStatus.question_id);
      let res;
      if (existingStatus && existingStatus._id) { 
        res = await fetch(`/api/trust/status/${existingStatus._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editStatus),
        });
      } else {
        // Trường hợp này xảy ra nếu không tìm thấy status cho question_id đó,
        // hoặc nếu existingStatus._id bị undefined (không mong muốn nếu dữ liệu được tải đúng)
        // Đây sẽ là POST để tạo mới status
        res = await fetch('/api/trust/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...editStatus, count_a: 50, count_b: 50 }),
        });
      }

      if (res.ok) {
        callback();
        setErrorMessage('');
        fetchData(); // Tải lại dữ liệu sau khi lưu thành công
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.error || 'Có lỗi xảy ra khi lưu trạng thái.');
      }
    } catch (error) {
      console.error('Lỗi khi lưu trạng thái:', error);
      setErrorMessage('Không thể kết nối đến máy chủ khi lưu trạng thái.');
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