'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaWrench, FaQuestion } from 'react-icons/fa';
import { Question, Status, Result } from '@/features/trust/types';

export default function TrustGamePage() {
  const [showRulesPopup, setShowRulesPopup] = useState(false);
  const [showQuestionPopup, setShowQuestionPopup] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [remainingQuestions, setRemainingQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (gameStarted && questionsLoaded) fetchQuestions();
    else if (gameStarted && !questionsLoaded) setShowRulesPopup(true);
  }, [gameStarted, questionsLoaded]);

  const fetchQuestions = async () => {
    const res = await fetch('/api/trust/questions');
    const data: Question[] = await res.json();
    setQuestions(data);
    setRemainingQuestions(data);
    setCurrentQuestion(data[Math.floor(Math.random() * data.length)]);
  };

  const fetchStatus = async (questionId: string) => {
    const res = await fetch(`/api/trust/status/${questionId}`);
    const data: Status = await res.json();
    setStatus(data);
  };

  const handleChoice = async (option: 'a' | 'b') => {
    if (!currentQuestion || !status) return;

    const updated = { ...status };
    if (option === 'a') updated.count_a++;
    else updated.count_b++;

    await fetch(`/api/trust/status/${currentQuestion._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });

    const total = updated.count_a + updated.count_b;
    const percentage = Math.round(
      (option === 'a' ? updated.count_a : updated.count_b) / total * 100
    );

    setResult({
      percentage,
      choice: option === 'a' ? 'trust' : 'self',
    });
  };

  const handleNextQuestion = () => {
    const newRemaining = remainingQuestions.filter(q => q._id !== currentQuestion?._id);
    setRemainingQuestions(newRemaining);
    setResult(null);
    setStatus(null);
    if (newRemaining.length > 0) {
      setCurrentQuestion(newRemaining[Math.floor(Math.random() * newRemaining.length)]);
    } else {
      setCurrentQuestion(null);
    }
  };

  const handleSettings = () => router.push('/login');

  if (!gameStarted) return (
    <div className="relative w-full h-screen bg-cover bg-center flex flex-col items-center justify-center" style={{ backgroundImage: "url('/splash-background.jpg')" }}>
      <button
        className="absolute bottom-[15%] left-1/2 transform -translate-x-1/2 px-8 py-4 border-3 border-[#1b1b62] rounded-[30px] bg-white text-[#1b1b62] text-[20px] font-bold cursor-pointer transition-colors duration-300 w-[300px] hover:bg-[#feb622] mb-4"
        onClick={() => setGameStarted(true)}
      >
        Bắt đầu
      </button>
      <button
        className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 px-8 py-4 border-none rounded-[30px] bg-[#1b1b62] text-white text-[20px] font-bold cursor-pointer transition-colors duration-300 w-[300px] hover:bg-[#feb622] mb-2"
        onClick={() => setShowRulesPopup(true)}
      >
        Cách chơi
      </button>
      {showRulesPopup && <RulesPopup onClose={() => { setShowRulesPopup(false); setQuestionsLoaded(true); }} />}
      <button className="absolute bottom-5 right-5 text-white text-2xl" onClick={handleSettings}><FaWrench /></button>
    </div>
  );

  if (!currentQuestion) {
    if (remainingQuestions.length === 0) {
      return (
        <div className="h-screen bg-black flex flex-col items-center justify-center text-white">
          <img src="/trust-or-self-logo.png" alt="Logo" className="w-72 mb-10" />
          <h1 className="text-5xl font-bold mb-6">Chúc mừng</h1>
          <p className="text-2xl mb-10">bạn đã hoàn thành trò chơi</p>
          <button
            className="px-12 py-4 bg-[#f5e6cc] text-[#1b1b62] text-[20px] font-bold rounded-full cursor-pointer hover:bg-[#feb622] transition-colors duration-300 w-[300px]"
            onClick={() => window.location.reload()}
          >
            Chơi lại
          </button>
          <button className="absolute bottom-5 right-5 text-white text-2xl" onClick={handleSettings}><FaWrench /></button>
          <button className="absolute top-5 right-5 w-10 h-10 bg-[#1b1b62] rounded-full flex items-center justify-center text-white text-xl hover:bg-[#feb622] transition-colors duration-300" onClick={() => setShowRulesPopup(true)}>
            <FaQuestion />
          </button>
        </div>
      );
    }
    return <Loading text="Đang tải..." onSettings={handleSettings} setShowRulesPopup={setShowRulesPopup} />;
  }

  if (!status) {
    fetchStatus(currentQuestion._id);
    return <Loading text="Đang tải trạng thái..." onSettings={handleSettings} setShowRulesPopup={setShowRulesPopup} />;
  }

  if (result) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-white">
      <img src="/trust-or-self-logo.png" alt="Logo" className="w-72 mb-6" />
      <h1 className="text-4xl font-bold mb-4">{result.percentage}%</h1>
      <p className="text-xl mb-6">người cùng suy nghĩ với bạn</p>
      <img
        src={result.choice === 'trust' ? '/trust-button.png' : '/self-button.png'}
        alt={result.choice}
        className="w-32 h-32 mb-6"
      />
      <img src="/heart-shield.png" alt="Heart Shield" className="w-32 h-32 mb-6" />
      <button
        className="px-8 py-4 border-none rounded-[30px] bg-[#1b1b62] text-white text-[20px] font-bold cursor-pointer transition-colors duration-300 w-[250px] hover:bg-[#feb622]"
        onClick={handleNextQuestion}
      >
        Câu kế tiếp
      </button>
      <button className="absolute bottom-5 right-5 text-white text-2xl" onClick={handleSettings}><FaWrench /></button>
      <button className="absolute top-5 right-5 w-10 h-10 bg-[#1b1b62] rounded-full flex items-center justify-center text-white text-xl hover:bg-[#feb622] transition-colors duration-300" onClick={() => setShowRulesPopup(true)}>
        <FaQuestion />
      </button>
    </div>
  );

  return (
    <div className="relative w-full h-screen bg-black flex flex-col items-center justify-center text-white">
      <img src="/trust-or-self-logo.png" alt="Logo" className="w-72 absolute top-5" />
      <button className="absolute top-5 right-5 w-10 h-10 bg-[#1b1b62] rounded-full flex items-center justify-center text-white text-xl hover:bg-[#feb622] transition-colors duration-300" onClick={() => setShowRulesPopup(true)}>
        <FaQuestion />
      </button>
      <div className="bg-white text-black p-6 rounded-lg mt-44 shadow-lg max-w-xl w-11/12 text-center">
        <p className="text-lg font-semibold mb-6">{currentQuestion.content}</p>
        <div className="flex gap-6 justify-center">
          <button onClick={() => handleChoice('a')}>
            <img src="/trust-button.png" alt="Trust" className="w-32 h-32" />
          </button>
          <button onClick={() => handleChoice('b')}>
            <img src="/self-button.png" alt="Self" className="w-32 h-32" />
          </button>
        </div>
      </div>
      {showRulesPopup && <RulesPopup onClose={() => { setShowRulesPopup(false); setQuestionsLoaded(true); }} />}
      {showQuestionPopup && <QuestionPopup onClose={() => setShowQuestionPopup(false)} />}
      <button className="absolute bottom-5 right-5 text-white text-2xl" onClick={handleSettings}><FaWrench /></button>
    </div>
  );
}

function RulesPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-10 rounded-lg text-center w-[500px] h-[500px] flex flex-col items-center justify-center">
        <p className="text-2xl font-semibold mb-6">Lưu ý: Không có câu trả lời đúng hay sai tuyệt đối. Mỗi lựa chọn phản ánh giá trị cá nhân.</p>
        <button
          className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 px-8 py-4 border-none rounded-[30px] bg-[#1b1b62] text-white text-[20px] font-bold cursor-pointer transition-colors duration-300 w-[250px] hover:bg-[#feb622] mb-2"
          onClick={onClose}
        >
          Tôi đã hiểu
        </button>
      </div>
    </div>
  );
}

function QuestionPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg text-center max-w-xl w-11/12 text-xl relative">
        <p className="mb-4">Lưu ý: Không có câu trả lời đúng hay sai tuyệt đối. Mỗi lựa chọn phản ánh giá trị cá nhân.</p>
        <button
          className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 px-8 py-4 border-none rounded-[30px] bg-[#1b1b62] text-white text-[20px] font-bold cursor-pointer transition-colors duration-300 w-[250px] hover:bg-[#feb622] mb-2"
          onClick={onClose}
        >
          Tôi đã hiểu
        </button>
      </div>
    </div>
  );
}

function Loading({ text, onSettings, setShowRulesPopup }: { text: string; onSettings: () => void; setShowRulesPopup: (value: boolean) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      <p className="text-xl mb-6">{text}</p>
      <button className="absolute bottom-5 right-5 text-white text-2xl" onClick={onSettings}><FaWrench /></button>
      <button className="absolute top-5 right-5 w-10 h-10 bg-[#1b1b62] rounded-full flex items-center justify-center text-white text-xl hover:bg-[#feb622] transition-colors duration-300" onClick={() => setShowRulesPopup(true)}>
        <FaQuestion />
      </button>
    </div>
  );
}