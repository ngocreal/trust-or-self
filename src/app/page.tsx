'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Question, Status, Result } from '@/features/trust/types';
import { fetchQuestions, fetchStatus, updateStatus, createStatus } from '@/features/trust/api';
import { FaRegClock } from 'react-icons/fa';
import RulesPopup from '@/components/game/Rules';
import LoadingScreen from '@/components/game/LoadingScreen';
import StartScreen from '@/components/game/StartScreen';
import ResultScreen from '@/components/game/ResultScreen';
import QuestionScreen from '@/components/game/QuestionScreen';
import FinishScreen from '@/components/game/FinishScreen';

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
  const [showTimerMenu, setShowTimerMenu] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isLastThreeSeconds, setIsLastThreeSeconds] = useState(false);
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);

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

  // Đếm ngược & hiệu ứng 3s cuối
  useEffect(() => {
    if (timerSeconds === null) return;
    setTimeLeft(timerSeconds);
    setIsLastThreeSeconds(false);

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => {
            setTimerSeconds(null);
          }, 3000);
          return 0;
        }
        // Khi còn 3 giây, chớp đỏ và phát âm thanh
        if (prev === 4) {
          setIsLastThreeSeconds(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerSeconds]);

  useEffect(() => {
    if (isLastThreeSeconds && timerSeconds !== null && timeLeft > 0) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
    }
  }, [isLastThreeSeconds, timerSeconds, timeLeft]);

  const handleChoice = async (choice: 'trust' | 'self') => {
    console.log('Bạn đã chọn:', choice);
    if (!currentQuestion || !status) return;

    setShowChoices(false);

    // Reset timer khi chọn 
    setTimerSeconds(null);

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

    setTimeout(() => {
      setResult({ percentage, choice });
    }, 1000);
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
        onStartGame={() => { setGameStarted(true); fetchGameData(); }} 
        onShowRulesPopup={() => setShowRulesPopup(true)}
        onSettings={handleSettings}
        showRulesPopup={showRulesPopup}
        onCloseRulesPopup={() => setShowRulesPopup(false)}
      />
    );
  }

  if (gameStarted && showRulesPopup) {
    return <RulesPopup onClose={() => setShowRulesPopup(false)} />;
  }

  if (gameStarted && !questionsLoaded) {
    return <LoadingScreen text="Đang tải câu hỏi..." onSettings={handleSettings} onShowRules={() => setShowRulesPopup(true)} />;
  }

  if (questionsLoaded && !currentQuestion && remainingQuestions.length === 0) {
    return (
      <FinishScreen
        onReplay={() => window.location.reload()}
        onSettings={handleSettings}
        onShowRules={() => setShowRulesPopup(true)}
      />
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
    <div className="relative w-full h-screen bg-[#686868]">
      <audio ref={audioRef} src="/beep.mp3" preload="auto" />
      {currentQuestion && !result && timerSeconds !== null && (
        <div className={
          `absolute top-70 left-1/2 -translate-x-1/2 px-10 py-4 rounded-xl bg-blue-700 text-white text-6xl font-bold select-none shadow-lg z-50 border-4 border-blue-900
          ${isLastThreeSeconds ? 'animate-pulse text-red-500 bg-red-700 border-red-900' : ''}`
        }>
          {`${String(Math.floor(timeLeft / 60)).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`}
        </div>
      )}

      <div className="absolute bottom-5 right-5 flex flex-col items-end gap-4 z-40">
        <div className="relative">
          <button
            className="w-10 h-10 bg-[#1b1b62] rounded-full flex items-center justify-center text-white text-xl hover:bg-[#feb622] transition-colors duration-300 cursor-pointer"
            onClick={() => setShowTimerMenu(v => !v)}
          >
            <FaRegClock />
          </button>
          {showTimerMenu && (
            <div className="absolute bottom-12 right-0 bg-white rounded-lg shadow-lg flex flex-col z-50">
              {[0.1, 2, 5, 10, 15, 30, 60].map(min => (
                <button
                  key={min}
                  className="px-6 py-2 text-[#1b1b62] hover:bg-[#feb622] hover:text-white font-bold text-lg"
                  onClick={() => {
                    setTimerSeconds(min * 60);
                    setTimeLeft(min * 60);
                    setShowTimerMenu(false);
                  }}
                >
                  {min === 0.1 ? '6s' : `${min}p`}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <QuestionScreen
        currentQuestion={currentQuestion}
        showChoices={showChoices}
        onChoice={handleChoice}
        onShowRules={() => setShowRulesPopup(true)}
      />
    </div>
  );
}