import { Question, Status } from './types';

const BASE_URL = '/api/trust';

export const fetchQuestions = async (): Promise<Question[]> => {
  const res = await fetch(`${BASE_URL}/questions`);
  if (!res.ok) {
    throw new Error(`Failed to fetch questions: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

export const fetchStatus = async (questionId: string): Promise<Status | null> => {
  const res = await fetch(`${BASE_URL}/status/${questionId}`);
  if (res.ok) {
    return res.json();
  }
  console.warn(`Status for question ${questionId} not found. Returning default.`);
  return null; // Hoặc trả về một status mặc định {count_a: 50, count_b: 50 }
};

export const updateStatus = async (statusId: string, updatedStatus: Partial<Status>): Promise<Status> => {
  const res = await fetch(`${BASE_URL}/status/${statusId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedStatus),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(`Failed to update status: ${errorData.error || res.statusText}`);
  }
  return res.json();
};

export const createStatus = async (questionId: string): Promise<Status> => {
  const res = await fetch(`${BASE_URL}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question_id: questionId, count_a: 50, count_b: 50 }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    if (res.status === 409) {
      return fetchStatus(questionId) as Promise<Status>;
    }
    throw new Error(`Failed to create status: ${errorData.error || res.statusText}`);
  }
  return res.json();
};