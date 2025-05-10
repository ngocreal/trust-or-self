'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Question, Status, Result } from '@/features/trust/types';
import { fetchQuestions, fetchStatus, updateStatus, createStatus } from '@/features/trust/api';
import { FaWrench, FaQuestion } from 'react-icons/fa';
import RulesPopup from '@/components/game/RulesPopup';
import LoadingScreen from '@/components/game/LoadingScreen';
import StartScreen from '@/components/game/StartScreen';
import ResultScreen from '@/components/game/ResultScreen';
import QuestionScreen from '@/components/game/QuestionScreen';

export default function TrustGamePage() {
  const [showRulesPopup, setShowRulesPopup] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [remainingQuestions, setRemainingQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [showChoices, setShowChoices] = useState(false);
  const router = useRouter();

  const handleSettings = useCallback(() => router.push('/login'), [router]);
  const fetchGameData = useCallback(async () => {
    try {
      const questionsData = await fetchQuestions();

      if (!questionsData || questionsData.length === 0) {
        setRemainingQuestions([]);
        setCurrentQuestion(null);
        setQuestionsLoaded(true);
        return;
      }

      setQuestions(questionsData);
      setRemainingQuestions(questionsData);

      const initialQuestion = questionsData[Math.floor(Math.random() * questionsData.length)];
      setCurrentQuestion(initialQuestion);

      let statusData = await fetchStatus(initialQuestion._id);
      if (!statusData) {
        // Nếu không tìm thấy, tạo mới
        statusData = await createStatus(initialQuestion._id);
        console.log('Tạo trạng thái mới:', statusData);
      }
      setStatus(statusData);
      setQuestionsLoaded(true);

    } catch (error) {
      console.error('Lỗi khi tải dữ liệu trò chơi:', error);
      setQuestionsLoaded(true);
      setRemainingQuestions([]);
      setCurrentQuestion(null);
    }
  }, []);

  useEffect(() => {
    if (gameStarted && !questionsLoaded) {
      setShowRulesPopup(true);
    }
  }, [gameStarted, questionsLoaded]);

  useEffect(() => {
    if (gameStarted && questionsLoaded && !currentQuestion && remainingQuestions.length > 0) {
      const nextQuestion = remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)];
      setCurrentQuestion(nextQuestion);
      const fetchNextQuestionStatus = async () => {
        try {
          let statusData = await fetchStatus(nextQuestion._id);
          if (!statusData) {
            statusData = await createStatus(nextQuestion._id);
          }
          setStatus(statusData);
        } catch (error) {
          console.error('Lỗi khi tải trạng thái cho câu hỏi tiếp theo:', error);
          setStatus(null);
        }
      };
      fetchNextQuestionStatus();
    }

    if (currentQuestion && !result) {
      const timer = setTimeout(() => {
        setShowChoices(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowChoices(false);
    }
  }, [currentQuestion, questionsLoaded, gameStarted, result, remainingQuestions]);

  const handleChoice = async (choice: 'trust' | 'self') => {
    console.log('Bạn đã chọn:', choice);
    if (!currentQuestion || !status) return;

    setShowChoices(false);

    const updatedStatus = { ...status };

    if (choice === 'trust') {
      updatedStatus.count_a += 1;
    } else {
      updatedStatus.count_b += 1;
    }

    try {
      const apiUpdatedStatus = await updateStatus(status._id, {
        count_a: updatedStatus.count_a,
        count_b: updatedStatus.count_b,
      });
      // Cập nhật state với dữ liệu từ API đảm bảo đồng bộ
      setStatus(apiUpdatedStatus);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái trên server:', error);
    }

    const total = updatedStatus.count_a + updatedStatus.count_b;
    const percentage = total === 0
      ? 0
      : Math.round(
          (choice === 'trust' ? updatedStatus.count_a : updatedStatus.count_b) / total * 100
        );

    setResult({
      percentage,
      choice,
    });
  };

  const handleNextQuestion = async () => {
    const newRemaining = remainingQuestions.filter(q => q._id !== currentQuestion?._id);
    setRemainingQuestions(newRemaining);
    setResult(null);
    setStatus(null);
    setShowChoices(false);

    if (newRemaining.length > 0) {
      const nextQuestion = newRemaining[Math.floor(Math.random() * newRemaining.length)];
      setCurrentQuestion(nextQuestion);
      try {
        let statusData = await fetchStatus(nextQuestion._id);
        if (!statusData) {
          statusData = await createStatus(nextQuestion._id);
        }
        setStatus(statusData);
      } catch (error) {
        console.error('Lỗi khi tải trạng thái cho câu hỏi tiếp theo:', error);
        setStatus(null);
      }
    } else {
      setCurrentQuestion(null);
    }
  };

  if (!gameStarted) {
    return (
      <StartScreen
        onStartGame={() => { setGameStarted(true); }}
        onShowRulesPopup={() => setShowRulesPopup(true)}
        onSettings={handleSettings}
        showRulesPopup={showRulesPopup}
        onCloseRulesPopup={() => { setShowRulesPopup(false); fetchGameData(); }}
      />
    );
  }

  if (gameStarted && showRulesPopup) {
    return <RulesPopup onClose={() => { setShowRulesPopup(false); fetchGameData(); }} />;
  }

  if (gameStarted && !questionsLoaded) {
    return <LoadingScreen text="Đang tải câu hỏi và trạng thái..." onSettings={handleSettings} onShowRules={() => setShowRulesPopup(true)} />;
  }

  if (questionsLoaded && !currentQuestion && remainingQuestions.length === 0) {
    return (
      <div className="h-screen bg-[#686868] flex flex-col items-center justify-center text-white">
        <img src="/trust-or-self-logo.png" alt="Logo" className="w-60 mb-15" />
        <h1 className="text-7xl font-bold mb-10">Chúc mừng</h1>
        <p className="text-4xl font-bold mb-10">bạn đã hoàn thành trò chơi</p>
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

  if (result) {
    return (
      <ResultScreen
        result={result}
        onNextQuestion={handleNextQuestion}
        onSettings={handleSettings}
        onShowRules={() => setShowRulesPopup(true)}
      />
    );
  }

  return (
    <QuestionScreen
      currentQuestion={currentQuestion}
      showChoices={showChoices}
      onChoice={handleChoice}
      onShowRules={() => setShowRulesPopup(true)}
    />
  );
}