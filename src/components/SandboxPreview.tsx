import React, { useState } from 'react';
import { SAMPLE_SANDBOX_QUESTIONS } from '../data/sandboxData';
import confetti from 'canvas-confetti';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Code, 
  HelpCircle,
  Clock,
  BookOpen,
  ArrowRight,
  Flame
} from 'lucide-react';

interface SandboxPreviewProps {
  onNextStep?: () => void;
}

export const SandboxPreview: React.FC<SandboxPreviewProps> = ({ onNextStep }) => {
  const [gameState, setGameState] = useState<'welcome' | 'instructions' | 'playing' | 'completed'>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showCodeGuide, setShowCodeGuide] = useState<boolean>(false);

  const currentQ = SAMPLE_SANDBOX_QUESTIONS[currentQuestionIndex];
  const totalQuestions = SAMPLE_SANDBOX_QUESTIONS.length;

  const handleStartGame = () => {
    setGameState('instructions');
  };

  const playSound = (type: 'correct' | 'wrong' | 'win') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'wrong') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(164.81, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'win') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.24);
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.36);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch {
      // Ignore audio context errors
    }
  };

  const handleBeginTimeline = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setStreak(0);
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null) return; // Prevent multi click

    setSelectedOption(optionIndex);
    const isCorrect = optionIndex === currentQ.correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 20 + streak * 5);
      setStreak(prev => prev + 1);
      playSound('correct');
    } else {
      setStreak(0);
      playSound('wrong');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setGameState('completed');
      playSound('win');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestartGame = () => {
    setGameState('welcome');
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-purple-900 to-slate-900 border border-purple-800/40 rounded-3xl p-5 sm:p-6 shadow-md text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-orange-500 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                Mô phỏng Webapp
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Sandbox Xem Thử Trải Nghiệm Mini Webapp
              </h2>
            </div>
            <p className="text-sm text-purple-100 max-w-3xl">
              Đây là mô hình Mini Webapp Dòng Thời Gian thực tế mà Google AI Studio sẽ tạo ra khi thầy cô nạp Master Prompt. Hãy trải nghiệm trực tiếp giao diện, tương tác và cách hiển thị điểm số.
            </p>
          </div>

          <button
            onClick={() => setShowCodeGuide(!showCodeGuide)}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm border ${
              showCodeGuide
                ? 'bg-orange-500 text-white border-orange-400'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
          >
            <Code className="w-4 h-4 text-orange-300" />
            <span>{showCodeGuide ? 'Ẩn hướng dẫn sửa code' : 'Xem vùng giáo viên sửa code'}</span>
          </button>
        </div>
      </div>

      {/* Teacher Code Annotation Section (Optional toggle) */}
      {showCodeGuide && (
        <div className="bg-gray-900 text-gray-100 rounded-2xl p-5 border border-gray-800 space-y-3 font-mono text-xs shadow-md">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <span className="text-amber-300 font-bold flex items-center gap-2">
              <Code className="w-4 h-4" />
              VÙNG CHÚ THÍCH GIÁO VIÊN CÓ THỂ CHỈNH SỬA TRONG CODE (Mảng Questions)
            </span>
            <span className="text-[10px] text-gray-400">Trích đoạn JavaScript trong Google AI Studio</span>
          </div>

          <pre className="text-emerald-300 whitespace-pre-wrap overflow-x-auto text-[11px] leading-relaxed">
{`// ===========================================================================
// [GIÁO VIÊN SỬA NỘI DUNG CÂU HỎI TẠI ĐÂY]
// ===========================================================================
const questions = [
  {
    id: 1,
    yearOrEvent: "Năm 1764", // <--- Giáo viên sửa mốc thời gian
    question: "Phát minh nào khởi đầu công nghiệp dệt?", // <--- Sửa nội dung câu hỏi
    options: [
      "Máy kéo sợi Jenny", // <--- Sửa đáp án 0
      "Động cơ hơi nước", // <--- Sửa đáp án 1
      "Đầu máy xe lửa",    // <--- Sửa đáp án 2
      "Tàu thủy hơi nước"  // <--- Sửa đáp án 3
    ],
    correctAnswer: 0, // <--- Chỉ số đáp án đúng (0, 1, 2, 3)
    explanation: "James Hargreaves sáng chế máy kéo sợi Jenny năm 1764."
  }
];`}
          </pre>
          <p className="text-[11px] text-gray-400 font-sans italic">
            💡 Thầy cô chỉ cần thay đổi nội dung chữ trong ngoặc kép <code>"..."</code> mà không cần sửa cấu trúc hàm JavaScript!
          </p>
        </div>
      )}

      {/* Main Sandbox Player Canvas */}
      <div className="max-w-3xl mx-auto bg-white border-2 border-indigo-900/30 rounded-3xl shadow-xl overflow-hidden min-h-[480px] flex flex-col justify-between relative">
        {/* Top Control Bar of Mini Webapp */}
        <div className="bg-gradient-to-r from-indigo-950 via-purple-900 to-slate-900 text-white px-5 py-3 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="font-bold">Mini Webapp Dòng thời gian</span>
            <span className="text-purple-200 hidden sm:inline">• Lịch sử Lớp 10</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 rounded hover:bg-white/10 transition-colors text-purple-100"
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-orange-300" /> : <VolumeX className="w-4 h-4 text-gray-300" />}
            </button>
            <button
              onClick={handleRestartGame}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-all flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Chơi lại</span>
            </button>
          </div>
        </div>

        {/* Screen 1: Welcome Screen */}
        {gameState === 'welcome' && (
          <div className="p-8 sm:p-12 text-center space-y-6 flex-1 flex flex-col justify-center items-center">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto shadow-inner border border-orange-100">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-lg">
              <span className="bg-purple-100 text-purple-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Lịch sử Lớp 10 • THCS & THPT FPT Bắc Giang
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Hành trình các cuộc cách mạng công nghiệp
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Khám phá bối cảnh, mốc thời gian và các phát minh vĩ đại đã làm thay đổi nền văn minh nhân loại qua 5 thử thách dòng thời gian tương tác.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleStartGame}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-lg hover:shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 mx-auto"
              >
                <span>Bắt đầu hành trình</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Screen 2: Instructions Screen */}
        {gameState === 'instructions' && (
          <div className="p-8 text-center space-y-6 flex-1 flex flex-col justify-center max-w-lg mx-auto">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Hướng Dẫn Trải Nghiệm</h2>
              <p className="text-xs text-slate-500">2 - 4 bước thực hiện nhanh để hoàn thành thử thách</p>
            </div>

            <div className="space-y-3 text-left text-xs">
              <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-100 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <strong className="text-slate-900 block font-bold">Quan sát mốc thời gian:</strong>
                  <span className="text-slate-600">Mỗi thử thách tương ứng với một mốc sự kiện lịch sử quan trọng.</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-100 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <strong className="text-slate-900 block font-bold">Lựa chọn phát minh / sự kiện đúng:</strong>
                  <span className="text-slate-600">Chọn 1 trong 4 đáp án bên dưới. Trả lời đúng liên tiếp để tăng chuỗi Streak thưởng!</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-purple-50/80 border border-purple-100 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <div>
                  <strong className="text-slate-900 block font-bold">Đọc giải thích & Tích lũy điểm:</strong>
                  <span className="text-slate-600">Xem phản hồi chi tiết sau mỗi câu hỏi để ghi nhớ kiến thức sâu sắc.</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleBeginTimeline}
              className="w-full py-3 rounded-2xl bg-indigo-900 hover:bg-slate-900 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Đã Hiểu, Sẵn Sàng Chơi</span>
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        )}

        {/* Screen 3: Playing Timeline Activity */}
        {gameState === 'playing' && (
          <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
            {/* Top Stats & Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                <span className="text-[#0052CC]">Câu {currentQuestionIndex + 1} / {totalQuestions}</span>
                <div className="flex items-center gap-4">
                  {streak > 1 && (
                    <span className="text-amber-600 font-bold flex items-center gap-1 animate-bounce">
                      <Flame className="w-4 h-4 fill-amber-500" />
                      Streak x{streak}
                    </span>
                  )}
                  <span className="bg-blue-100 text-[#0052CC] px-2.5 py-0.5 rounded-full font-extrabold">
                    Điểm: {score}
                  </span>
                </div>
              </div>

              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#0052CC] to-[#0A66C2] transition-all duration-300 rounded-full"
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Timeline Year Badge & Question */}
            <div className="space-y-4 text-center my-auto py-2">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-950 border border-amber-300 font-bold text-xs px-3 py-1 rounded-full shadow-xs">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Mốc Lịch Sử: {currentQ.yearOrEvent}</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                {currentQ.question}
              </h3>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
                {currentQ.options.map((opt, optIndex) => {
                  const isSelected = selectedOption === optIndex;
                  const isCorrect = optIndex === currentQ.correctAnswer;

                  let optionStyle = "bg-white hover:bg-blue-50/60 border-gray-200 text-gray-800 hover:border-blue-300";

                  if (selectedOption !== null) {
                    if (isCorrect) {
                      optionStyle = "bg-emerald-100 border-emerald-400 text-emerald-950 font-bold shadow-sm";
                    } else if (isSelected) {
                      optionStyle = "bg-red-100 border-red-300 text-red-950 font-medium";
                    } else {
                      optionStyle = "bg-gray-50 border-gray-200 text-gray-400 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={optIndex}
                      disabled={selectedOption !== null}
                      onClick={() => handleOptionSelect(optIndex)}
                      className={`p-3.5 rounded-2xl border text-xs transition-all flex items-start gap-2.5 ${optionStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full bg-gray-200/80 text-gray-700 font-bold flex items-center justify-center shrink-0 text-[11px] mt-0.5">
                        {String.fromCharCode(65 + optIndex)}
                      </span>
                      <span className="flex-1 font-medium">{opt}</span>
                      {selectedOption !== null && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {selectedOption !== null && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Explanation */}
              {selectedOption !== null && (
                <div className={`p-4 rounded-2xl text-xs text-left animate-fadeIn space-y-1 ${
                  selectedOption === currentQ.correctAnswer
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border border-amber-200 text-amber-950'
                }`}>
                  <strong className="block font-bold">
                    {selectedOption === currentQ.correctAnswer ? '🎉 Chính xác!' : '💡 Giải thích đáp án:'}
                  </strong>
                  <span>{currentQ.explanation}</span>
                </div>
              )}
            </div>

            {/* Next Button Footer */}
            {selectedOption !== null && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-[#0052CC] hover:bg-[#0A66C2] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>{currentQuestionIndex < totalQuestions - 1 ? 'Câu tiếp theo' : 'Xem Kết Quả'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Screen 4: Completed Screen */}
        {gameState === 'completed' && (
          <div className="p-8 text-center space-y-6 flex-1 flex flex-col justify-center items-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner border-2 border-amber-300">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-gray-900">
                Chúc Mừng Bạn Đã Hoàn Thành!
              </h2>
              <p className="text-xs text-gray-600">
                Lớp 10 • Bài: Các Cuộc Cách Mạng Công Nghiệp
              </p>
            </div>

            {/* Score Metrics */}
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 max-w-sm w-full space-y-3">
              <div className="text-3xl font-black text-[#0052CC]">
                {score} <span className="text-sm font-normal text-gray-500">Điểm</span>
              </div>
              <div className="text-xs font-semibold text-gray-700 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Hoàn thành 5/5 thử thách dòng thời gian</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRestartGame}
                className="px-6 py-3 rounded-xl bg-[#0052CC] hover:bg-[#0A66C2] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Thử Lại Từ Đầu</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Webapp Disclaimer & Next Step Action */}
        <div className="bg-gray-50 border-t border-gray-100 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600 font-medium">
          <span>Mô phỏng giao diện webapp tạo bởi Google AI Studio • Chạy Client-side 100%</span>
          {onNextStep && (
            <button
              onClick={onNextStep}
              className="px-4 py-2 rounded-xl bg-[#0052CC] hover:bg-[#0A66C2] text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
            >
              <span>Chuyển sang Bước 2: Khóa Học Tập Huấn</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
