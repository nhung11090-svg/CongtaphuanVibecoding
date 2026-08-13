import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { COURSE_MODULES } from '../data/courseData';
import { CourseModule, Lesson, QuizQuestion } from '../types';
import { FptLogo } from './FptLogo';
import confetti from 'canvas-confetti';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Award, 
  ChevronRight, 
  Copy, 
  Check, 
  HelpCircle,
  Clock,
  Printer,
  GraduationCap,
  ShieldCheck
} from 'lucide-react';

interface CoursePlayerProps {
  completedLessons: string[];
  onMarkLessonComplete: (lessonId: string) => void;
  onResetCourse?: () => void;
  onNextStep?: () => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  completedLessons,
  onMarkLessonComplete,
  onResetCourse,
  onNextStep,
}) => {
  const [activeModuleId, setActiveModuleId] = useState<number>(1);
  const [activeLessonId, setActiveLessonId] = useState<string>('1.1');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [teacherName, setTeacherName] = useState<string>('Thầy / Cô - Trường Tiểu học, THCS & THPT FPT Bắc Giang');
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const activeModule = COURSE_MODULES.find(m => m.id === activeModuleId) || COURSE_MODULES[0];
  const activeLesson = activeModule.lessons.find(l => l.id === activeLessonId) || activeModule.lessons[0];

  const handleLessonSelect = (lesson: Lesson) => {
    setActiveLessonId(lesson.id);
  };

  const handleResetProgress = () => {
    if (onResetCourse) {
      onResetCourse();
    }
    setActiveModuleId(1);
    setActiveLessonId('1.1');
    setQuizAnswers({});
    setQuizSubmitted(false);
    setShowCertificate(false);
  };

  const handleMarkComplete = () => {
    onMarkLessonComplete(activeLessonId);
    
    // Find next lesson if available in active module
    const currentIndex = activeModule.lessons.findIndex(l => l.id === activeLessonId);
    if (currentIndex < activeModule.lessons.length - 1) {
      setActiveLessonId(activeModule.lessons[currentIndex + 1].id);
    } else {
      // Reached the last lesson of current module: Always go to the Module Quiz first!
      setActiveLessonId('quiz');
      setQuizSubmitted(false);
      setQuizAnswers({});
    }
  };

  const handleQuizAnswerSelect = (questionId: string, optionIndex: number) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    // Calculate score
    let correctCount = 0;
    activeModule.quiz.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    if (correctCount === activeModule.quiz.length) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }

    // If completing quiz in Module 3 (the final module)
    if (activeModule.id === 3) {
      // Ensure all lessons are marked as complete
      COURSE_MODULES.forEach(m => {
        m.lessons.forEach(l => {
          if (!completedLessons.includes(l.id)) {
            onMarkLessonComplete(l.id);
          }
        });
      });

      // Show certificate modal after brief delay for quiz feedback
      setTimeout(() => {
        setShowCertificate(true);
        triggerCertificateConfetti();
      }, 500);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const totalLessons = COURSE_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalCompleted = completedLessons.length;
  const progressPercent = Math.round((totalCompleted / totalLessons) * 100);

  const triggerCertificateConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  return (
    <div className="space-y-6">
      {/* Course Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-purple-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-purple-800/40">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-orange-500/10 skew-x-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
                Chương Trình Tập Huấn
              </span>
              <span className="text-xs text-purple-200 font-medium">Trường TH, THCS & THPT FPT Bắc Giang</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              Khóa Học Tạo Mini Webapp Tương Tác Cùng AI Studio
            </h2>
            <p className="text-sm sm:text-base text-purple-100 max-w-2xl leading-relaxed">
              Gồm 3 mô-đun thực hành thiết kế bài giảng, tối ưu hóa Master Prompt và xuất bản sản phẩm học tập cho giáo viên & học sinh. Trải nghiệm để trưởng thành!
            </p>
          </div>

          {/* Progress Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/20 min-w-[240px] text-center space-y-2.5 shrink-0 shadow-lg">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-purple-100">Tiến độ khóa học</span>
              <span className="text-orange-400 font-black text-sm">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-purple-950/60 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-xs text-purple-200 font-medium">
              Đã hoàn thành <strong className="text-white font-extrabold">{totalCompleted}</strong> / {totalLessons} bài học
            </div>

            {totalCompleted > 0 && (
              <button
                onClick={handleResetProgress}
                className="text-xs text-orange-300 hover:text-white underline pt-0.5 block mx-auto transition-colors font-bold"
                title="Xóa danh sách bài học đã học để bắt đầu lại từ đầu"
              >
                Học lại từ đầu (Reset bài)
              </button>
            )}

            {(progressPercent >= 100 || (activeModuleId === 3 && quizSubmitted)) && (
              <button
                onClick={() => {
                  setShowCertificate(true);
                  triggerCertificateConfetti();
                }}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md hover:shadow-lg"
              >
                <Award className="w-4 h-4 text-white" />
                <span>Xem Chứng Nhận</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Module Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COURSE_MODULES.map(module => {
          const isSelected = activeModuleId === module.id;
          const completedInModule = module.lessons.filter(l => completedLessons.includes(l.id)).length;
          return (
            <button
              key={module.id}
              onClick={() => {
                setActiveModuleId(module.id);
                setActiveLessonId(module.lessons[0].id);
              }}
              className={`p-5 rounded-3xl text-left transition-all border shadow-sm relative overflow-hidden ${
                isSelected
                  ? 'bg-white border-purple-600 ring-2 ring-purple-200 shadow-md scale-[1.01]'
                  : 'bg-white/90 hover:bg-white border-slate-200/90 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  isSelected ? 'bg-purple-100 text-purple-900' : 'bg-slate-100 text-slate-600'
                }`}>
                  Mô-đun {module.id}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {completedInModule}/{module.lessons.length} bài
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-1 leading-snug">{module.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-2 font-normal leading-relaxed">{module.description}</p>
            </button>
          );
        })}
      </div>

      {/* Lesson Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Lesson Navigation Sidebar */}
        <div className="lg:col-span-4 bg-white border border-purple-100 rounded-3xl p-5 shadow-sm space-y-3.5">
          <div className="pb-3 border-b border-purple-100/80">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <span>Danh Sách Bài Học</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{activeModule.title}</p>
          </div>

          <div className="space-y-2">
            {activeModule.lessons.map(lesson => {
              const isActive = activeLessonId === lesson.id;
              const isCompleted = completedLessons.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonSelect(lesson)}
                  className={`w-full p-3 rounded-2xl text-left transition-all flex items-center justify-between gap-3 border ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-700 to-indigo-800 text-white border-purple-800 shadow-md'
                      : isCompleted
                      ? 'bg-emerald-50/80 text-emerald-950 border-emerald-200 hover:bg-emerald-100/80'
                      : 'bg-slate-50/80 text-slate-800 border-slate-200/80 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isCompleted ? (
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-emerald-600'}`} />
                    ) : (
                      <Circle className={`w-4 h-4 shrink-0 ${isActive ? 'text-purple-200' : 'text-slate-400'}`} />
                    )}
                    <span className="text-xs sm:text-sm font-bold truncate">
                      {lesson.id}. {lesson.title}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-700'
                  }`}>
                    {lesson.duration}
                  </span>
                </button>
              );
            })}

            {/* Quiz button for active module */}
            <button
              onClick={() => {
                setActiveLessonId('quiz');
                setQuizSubmitted(false);
                setQuizAnswers({});
              }}
              className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-center justify-between gap-3 border mt-3 ${
                activeLessonId === 'quiz'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-600 shadow-md'
                  : 'bg-orange-50/80 text-orange-950 border-orange-200 hover:bg-orange-100/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className={`w-4 h-4 shrink-0 ${activeLessonId === 'quiz' ? 'text-white' : 'text-orange-600'}`} />
                <span className="text-xs sm:text-sm font-extrabold">
                  📝 Bài Kiểm Tra Trắc Nghiệm Mô-đun {activeModule.id}
                </span>
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                activeLessonId === 'quiz' ? 'bg-white text-orange-900' : 'bg-orange-200/80 text-orange-900'
              }`}>
                {activeModule.quiz.length} câu
              </span>
            </button>
          </div>
        </div>

        {/* Right Lesson Detail Area */}
        <div className="lg:col-span-8 bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {activeLessonId === 'quiz' ? (
            /* Quiz View */
            <div className="space-y-6">
              <div className="pb-4 border-b border-purple-100 flex items-center justify-between">
                <div>
                  <span className="bg-orange-100 text-orange-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    Kiểm Tra Mô-đun {activeModule.id}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">
                    Trắc Nghiệm Đánh Giá Kiến Thức
                  </h3>
                </div>
              </div>

              <div className="space-y-6">
                {activeModule.quiz.map((q, qIndex) => {
                  const selectedOpt = quizAnswers[q.id];
                  const isCorrect = selectedOpt === q.correctAnswer;

                  return (
                    <div key={q.id} className="p-5 rounded-3xl border border-purple-100 bg-purple-50/30 space-y-3.5">
                      <h4 className="text-base font-extrabold text-slate-900">
                        Câu {qIndex + 1}: {q.question}
                      </h4>

                      <div className="space-y-2.5">
                        {q.options.map((opt, optIndex) => {
                          const isOptionSelected = selectedOpt === optIndex;
                          let btnClass = "bg-white hover:bg-purple-50/60 border-slate-200 text-slate-800 font-medium";
                          
                          if (quizSubmitted) {
                            if (optIndex === q.correctAnswer) {
                              btnClass = "bg-emerald-100 border-emerald-400 text-emerald-950 font-bold";
                            } else if (isOptionSelected && !isCorrect) {
                              btnClass = "bg-rose-100 border-rose-300 text-rose-950 font-bold";
                            }
                          } else if (isOptionSelected) {
                            btnClass = "bg-purple-50 border-purple-600 text-purple-950 font-bold ring-2 ring-purple-200";
                          }

                          return (
                            <button
                              key={optIndex}
                              onClick={() => handleQuizAnswerSelect(q.id, optIndex)}
                              className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnClass}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && optIndex === q.correctAnswer && (
                                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className={`p-4 rounded-2xl text-xs sm:text-sm font-medium ${
                          isCorrect ? 'bg-emerald-50 text-emerald-950 border border-emerald-200' : 'bg-amber-50 text-amber-950 border border-amber-200'
                        }`}>
                          <strong className="block mb-0.5 text-sm font-extrabold">{isCorrect ? '✓ Chính xác!' : '✕ Chưa đúng'}</strong>
                          <span className="leading-relaxed">{q.explanation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-purple-100 flex items-center justify-between">
                <span className="text-xs sm:text-sm text-slate-500 font-medium">
                  Trả lời đủ các câu để hoàn thành mô-đun
                </span>
                <button
                  onClick={handleSubmitQuiz}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-md hover:shadow-orange-500/20 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>{quizSubmitted ? 'Nộp Lại Bài Kiểm Tra' : 'Nộp Bài Kiểm Tra'}</span>
                </button>
              </div>

              {activeModule.id < 3 && quizSubmitted && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-center space-y-3 animate-fade-in shadow-sm">
                  <div className="flex items-center justify-center gap-2 text-[#0052CC]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h4 className="text-sm sm:text-base font-extrabold uppercase tracking-wide">
                      Đã Hoàn Thành Bài Kiểm Tra Mô-Đun {activeModule.id}!
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
                    Thầy/cô đã sẵn sàng sang nội dung tiếp theo? Nhấp bên dưới để chuyển sang Mô-đun {activeModule.id + 1}.
                  </p>
                  <button
                    onClick={() => {
                      const nextModule = COURSE_MODULES.find(m => m.id === activeModule.id + 1);
                      if (nextModule) {
                        setActiveModuleId(nextModule.id);
                        setActiveLessonId(nextModule.lessons[0].id);
                        setQuizSubmitted(false);
                        setQuizAnswers({});
                      }
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#0052CC] hover:bg-[#0A66C2] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2"
                  >
                    <span>Chuyển Sang Mô-đun {activeModule.id + 1}: {COURSE_MODULES.find(m => m.id === activeModule.id + 1)?.title}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {activeModule.id === 3 && quizSubmitted && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg space-y-3 text-center animate-fade-in">
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-200" />
                    <h4 className="text-sm sm:text-base font-extrabold uppercase tracking-wide">
                      Chúc Mừng Thầy / Cô Đã Hoàn Thành Toàn Bộ 3 Học Phần!
                    </h4>
                  </div>
                  <p className="text-xs text-amber-100 max-w-lg mx-auto leading-relaxed">
                    Thầy/cô đã hoàn tất các bài học và bài trắc nghiệm kiểm tra của chương trình tập huấn. Nhấp bên dưới để xem và nhận Giấy Chứng Nhận Điện Tử.
                  </p>
                  <button
                    onClick={() => {
                      setShowCertificate(true);
                      triggerCertificateConfetti();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-white text-[#0052CC] hover:bg-amber-50 font-extrabold text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2"
                  >
                    <GraduationCap className="w-5 h-5 text-[#0052CC]" />
                    <span>Xem Giấy Chứng Nhận HOÀN THÀNH</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Lesson Detail View */
            <div className="space-y-6">
              {/* Title & Badge Header */}
              <div className="pb-4 border-b border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="bg-purple-100 text-purple-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                      Bài {activeLesson.id}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {activeLesson.duration}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                    {activeLesson.title}
                  </h3>
                </div>

                <button
                  onClick={handleMarkComplete}
                  className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all shadow-sm shrink-0 ${
                    completedLessons.includes(activeLesson.id)
                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                      : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4.5 h-4.5" />
                  <span>{completedLessons.includes(activeLesson.id) ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}</span>
                </button>
              </div>

              {/* Lesson Summary Callout */}
              <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs sm:text-sm text-purple-950 font-medium leading-relaxed shadow-xs">
                <strong className="text-purple-900 font-black">Tóm tắt bài học:</strong> {activeLesson.summary}
              </div>

              {/* Lesson Body Content */}
              <div className="text-slate-800 space-y-4 leading-relaxed text-sm sm:text-base">
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h3: ({ children }) => (
                      <h3 className="text-base sm:text-lg font-black text-slate-900 mt-6 mb-3 pb-1.5 border-b border-purple-100 flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                        <span>{children}</span>
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-3 font-normal">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="space-y-2.5 my-3 pl-1">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="space-y-2.5 my-3 pl-1 list-decimal list-inside text-slate-700 text-sm sm:text-base font-normal">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-sm sm:text-base text-slate-700 leading-relaxed flex items-start gap-2.5">
                        <span className="text-orange-500 font-extrabold mt-0.5 shrink-0">•</span>
                        <div className="flex-1">{children}</div>
                      </li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-black text-slate-900 bg-amber-100 text-amber-950 px-2 py-0.5 rounded-md text-sm sm:text-base">
                        {children}
                      </strong>
                    ),
                    code: ({ children }) => (
                      <code className="bg-purple-50 text-purple-900 font-mono px-2 py-0.5 rounded border border-purple-200 text-xs sm:text-sm font-bold">
                        {children}
                      </code>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {children}
                      </em>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-700 hover:text-orange-600 hover:underline font-extrabold inline-flex items-center gap-1"
                      >
                        {children}
                      </a>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-5 rounded-2xl border border-purple-100 shadow-sm">
                        <table className="w-full text-xs sm:text-sm text-left text-slate-800 border-collapse">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-purple-100/70 text-purple-950 font-black text-xs sm:text-sm border-b border-purple-200">
                        {children}
                      </thead>
                    ),
                    tbody: ({ children }) => (
                      <tbody className="divide-y divide-purple-100 bg-white">
                        {children}
                      </tbody>
                    ),
                    tr: ({ children }) => (
                      <tr className="hover:bg-purple-50/40 transition-colors">
                        {children}
                      </tr>
                    ),
                    th: ({ children }) => (
                      <th className="px-4 py-3 font-extrabold border-r border-purple-100 last:border-r-0">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-4 py-3 border-r border-purple-100 last:border-r-0 leading-relaxed font-normal">
                        {children}
                      </td>
                    )
                  }}
                >
                  {activeLesson.contentMarkdown}
                </Markdown>
              </div>

              {/* Optional Code Snippet */}
              {activeLesson.codeSnippet && (
                <div className="rounded-2xl bg-slate-900 text-slate-100 p-5 space-y-3 border border-slate-800 shadow-lg">
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                    <span className="font-mono text-xs text-orange-400 font-bold">Cấu trúc Master Prompt mẫu</span>
                    <button
                      onClick={() => handleCopyCode(activeLesson.codeSnippet!)}
                      className="hover:text-orange-300 transition-colors flex items-center gap-1.5 font-bold"
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedCode ? 'Đã chép' : 'Sao chép'}</span>
                    </button>
                  </div>
                  <pre className="text-xs sm:text-sm font-mono text-amber-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {activeLesson.codeSnippet}
                  </pre>
                </div>
              )}

              {/* Key Takeaways */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/80 border border-orange-200 space-y-2.5">
                <h4 className="text-xs sm:text-sm font-black text-orange-950 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4.5 h-4.5 text-orange-600" />
                  Ghi Nhớ Trọng Tâm (Key Takeaways):
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-800 font-medium">
                  {activeLesson.keyTakeaways.map((point, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <span className="text-orange-600 font-extrabold">•</span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Lesson Action Footer */}
              <div className="pt-5 border-t border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-500 font-medium">
                  Bài học thuộc chương trình Tập huấn AI FPT Bắc Giang
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleMarkComplete}
                    className="px-5 py-2.5 rounded-2xl bg-indigo-950 hover:bg-slate-900 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all shadow-md"
                  >
                    <span>Bài tiếp theo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {onNextStep && (
                    <button
                      onClick={onNextStep}
                      className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all shadow-md"
                    >
                      <span>Sang Bước 3: Tạo Prompt</span>
                      <Sparkles className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
          {/* Viewport Fixed Close Button - Always visible regardless of scrolling or zoom */}
          <button
            onClick={() => {
              handleResetProgress();
            }}
            className="fixed top-3 right-3 sm:top-5 sm:right-6 z-[70] text-slate-900 hover:text-black font-black text-base w-11 h-11 rounded-full bg-white hover:bg-orange-50 shadow-2xl border-2 border-orange-500 flex items-center justify-center transition-all print:hidden"
            title="Đóng & Reset Lượt Học Cho Người Tiếp Theo"
          >
            ✕
          </button>

          {/* Scrollable Container with Top Padding */}
          <div className="min-h-full flex items-start sm:items-center justify-center p-3 sm:p-6 py-10 sm:py-12">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 border-4 border-indigo-900 shadow-2xl relative space-y-6 text-center print:border-2 print:shadow-none print:rounded-none">
              
              {/* Inner Card Close Button */}
              <button
                onClick={() => {
                  handleResetProgress();
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all print:hidden"
                title="Đóng & Reset Lượt Học"
              >
                ✕
              </button>

              {/* Inner Decorative Golden Frame */}
              <div className="border-2 border-amber-400 rounded-2xl p-5 sm:p-8 relative bg-gradient-to-b from-amber-50/40 via-white to-purple-50/30 shadow-inner space-y-6">
                
                {/* Corner Ornaments */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-500"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-500"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-500"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-500"></div>

                {/* Certificate Header */}
                <div className="space-y-3">
                  <div className="flex justify-center pb-1">
                    <FptLogo className="h-10 sm:h-12" variant="dark" />
                  </div>
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-white border-2 border-amber-300 shadow-md mx-auto">
                    <GraduationCap className="w-8 h-8 sm:w-9 sm:h-9" />
                  </div>
                  <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-indigo-950">
                    TRƯỜNG TIỂU HỌC, THCS & THPT FPT BẮC GIANG
                  </h2>
                  
                  <div className="py-1">
                    <h1 className="text-3xl sm:text-5xl font-black tracking-wider font-serif uppercase text-indigo-950">
                      CERTIFICATE
                    </h1>
                    <p className="text-xs sm:text-sm font-black text-orange-600 uppercase tracking-widest mt-1">
                      CHỨNG NHẬN HOÀN THÀNH TẬP HUẤN
                    </p>
                  </div>

                  <p className="text-xs font-black text-amber-700 uppercase tracking-widest italic">
                    "Trải nghiệm để trưởng thành!"
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide">
                    CHƯƠNG TRÌNH TẬP HUẤN TẠO MINI WEBAPP CÙNG GOOGLE AI STUDIO
                  </p>
                </div>

                {/* Certificate Recipient Section */}
                <div className="py-4 border-y-2 border-amber-200/80 space-y-3">
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">Trân trọng trao tặng thầy / cô:</p>
                  <div className="max-w-2xl mx-auto px-2">
                    <textarea
                      rows={teacherName.length > 35 ? 2 : 1}
                      value={teacherName}
                      onChange={e => setTeacherName(e.target.value)}
                      className="text-center font-black text-lg sm:text-xl md:text-2xl text-indigo-950 border-b-2 border-orange-500 focus:border-indigo-950 outline-none px-4 py-2 w-full bg-amber-50/70 rounded-2xl transition-all shadow-inner focus:ring-2 focus:ring-purple-200 resize-none overflow-hidden leading-snug"
                      placeholder="Nhập Họ và tên đầy đủ của Thầy / Cô..."
                    />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed font-medium pt-1">
                    Đã hoàn thành xuất sắc các mô-đun tập huấn, làm quen môi trường Build mode, cấu trúc Master Prompt và quy trình chuyển đổi bài giảng thành Mini Webapp tương tác.
                  </p>
                </div>

                {/* Signatures & Verification */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 px-2 sm:px-6 pt-1">
                  <div className="text-center sm:text-left space-y-1">
                    <p className="font-bold text-slate-900">
                      <span className="text-slate-500 font-normal">Ngày cấp:</span> {new Date().toLocaleDateString('vi-VN')}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded-md inline-block">
                      Mã xác minh: FPT-BG-AI-855457
                    </p>
                    <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold justify-center sm:justify-start pt-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Chứng nhận Điện tử Chính thức</span>
                    </div>
                  </div>

                  <div className="text-center space-y-1 sm:min-w-[220px]">
                    <p className="font-black text-indigo-950 text-xs sm:text-sm uppercase tracking-wider">
                      GIÁM ĐỐC ĐIỀU HÀNH
                    </p>
                    <p className="text-[10px] text-slate-500 italic">Trường TH, THCS & THPT FPT Bắc Giang</p>

                    <div className="py-2.5 flex flex-col items-center justify-center space-y-1 text-center">
                      <span className="text-xs font-bold text-purple-800 italic tracking-widest uppercase text-center block">
                        (Đã ký)
                      </span>
                      <p className="font-sans font-black text-slate-900 text-base sm:text-xl tracking-wide pt-1 text-center">
                        Đinh Đức Hiền
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Print & Action buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3 print:hidden">
                <button
                  onClick={() => {
                    window.print();
                    handleResetProgress();
                  }}
                  className="px-6 py-3 rounded-2xl bg-indigo-950 hover:bg-slate-900 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <Printer className="w-4.5 h-4.5 text-orange-400" />
                  <span>In / Tải Chứng Nhận & Reset Lượt Học</span>
                </button>

                <button
                  onClick={() => {
                    handleResetProgress();
                    alert("Đã xác nhận nhận chứng nhận thành công! Các bài học đã được tự động reset về chưa học để phục vụ người tiếp theo.");
                  }}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                  title="Xác nhận nhận chứng nhận và tự động reset các bài học về chưa học cho người tiếp theo"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Xác Nhận Nhận Chứng Chỉ & Reset Lượt Học</span>
                </button>

                <button
                  onClick={() => {
                    handleResetProgress();
                  }}
                  className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all"
                >
                  ✕ Đóng & Reset Lượt Học
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
